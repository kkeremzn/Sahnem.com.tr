// Backend ile birebir eşleşen enum tanımları.
// Kaynak: backend/Sahnem.Core/Enums/*.cs — değerler string-literal union olarak
// tutuluyor (numeric/string JSON serileştirmesi fark etmeksizin kolay eşleşsin diye).

export const USER_TYPES = ['Musician', 'Organizer', 'Venue'] as const;
// Backend'de ayrıca "Admin" var (bkz. Sahnem.Core/Enums/UserType.cs) ama sadece
// manuel olarak DB'den atanıyor, register akışında hiç seçilemiyor — bu yüzden
// USER_TYPES (kayıt formundaki seçenekler) dışında, ayrı bir tip olarak tutuluyor.
export type UserType = (typeof USER_TYPES)[number] | 'Admin';

export const USER_TYPE_LABELS: Record<UserType, string> = {
  Musician: 'Müzisyen',
  Organizer: 'Organizatör',
  Venue: 'Mekan',
  Admin: 'Yönetici',
};

export const MUSIC_BRANCHES = [
  'Vocal', 'Guitar', 'BassGuitar', 'Drums', 'Piano', 'Keyboard', 'Violin',
  'Cello', 'Saxophone', 'Clarinet', 'Trumpet', 'Flute', 'DJ', 'Producer',
  'Percussion', 'Oud', 'Baglama', 'Kanun', 'Trombone', 'Tuba', 'FrenchHorn',
  'Ney', 'Zurna', 'Mey', 'Kemenche', 'Tulum', 'Harmonica',
] as const;
export type MusicBranch = (typeof MUSIC_BRANCHES)[number];

export const MUSIC_BRANCH_LABELS: Record<MusicBranch, string> = {
  Vocal: 'Vokal', Guitar: 'Gitar', BassGuitar: 'Bas Gitar', Drums: 'Davul',
  Piano: 'Piyano', Keyboard: 'Klavye', Violin: 'Keman', Cello: 'Çello',
  Saxophone: 'Saksafon', Clarinet: 'Klarnet', Trumpet: 'Trompet', Flute: 'Flüt',
  DJ: 'DJ', Producer: 'Prodüktör', Percussion: 'Perküsyon', Oud: 'Ud',
  Baglama: 'Bağlama', Kanun: 'Kanun', Trombone: 'Trombon', Tuba: 'Tuba',
  FrenchHorn: 'Korno', Ney: 'Ney', Zurna: 'Zurna', Mey: 'Mey',
  Kemenche: 'Kemençe', Tulum: 'Tulum', Harmonica: 'Armonika',
};

export const MUSIC_GENRES = [
  'Pop', 'Rock', 'Jazz', 'Blues', 'Classical', 'Electronic', 'HipHop', 'RnB',
  'Reggae', 'Country', 'Folk', 'TurkishFolk', 'TurkishClassical', 'Arabesque',
  'Latin', 'Funk', 'Soul', 'Metal', 'Punk', 'Indie', 'Alternative', 'Disco',
  'House', 'Techno', 'Ambient', 'WorldMusic', 'Flamenco', 'Tango', 'Salsa',
  'Gospel', 'Opera', 'Swing', 'Ska', 'Acoustic', 'Instrumental', 'Cover',
] as const;
export type MusicGenre = (typeof MUSIC_GENRES)[number];

export const MUSIC_GENRE_LABELS: Record<MusicGenre, string> = {
  Pop: 'Pop', Rock: 'Rock', Jazz: 'Caz', Blues: 'Blues', Classical: 'Klasik',
  Electronic: 'Elektronik', HipHop: 'Hip Hop', RnB: 'R&B', Reggae: 'Reggae',
  Country: 'Country', Folk: 'Folk', TurkishFolk: 'Türk Halk Müziği',
  TurkishClassical: 'Türk Sanat Müziği', Arabesque: 'Arabesk', Latin: 'Latin',
  Funk: 'Funk', Soul: 'Soul', Metal: 'Metal', Punk: 'Punk', Indie: 'Indie',
  Alternative: 'Alternatif', Disco: 'Disko', House: 'House', Techno: 'Techno',
  Ambient: 'Ambient', WorldMusic: 'Dünya Müziği', Flamenco: 'Flamenko',
  Tango: 'Tango', Salsa: 'Salsa', Gospel: 'Gospel', Opera: 'Opera',
  Swing: 'Swing', Ska: 'Ska', Acoustic: 'Akustik', Instrumental: 'Enstrümantal',
  Cover: 'Cover',
};

