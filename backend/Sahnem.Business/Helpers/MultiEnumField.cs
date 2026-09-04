namespace Sahnem.Business.Helpers
{
    // MusicianProfile.Branch/Genres veritabanında hâlâ düz bir string sütun —
    // migration gerektirmeden çoklu seçime geçebilmek için virgülle ayrılmış
    // enum adları olarak saklanıyor ("Guitar,Piano" gibi). Bu sınıf o
    // dönüşümü (liste <-> string) tek yerden, tutarlı şekilde yapıyor.
    public static class MultiEnumField
    {
        public static string Join<TEnum>(IEnumerable<TEnum> values) where TEnum : struct, Enum
        {
            return string.Join(",", values.Select(v => v.ToString()));
        }

        public static List<TEnum> Parse<TEnum>(string? raw) where TEnum : struct, Enum
        {
            if (string.IsNullOrWhiteSpace(raw)) return new List<TEnum>();

            return raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(s => Enum.TryParse<TEnum>(s, out var value) ? (TEnum?)value : null)
                .Where(v => v.HasValue)
                .Select(v => v!.Value)
                .ToList();
        }

        public static TEnum? ParseFirst<TEnum>(string? raw) where TEnum : struct, Enum
        {
            var values = Parse<TEnum>(raw);
            return values.Count > 0 ? values[0] : null;
        }
    }
}
