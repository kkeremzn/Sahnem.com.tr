using System.Globalization;
using System.Net;

namespace Sahnem.Business.Email
{
    // Tüm şablonlar tek bir markalı "zarf" (Shell) paylaşır — koyu üst bant,
    // Sahnem logosu, beyaz kart gövdesi, ortak alt bilgi. Sahnem_Eposta_Onizleme.html
    // referans tasarımından bire bir üretildi (renkler, aralıklar, tipografi dahil).
    public static class EmailTemplates
    {
        private const string LogoBase64 =
            "iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAHZklEQVR4nO3ZUVLjOBRAUTLV64O1wgYzX6meoroHcgHryTlnA35Ylq5Nnp4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4LMuqweAo7w+X69HXevl7WJvcXoeck7vyHC8JyScmYeb01oZjveEhDP6Z/UA8BMmxePpad488B0EhNOZelhPnQsqAeFUph/S0+eDewgIAImAcBq7vN3vMid8REAASASEU9jtrX63eeFPBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEh+rR6Aj70+X69HXevl7XI56lrsyfPIjcUZ7MiN+t5uG3flvarc48/b7V49Cosy0KTDcJeNO+mefZZ7e79d7tmj8BvIMJM269PTvHk41rT1nzbPoxOQQaZujqlz8bOmrvvUuR6RgAwxfVNMn4/vNX29p8/3KAQEgERABtjlbWqXOfmaXdZ5lznPTEAASARksd3eonabl/vstr67zXs2AgJAIiAAJAICQCIgACQCAkAiIAAkAgJAIiAAJAICQCIgACQCAkAiIAAkAgJAIiAAJAICQCIgACQCAkAiIAAkAgJAIiAAJAICQCIgACQCAkAiIAAkAgJAIiAAJAICQCIgACQCAkAiIAAkAgJAIiAAJAICQCIgACQCAkAiIAAkAgJAIiAAJAICQCIgACQCAkAiIAAkAgJAIiAAJL9WD/Anr8/X61HXenm7XI66FnA+j3xejQrIkQvx/prTFgaYzXk1JCArFuJvM0xZGGAm59Vvy38DmbAY/zVtHmCOaefD6nmWBmT1H/83U+cC1pl6Lqyca1lApi7GzfT5gONMPw9Wzbf8X1gA7GlJQKbX/GaXOYGfs8s5sGJOXyAAJIcHZJea3+w2L/B9dtv/R8/rCwSAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIDg/Iy9vlcvQ1v2K3eYHvs9v+P3peXyAAJEsCskvVd5kT+Dm7nAMr5vQFAkCyLCDTqz59PuA408+DVfMt/QKZuihT5wLWmXourJxr+b+wpi3KtHmAOaadD6vn+bXy4je3m/D6fL2ungHg/zivfhsRkJsVCzNlIYC9OK+GBeRm2k0C+JtHPq+W/wYCwJ4EBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQBZ7ebtcVs9wj93m5T67re9u856NgACQCMgAu7xF7TInX7PLOu8y55kJCACJgAwx/W1q+nx8r+nrPX2+RyEgg0zdFFPn4mdNXfepcz0iARlm2uaYNg/Hmrb+0+Z5dBZjsNfn63XVtXfbqCvvVeUef95u9+pRWJQNHLlxd92oAnIczyM3FodTEBA4nt9AAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREAASAQEgERAAEgEBIBEQABIBASAREA4hZe3y2X1DPfYbV74EwEBIBEQTmOXt/pd5oSPCAgAiYBwKtPf7qfPB/cQEE5n6iE9dS6oBIRTmnZYT5sHvoOHmtN7fb5eV11bODgzDzcP48iQCAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACn9S/0oVTExOS9egAAAABJRU5ErkJggg==";

        private static string Encode(string? s) => WebUtility.HtmlEncode(s ?? "");

        // Eyebrow etiketleri her zaman sabit Türkçe literaller — invariant/ASCII
        // ToUpper "ı" harfini dönüştürmediği için (ör. "detayı" -> "DETAYı") tr-TR
        // kültürüyle büyütülüyor.
        private static readonly CultureInfo TurkishCulture = CultureInfo.GetCultureInfo("tr-TR");
        private static string UpperTr(string s) => s.ToUpper(TurkishCulture);

