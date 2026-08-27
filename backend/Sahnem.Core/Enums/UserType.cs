namespace Sahnem.Core.Enums
{
    public enum UserType
    {
        None = 0,
        Musician = 1,
        Organizer = 2,
        Venue = 3,
        // Sadece manuel olarak (DB üzerinden) atanır — hiçbir register/profil
        // oluşturma akışı bu rolü kendiliğinden veremez (bkz. BACKEND-TODO.md).
        Admin = 4
    }
}