export const VENUE_TYPES = [
  'Bar', 'NightClub', 'ConcertHall', 'FestivalArea', 'OutdoorVenue',
  'Restaurant', 'Hotel', 'WeddingHall', 'Other',
] as const;
export type VenueType = (typeof VENUE_TYPES)[number];

export const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  Bar: 'Bar', NightClub: 'Gece Kulübü', ConcertHall: 'Konser Salonu',
  FestivalArea: 'Festival Alanı', OutdoorVenue: 'Açık Hava Mekanı',
  Restaurant: 'Restoran', Hotel: 'Otel', WeddingHall: 'Düğün Salonu', Other: 'Diğer',
};

export const ORGANIZER_TYPES = [
  'Individual', 'Agency', 'EventCompany', 'FestivalOrganizer', 'WeddingOrganizer',
  'Municipality', 'University', 'CorporateCompany', 'SunsetOrganizer', 'Other',
] as const;
export type OrganizerType = (typeof ORGANIZER_TYPES)[number];

export const ORGANIZER_TYPE_LABELS: Record<OrganizerType, string> = {
  Individual: 'Bireysel', Agency: 'Ajans', EventCompany: 'Etkinlik Şirketi',
  FestivalOrganizer: 'Festival Organizatörü', WeddingOrganizer: 'Düğün Organizatörü',
  Municipality: 'Belediye', University: 'Üniversite', CorporateCompany: 'Kurumsal Şirket',
  SunsetOrganizer: 'Sunset Organizatörü', Other: 'Diğer',
};

export const WORK_STATUSES = ['Solo', 'Group', 'Both'] as const;
export type WorkStatus = (typeof WORK_STATUSES)[number];
export const WORK_STATUS_LABELS: Record<WorkStatus, string> = { Solo: 'Solo', Group: 'Grup', Both: 'İkisi de' };

export const TRAVEL_OPTIONS = ['Yes', 'No'] as const;
export type IsAvailableToTravel = (typeof TRAVEL_OPTIONS)[number];
export const TRAVEL_LABELS: Record<IsAvailableToTravel, string> = { Yes: 'Seyahat edebilir', No: 'Seyahat edemez' };

export const VERIFICATION_STATUSES = ['Pending', 'Approved', 'Rejected'] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];
export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  Pending: 'Onay bekliyor', Approved: 'Onaylı', Rejected: 'Reddedildi',
};

export const OFFER_STATUSES = ['Pending', 'Accepted', 'Rejected'] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];
export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  Pending: 'Bekliyor', Accepted: 'Kabul edildi', Rejected: 'Reddedildi',
};

export const ADVERT_STATUSES = ['Open', 'Closed', 'Cancelled', 'Completed'] as const;
export type AdvertStatus = (typeof ADVERT_STATUSES)[number];
export const ADVERT_STATUS_LABELS: Record<AdvertStatus, string> = {
  Open: 'Açık', Closed: 'Kapalı', Cancelled: 'İptal edildi', Completed: 'Tamamlandı',
};