        private static readonly string[] TurkishMonths =
        {
            "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
        };

        // Servis katmanından buraya hep DateTime.UtcNow/UTC bir zaman damgası
        // geliyor ama e-postada olduğu gibi (3 saat geride) gösteriliyordu —
        // Türkiye 2016'dan beri yaz saati uygulamadığı için sabit +3 yeterli,
        // TimeZoneInfo.FindSystemTimeZoneById'nin sunucuya göre (Linux/Windows
        // farklı ID'ler) kırılgan olmasından kaçınmak için elle ekleniyor.
        private static DateTime ToTurkeyTime(DateTime dt)
        {
            var utc = dt.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(dt, DateTimeKind.Utc) : dt.ToUniversalTime();
            return utc.AddHours(3);
        }

        public static string FormatTurkishDateTime(DateTime dt)
        {
            var local = ToTurkeyTime(dt);
            return $"{local.Day} {TurkishMonths[local.Month - 1]} {local.Year} · {local:HH.mm}";
        }

        // Ortak zarf: eyebrow kategori etiketi, <br> içerebilen başlık, önizleme
        // metni (gelen kutusunda görünür), gövde HTML'i ve isteğe bağlı alt not.
        private static string Shell(string eyebrow, string headlineHtml, string preheader, string bodyHtml, string? footerNote = null)
        {
            var footer = footerNote ?? "Bu e-posta Sahnem hesabınla ilgili bir işlem nedeniyle gönderildi.";
            return $@"<!doctype html><html lang=""tr""><head><meta charset=""utf-8""><meta name=""viewport"" content=""width=device-width, initial-scale=1""><meta name=""color-scheme"" content=""light""><style>@media(max-width:620px){{.outer{{padding:16px 8px!important}}.pad{{padding:28px 24px!important}}.headline{{font-size:34px!important;line-height:38px!important}}.card{{width:100%!important}}}}</style></head><body style=""margin:0;background:#edeaf1;font-family:Arial,Helvetica,sans-serif;color:#211b29"">
<div style=""display:none;font-size:1px;color:#edeaf1;max-height:0;overflow:hidden;mso-hide:all"">{Encode(preheader)}</div>
<table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" bgcolor=""#edeaf1""><tr><td align=""center"" class=""outer"" style=""padding:40px 12px"">
<table role=""presentation"" class=""card"" width=""600"" cellspacing=""0"" cellpadding=""0"" style=""width:100%;max-width:600px;background:white;border-radius:20px;overflow:hidden"">
<tr><td height=""4"" bgcolor=""#b14eff"" style=""font-size:1px"">&nbsp;</td></tr>
<tr><td class=""pad"" bgcolor=""#111017"" style=""padding:28px 40px""><table role=""presentation"" width=""100%""><tr><td><img src=""data:image/png;base64,{LogoBase64}"" width=""30"" height=""30"" alt="""" style=""vertical-align:middle;border:0""> <span style=""font-size:22px;font-weight:bold;letter-spacing:2px;color:#f6f2ff;vertical-align:middle"">SAHNEM</span></td><td align=""right"" style=""font-size:10px;letter-spacing:1.5px;color:#c7a9de"">SAHNE SENİN.</td></tr></table></td></tr>
<tr><td class=""pad"" style=""padding:40px""><p style=""font-size:10px;font-weight:bold;letter-spacing:2px;color:#842ac6;margin:0 0 20px"">{UpperTr(eyebrow)}</p><h1 class=""headline"" style=""font-size:42px;line-height:46px;letter-spacing:-1.7px;font-weight:700;margin:0 0 22px;color:#17101f"">{headlineHtml}</h1>{bodyHtml}</td></tr>
<tr><td class=""pad"" style=""padding:24px 40px;border-top:1px solid #eee9f3""><p style=""font-size:13px;line-height:23px;color:#655b71;margin:0"">Bir sorunda buradayız.<br><a href=""mailto:support@sahnem.com.tr"" style=""color:#7523ba;text-decoration:none;font-weight:bold"">support@sahnem.com.tr</a></p></td></tr>
</table>
<table role=""presentation"" width=""100%"" style=""max-width:600px""><tr><td align=""center"" style=""padding:24px 20px;color:#80768b;font-size:11px;line-height:19px"">{footer}<br><a href=""https://sahnem.com.tr"" style=""color:#62536f;text-decoration:none"">sahnem.com.tr</a> · Müzisyenler, mekânlar, organizatörler.</td></tr></table>
</td></tr></table></body></html>";
        }

