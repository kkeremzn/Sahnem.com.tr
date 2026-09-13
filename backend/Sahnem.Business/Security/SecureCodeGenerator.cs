using System.Security.Cryptography;

namespace Sahnem.Business.Security
{
    // E-posta doğrulama/şifre sıfırlama kodları için Random.Shared (kriptografik
    // olmayan, tahmin edilebilir bir PRNG) kullanılıyordu — güvenlik kodları için
    // kriptografik olarak güvenli bir üreteç gerekir.
    public static class SecureCodeGenerator
    {
        public static string SixDigitCode() => RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
    }
}
