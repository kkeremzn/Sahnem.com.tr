namespace Sahnem.Core.Entities
{
    // Organizatör/mekan bir müzisyeni favorilerine ekler.
    public class Favorite : BaseEntity
    {
        public int OwnerUserId {get; set;}
        public int MusicianUserId {get; set;}

        public virtual AppUser Owner {get; set;}
        public virtual AppUser Musician {get; set;}
    }
}