        private static string Paragraph(string text)
            => $@"<p style=""font-size:16px;line-height:27px;color:#665d70;margin:0"">{text}</p>";

        private static string OtpBox(string code, int expiryMinutes)
            => $@"<div style=""background:#f2e8ff;border:1px solid #e1c5ff;border-radius:16px;text-align:center;padding:26px 12px;margin:26px 0""><p style=""font-size:11px;letter-spacing:2px;color:#684789;margin:0 0 14px"">TEK KULLANIMLIK KOD</p><p style=""font-family:Consolas,monospace;font-size:38px;letter-spacing:7px;color:#7523ba;font-weight:bold;margin:0"">{Encode(code)}</p><p style=""font-size:13px;color:#684789;margin:14px 0 0"">{expiryMinutes} dakika geçerli</p></div><p style=""font-size:13px;line-height:21px;color:#6c6578"">Bu kodu kimseyle paylaşma. İsteği sen yapmadıysan bu e-postayı yok sayabilirsin.</p>";

        private static string DetailCard(string eyebrow, string title, string linesHtml)
            => $@"<table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""margin:26px 0;background:#f6f4f9;border:1px solid #e8e3ed;border-radius:14px""><tr><td style=""padding:22px""><p style=""color:#8b1fe0;font-size:11px;letter-spacing:1.5px;margin:0 0 12px"">{UpperTr(eyebrow)}</p><p style=""font-size:20px;line-height:28px;font-weight:bold;color:#19131f;margin:0 0 12px"">{title}</p><p style=""font-size:14px;color:#655d70;line-height:24px;margin:0"">{linesHtml}</p></td></tr></table>";

        private static string CtaButton(string url, string label)
        {
            var button = $@"<table role=""presentation"" cellspacing=""0"" cellpadding=""0"" style=""margin:28px 0 12px""><tr><td bgcolor=""#8322cd"" style=""border-radius:10px;mso-padding-alt:16px 26px""><a href=""{url}"" style=""display:inline-block;border:1px solid #8322cd;border-radius:10px;padding:16px 26px;font:bold 14px Arial,sans-serif;color:#ffffff;text-decoration:none"">{Encode(label)} &nbsp; →</a></td></tr></table>";
            // mailto: linki için "buton açılmıyorsa tıkla" yedek metni anlamsız —
            // ya posta istemcisi açılır ya açılmaz, gösterilecek ayrı bir "yedek
            // sayfa" yok.
            if (url.StartsWith("mailto:", StringComparison.OrdinalIgnoreCase)) return button;
            return button + $@"<p style=""font-size:11px;line-height:18px;color:#776d83;overflow-wrap:anywhere"">Buton açılmıyorsa: <a href=""{url}"" style=""color:#776d83"">{url}</a></p>";
        }

        // ---- Hesap / doğrulama ----

        public static string VerificationCode(string firstName, string code, int expiryMinutes = 15)
            => Shell(
                "Hesap",
                "Sahneye bir<br>adım kaldı.",
                "Sahneye bir adım kaldı. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, e-posta adresini doğrulamak için aşağıdaki kodu kullan.") + OtpBox(code, expiryMinutes));

