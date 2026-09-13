namespace Sahnem.Business.Interfaces
{
    public interface IEmailService
    {
        // Gönderim gerçekten başarılı oldu mu bilgisini döner — önceden "void" idi
        // ve hatalar sadece loglanıyordu, bu yüzden toplu gönderimde alıcı sayısı
        // "başarıyla teslim edildi" gibi yanlış anlaşılabiliyordu.
        Task<bool> SendAsync(string toEmail, string subject, string htmlBody);
    }
}
