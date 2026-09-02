using System.Diagnostics;
using System.Net.Sockets;
using Microsoft.AspNetCore.Mvc;

namespace Sahnem.API.Controllers
{
    // GEÇİCİ — sadece Render container'ından hangi outbound portların erişilebilir
    // olduğunu teşhis etmek için eklendi (SMTP timeout sorununu araştırmak amacıyla).
    // Sorun çözülünce bu controller tamamen silinecek.
    [ApiController]
    [Route("api/[controller]")]
    public class DiagnosticsController : ControllerBase
    {
        [HttpGet("tcp-check")]
        public async Task<IActionResult> TcpCheck()
        {
            var targets = new (string Host, int Port)[]
            {
                ("smtp.zoho.eu", 465),
                ("smtp.zoho.eu", 587),
                ("smtp.zoho.com", 465),
                ("smtp.zoho.com", 587),
                ("google.com", 443),
                ("api.resend.com", 443),
            };

            var results = new List<object>();
            foreach (var (host, port) in targets)
            {
                var sw = Stopwatch.StartNew();
                try
                {
                    using var client = new TcpClient();
                    var connectTask = client.ConnectAsync(host, port);
                    var timeoutTask = Task.Delay(TimeSpan.FromSeconds(8));
                    var completed = await Task.WhenAny(connectTask, timeoutTask);
                    sw.Stop();

                    if (completed == timeoutTask)
                    {
                        results.Add(new { host, port, success = false, ms = sw.ElapsedMilliseconds, error = "timeout" });
                    }
                    else if (connectTask.IsFaulted)
                    {
                        results.Add(new { host, port, success = false, ms = sw.ElapsedMilliseconds, error = connectTask.Exception?.GetBaseException().Message });
                    }
                    else
                    {
                        results.Add(new { host, port, success = client.Connected, ms = sw.ElapsedMilliseconds, error = (string?)null });
                    }
                }
                catch (Exception ex)
                {
                    sw.Stop();
                    results.Add(new { host, port, success = false, ms = sw.ElapsedMilliseconds, error = ex.Message });
                }
            }

            return Ok(results);
        }
    }
}