        public static string PasswordResetCode(string firstName, string code, int expiryMinutes = 15)
            => Shell(
                "Güvenlik",
                "Hesabına<br>yeniden eriş.",
                "Şifreni sıfırlamak için bir kod gönderdik. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, şifreni sıfırlamak için aşağıdaki kodu kullan.") + OtpBox(code, expiryMinutes));

        public static string Welcome(string firstName, string actionUrl = "https://sahnem.com.tr/dashboard")
        {
            var steps = @"<table role=""presentation"" width=""100%"" style=""margin:25px 0;border-top:1px solid #eee7f4"" cellspacing=""0"" cellpadding=""0"">"
                + Step("01", "Profilini tamamla")
                + Step("02", "Sana uygun bağlantıları keşfet")
                + Step("03", "İlk adımını Sahnem'de at")
                + "</table>";
            return Shell(
                "Hesap",
                "Bir sonraki sahnen<br>burada başlıyor.",
                "Bir sonraki sahnen burada başlıyor. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"E-posta adresin doğrulandı. Şimdi profilini tamamla; müzisyenleri, mekânları ve organizatörleri keşfet.")
                + steps + CtaButton(actionUrl, "Profilimi tamamla"));

            static string Step(string number, string label)
                => $@"<tr><td width=""38"" style=""padding:14px 0;color:#8b1fe0;font-size:12px"">{number}</td><td style=""padding:14px 0;color:#292230;font-size:14px;border-bottom:1px solid #eee7f4"">{Encode(label)}</td></tr>";
        }

        // ---- Yönetici / destek ----

        public static string AdminResetCode(string code, int expiryMinutes = 15)
            => Shell(
                "Güvenlik",
                "Yönetici hesabı<br>kurtarma kodu.",
                "Yönetici hesabı kurtarma kodun. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph("Yönetici hesabın için şifre sıfırlama isteği alındı. Bu kod yalnızca ilgili kurtarma işlemi içindir.") + OtpBox(code, expiryMinutes));

        public static string SupportVerificationCode(string firstName, string code, int expiryMinutes = 15)
            => Shell(
                "Hesap",
                "Hesabını<br>doğrulayalım.",
                "Doğrulama kodun yeniden gönderildi. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, destek ekibimiz doğrulama kodunu yeniden gönderdi. İşleme bu yeni kodla devam edebilirsin.") + OtpBox(code, expiryMinutes));

        public static string SupportResetCode(string firstName, string code, int expiryMinutes = 15)
            => Shell(
                "Güvenlik",
                "Hesabına<br>yeniden eriş.",
                "Destek ekibimiz şifre sıfırlama kodu gönderdi. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, destek ekibimiz hesabın için yeni bir şifre sıfırlama kodu gönderdi. Yeni şifreni yalnızca Sahnem üzerinden belirle.") + OtpBox(code, expiryMinutes));

        // ---- Güvenlik bildirimleri ----

        public static string PasswordChanged(string firstName, DateTime changedAtUtc, string actionUrl = "mailto:support@sahnem.com.tr")
            => Shell(
                "Güvenlik",
                "Şifren<br>değiştirildi.",
                "Şifren değiştirildi. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, hesabının şifresi {FormatTurkishDateTime(changedAtUtc)} tarihinde değiştirildi. Bu işlemi sen yapmadıysan destek ekibimizle hemen iletişime geç.")
                + CtaButton(actionUrl, "Destekle iletişime geç"));

        public static string AccountSuspended(string firstName, string reason, string actionUrl = "mailto:support@sahnem.com.tr")
            => Shell(
                "Güvenlik",
                "Hesabın<br>askıya alındı.",
                "Hesabın hakkında bir bilgilendirme. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, hesabının erişimi askıya alındı. Gerekçe: {Encode(reason)}. Kararla ilgili açıklama veya inceleme talebini destek ekibimize iletebilirsin.")
                + CtaButton(actionUrl, "Destekle iletişime geç"));

        public static string AccountReactivated(string firstName, string actionUrl = "https://sahnem.com.tr/login")
            => Shell(
                "Hesap",
                "Tekrar<br>hoş geldin.",
                "Hesabın yeniden aktif. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, hesabının erişimi yeniden açıldı. Sahnem'e giriş yaparak kaldığın yerden devam edebilirsin.")
                + CtaButton(actionUrl, "Sahnem'e giriş yap"));

        // ---- İlan ve teklif ----

        public static string CityAdvert(string firstName, string advertTitle, string city, string address, DateTime eventTime, int advertId)
            => Shell(
                "İlan ve teklif",
                "Şehrinde yeni<br>bir fırsat var.",
                "Şehrinde yeni bir fırsat var. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, şehir bildirim tercihinle eşleşen yeni bir ilan yayımlandı. Detayları inceleyip sana uygun olup olmadığına karar verebilirsin.")
                + DetailCard("Sahne detayı", Encode(advertTitle), $"{Encode(address)} · {Encode(city)}<br>{FormatTurkishDateTime(eventTime)}")
                + CtaButton($"https://sahnem.com.tr/jobs/{advertId}", "İlanı incele"),
                "Şehir ilan bildirimlerini etkinleştirdiğin için gönderildi.");

        public static string NewOffer(string firstName, string musicianName, string advertTitle, string city, string address, DateTime eventTime, decimal amount, int advertId)
            => Shell(
                "İlan ve teklif",
                "İlanına yeni<br>bir teklif geldi.",
                "İlanına yeni bir teklif geldi. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, {Encode(musicianName)} ilanına bir teklif gönderdi. Profilini ve teklif detaylarını birlikte inceleyebilirsin.")
                + DetailCard("Teklif detayı", Encode(advertTitle), $"{Encode(address)} · {Encode(city)}<br>{FormatTurkishDateTime(eventTime)}<br>Teklif: {amount:N0} TL")
                + CtaButton($"https://sahnem.com.tr/my-adverts/{advertId}", "Teklifi incele"));

        public static string OfferAccepted(string firstName, string advertTitle, string city, string address, DateTime eventTime, int offerId)
            => Shell(
                "İlan ve teklif",
                "Güzel haber:<br>teklifin kabul edildi.",
                "Güzel haber: teklifin kabul edildi. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, ilan sahibi teklifini kabul etti. Etkinlik ayrıntılarını ve beklentileri mesajlaşarak netleştirebilirsiniz.")
                + DetailCard("Sahne detayı", Encode(advertTitle), $"{Encode(address)} · {Encode(city)}<br>{FormatTurkishDateTime(eventTime)}")
                + CtaButton($"https://sahnem.com.tr/offers/{offerId}", "Teklifimi görüntüle"));

        public static string OfferRejected(string firstName, string advertTitle)
            => Shell(
                "İlan ve teklif",
                "Bu kez olmadı.<br>Yeni fırsatlar var.",
                "Bu kez olmadı. Yeni fırsatlar var. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, \"{Encode(advertTitle)}\" ilanına gönderdiğin teklif kabul edilmedi. Sana uygun diğer ilanları keşfetmeye devam edebilirsin.")
                + CtaButton("https://sahnem.com.tr/jobs", "İlanları keşfet"));

        public static string AdvertCancelled(string firstName, string advertTitle)
            => Shell(
                "İlan ve teklif",
                "İlan hakkında<br>bir güncelleme.",
                "İlan hakkında bir güncelleme. Sahnem'den hesabına özel bir güncelleme.",
                Paragraph($"Merhaba {Encode(firstName)}, teklif verdiğin \"{Encode(advertTitle)}\" ilanı sahibi tarafından iptal edildi. Bu ilan için süreç sona erdi. Diğer fırsatları inceleyebilirsin.")
                + CtaButton("https://sahnem.com.tr/jobs", "Diğer ilanları gör"));

        // ---- Mesaj ----

        public static string NewMessage(string firstName, string senderName, int conversationId)
            => Shell(
                "Mesaj ve destek",
                "Sohbetin<br>devam ediyor.",
                "Sahnem'de yeni bir mesajın var.",
                Paragraph($"Merhaba {Encode(firstName)}, {Encode(senderName)} sana yeni bir mesaj gönderdi. Mesajını güvenli biçimde Sahnem'e giriş yaparak okuyabilirsin.")
                + CtaButton($"https://sahnem.com.tr/messages/{conversationId}", "Mesajı oku"));
    }
}