// Sahnem.Core/Enums/City.cs — 81 il, backend enum ada birebir (Türkçe karaktersiz)
export const CITIES = [
  'Adana', 'Adiyaman', 'Afyonkarahisar', 'Agri', 'Amasya', 'Ankara', 'Antalya',
  'Artvin', 'Aydin', 'Balikesir', 'Bilecik', 'Bingol', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Canakkale', 'Cankiri', 'Corum', 'Denizli', 'Diyarbakir', 'Edirne',
  'Elazig', 'Erzincan', 'Erzurum', 'Eskisehir', 'Gaziantep', 'Giresun', 'Gumushane',
  'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'Istanbul', 'Izmir', 'Kars', 'Kastamonu',
  'Kayseri', 'Kirklareli', 'Kirsehir', 'Kocaeli', 'Konya', 'Kutahya', 'Malatya',
  'Manisa', 'Kahramanmaras', 'Mardin', 'Mugla', 'Mus', 'Nevsehir', 'Nigde', 'Ordu',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdag', 'Tokat',
  'Trabzon', 'Tunceli', 'Sanliurfa', 'Usak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray',
  'Bayburt', 'Karaman', 'Kirikkale', 'Batman', 'Sirnak', 'Bartin', 'Ardahan', 'Igdir',
  'Yalova', 'Karabuk', 'Kilis', 'Osmaniye', 'Duzce',
] as const;
export type City = (typeof CITIES)[number];

// Ekranda gösterilecek Türkçe karakterli il adları
export const CITY_LABELS: Record<City, string> = {
  Adana: 'Adana', Adiyaman: 'Adıyaman', Afyonkarahisar: 'Afyonkarahisar', Agri: 'Ağrı',
  Amasya: 'Amasya', Ankara: 'Ankara', Antalya: 'Antalya', Artvin: 'Artvin', Aydin: 'Aydın',
  Balikesir: 'Balıkesir', Bilecik: 'Bilecik', Bingol: 'Bingöl', Bitlis: 'Bitlis', Bolu: 'Bolu',
  Burdur: 'Burdur', Bursa: 'Bursa', Canakkale: 'Çanakkale', Cankiri: 'Çankırı', Corum: 'Çorum',
  Denizli: 'Denizli', Diyarbakir: 'Diyarbakır', Edirne: 'Edirne', Elazig: 'Elazığ',
  Erzincan: 'Erzincan', Erzurum: 'Erzurum', Eskisehir: 'Eskişehir', Gaziantep: 'Gaziantep',
  Giresun: 'Giresun', Gumushane: 'Gümüşhane', Hakkari: 'Hakkari', Hatay: 'Hatay',
  Isparta: 'Isparta', Mersin: 'Mersin', Istanbul: 'İstanbul', Izmir: 'İzmir', Kars: 'Kars',
  Kastamonu: 'Kastamonu', Kayseri: 'Kayseri', Kirklareli: 'Kırklareli', Kirsehir: 'Kırşehir',
  Kocaeli: 'Kocaeli', Konya: 'Konya', Kutahya: 'Kütahya', Malatya: 'Malatya', Manisa: 'Manisa',
  Kahramanmaras: 'Kahramanmaraş', Mardin: 'Mardin', Mugla: 'Muğla', Mus: 'Muş',
  Nevsehir: 'Nevşehir', Nigde: 'Niğde', Ordu: 'Ordu', Rize: 'Rize', Sakarya: 'Sakarya',
  Samsun: 'Samsun', Siirt: 'Siirt', Sinop: 'Sinop', Sivas: 'Sivas', Tekirdag: 'Tekirdağ',
  Tokat: 'Tokat', Trabzon: 'Trabzon', Tunceli: 'Tunceli', Sanliurfa: 'Şanlıurfa',
  Usak: 'Uşak', Van: 'Van', Yozgat: 'Yozgat', Zonguldak: 'Zonguldak', Aksaray: 'Aksaray',
  Bayburt: 'Bayburt', Karaman: 'Karaman', Kirikkale: 'Kırıkkale', Batman: 'Batman',
  Sirnak: 'Şırnak', Bartin: 'Bartın', Ardahan: 'Ardahan', Igdir: 'Iğdır', Yalova: 'Yalova',
  Karabuk: 'Karabük', Kilis: 'Kilis', Osmaniye: 'Osmaniye', Duzce: 'Düzce',
};

export function optionsFrom<T extends string>(values: readonly T[], labels: Record<T, string>) {
  return values.map((value) => ({ value, label: labels[value] }));
}
