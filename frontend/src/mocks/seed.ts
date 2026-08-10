import type {
  Advert, AppNotification, AppUser, ConversationRecord, Message, MusicianProfile,
  Offer, OrganizerProfile, VenueProfile,
} from '@/types';

function iso(daysFromNow: number, hour = 20): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

// ---------- Kullanıcılar ----------
export const SEED_USERS: AppUser[] = [
  { id: 1, firstName: 'Elif', lastName: 'Yıldız', email: 'elif@sahnem.com', phoneNumber: '5321112233', role: 'Musician', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-400) },
  { id: 2, firstName: 'Baran', lastName: 'Kaya', email: 'baran@sahnem.com', phoneNumber: '5321112234', role: 'Musician', isEmailConfirmed: true, isPhoneNumberConfirmed: false, isProfileCompleted: true, createdDate: iso(-380) },
  { id: 3, firstName: 'Deniz', lastName: 'Aksoy', email: 'deniz@sahnem.com', phoneNumber: '5321112235', role: 'Musician', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-360) },
  { id: 4, firstName: 'Mert', lastName: 'Solmaz', email: 'mert@sahnem.com', phoneNumber: '5321112236', role: 'Musician', isEmailConfirmed: false, isPhoneNumberConfirmed: false, isProfileCompleted: true, createdDate: iso(-300) },
  { id: 5, firstName: 'Zeynep', lastName: 'Aydın', email: 'zeynep@sahnem.com', phoneNumber: '5321112237', role: 'Musician', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-500) },
  { id: 6, firstName: 'Ege', lastName: 'Demir', email: 'ege@sahnem.com', phoneNumber: '5321112238', role: 'Musician', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-250) },
  { id: 7, firstName: 'Selin', lastName: 'Kurt', email: 'selin@sahnem.com', phoneNumber: '5321112239', role: 'Musician', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-450) },
  { id: 8, firstName: 'Kerem', lastName: 'Şahin', email: 'kerem@sahnem.com', phoneNumber: '5321112240', role: 'Musician', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-220) },
  { id: 9, firstName: 'Ayşe', lastName: 'Öztürk', email: 'ayse@sahnem.com', phoneNumber: '5321112241', role: 'Musician', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-180) },
  { id: 10, firstName: 'Cem', lastName: 'Yalçın', email: 'cem@sahnem.com', phoneNumber: '5321112242', role: 'Musician', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-140) },
  { id: 11, firstName: 'Naz', lastName: 'Güneş', email: 'naz@sahnem.com', phoneNumber: '5321112243', role: 'Musician', isEmailConfirmed: false, isPhoneNumberConfirmed: false, isProfileCompleted: true, createdDate: iso(-40) },
  { id: 12, firstName: 'Oğuz', lastName: 'Kaan', email: 'oguz@sahnem.com', phoneNumber: '5321112244', role: 'Musician', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-600) },

  { id: 51, firstName: 'Bosphorus', lastName: 'Events', email: 'bosphorus@sahnem.com', phoneNumber: '5322220001', role: 'Organizer', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-500) },
  { id: 52, firstName: 'Anadolu', lastName: 'Organizasyon', email: 'anadolu@sahnem.com', phoneNumber: '5322220002', role: 'Organizer', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-420) },
  { id: 53, firstName: 'SunClub', lastName: 'Sunset', email: 'sunclub@sahnem.com', phoneNumber: '5322220003', role: 'Organizer', isEmailConfirmed: true, isPhoneNumberConfirmed: false, isProfileCompleted: true, createdDate: iso(-200) },
  { id: 54, firstName: 'İzmir Kültür', lastName: 'Sanat Derneği', email: 'izmirkultur@sahnem.com', phoneNumber: '5322220004', role: 'Organizer', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-160) },
  { id: 61, firstName: 'Zorlu', lastName: 'PSM', email: 'zorlupsm@sahnem.com', phoneNumber: '5322220005', role: 'Venue', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-700) },
  { id: 62, firstName: 'Kartal', lastName: 'Beach Club', email: 'kartalbeach@sahnem.com', phoneNumber: '5322220006', role: 'Venue', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-90) },
  { id: 63, firstName: 'Nu', lastName: 'Teras', email: 'nuteras@sahnem.com', phoneNumber: '5322220007', role: 'Venue', isEmailConfirmed: true, isPhoneNumberConfirmed: true, isProfileCompleted: true, createdDate: iso(-260) },
  { id: 64, firstName: 'Marina', lastName: 'Otel', email: 'marinaotel@sahnem.com', phoneNumber: '5322220008', role: 'Venue', isEmailConfirmed: false, isPhoneNumberConfirmed: false, isProfileCompleted: true, createdDate: iso(-50) },
];

// Demo giriş şifresi: tüm mock kullanıcılar için "sahnem123"
export const DEMO_PASSWORD = 'sahnem123';

// ---------- Müzisyen profilleri ----------
const AVATAR_PALETTE = [
  'from-fuchsia-500 to-purple-700', 'from-cyan-500 to-blue-700', 'from-amber-400 to-orange-600',
  'from-rose-500 to-pink-700', 'from-emerald-400 to-teal-700', 'from-violet-500 to-indigo-700',
];

const SEED_MUSICIANS_BASE: Omit<MusicianProfile, 'avatarUrl'>[] = [
  { id: 1, appUserId: 1, firstName: 'Elif', lastName: 'Yıldız', bio: 'Caz ve soul kökenli vokalist. Düğün, kurumsal etkinlik ve canlı performans deneyimi. Repertuvar Türkçe ve İngilizce.', branch: 'Vocal', genres: 'Caz, Soul, Pop', experienceYears: 6, city: 'Istanbul', district: 'Kadıköy', isAvailableToTravel: 'Yes', hasOwnEquipment: true, workStatus: 'Solo', instagramUrl: 'https://instagram.com/elifyildiz', youtubeUrl: 'https://youtube.com/@elifyildiz', verificationStatus: 'Approved', ratingAvg: 4.8, ratingCount: 32, priceFrom: 8000 },
  { id: 2, appUserId: 2, firstName: 'Baran', lastName: 'Kaya', bio: 'Rock ve alternatif grubuyla sahne alan gitarist. Akustik setlerde de deneyimli.', branch: 'Guitar', genres: 'Rock, Alternatif', experienceYears: 9, city: 'Izmir', district: 'Alsancak', isAvailableToTravel: 'Yes', hasOwnEquipment: true, workStatus: 'Group', instagramUrl: 'https://instagram.com/barankaya', verificationStatus: 'Approved', ratingAvg: 4.6, ratingCount: 18, priceFrom: 6500 },
  { id: 3, appUserId: 3, firstName: 'Deniz', lastName: 'Aksoy', bio: 'Sunset ve club setlerinde uzman DJ. Deep house, afro house ve organik elektronik.', branch: 'DJ', genres: 'Deep House, Afro House', experienceYears: 5, city: 'Ankara', district: 'Çankaya', isAvailableToTravel: 'Yes', hasOwnEquipment: true, workStatus: 'Solo', instagramUrl: 'https://instagram.com/denizaksoy', youtubeUrl: 'https://youtube.com/@denizaksoy', verificationStatus: 'Approved', ratingAvg: 4.9, ratingCount: 47, priceFrom: 12000 },
  { id: 4, appUserId: 4, firstName: 'Mert', lastName: 'Solmaz', bio: 'Funk ve fusion odaklı davulcu, stüdyo kayıt deneyimi olan bir grubun parçası.', branch: 'Drums', genres: 'Funk, Fusion', experienceYears: 4, city: 'Bursa', district: 'Nilüfer', isAvailableToTravel: 'No', hasOwnEquipment: false, workStatus: 'Group', verificationStatus: 'Pending', ratingAvg: 4.3, ratingCount: 12, priceFrom: 5000 },
  { id: 5, appUserId: 5, firstName: 'Zeynep', lastName: 'Aydın', bio: 'Klasik ve modern repertuvara hakim konser piyanisti. Kurumsal galalar ve otel etkinlikleri.', branch: 'Piano', genres: 'Klasik, Modern Enstrümantal', experienceYears: 12, city: 'Istanbul', district: 'Beşiktaş', isAvailableToTravel: 'Yes', hasOwnEquipment: false, workStatus: 'Solo', linkedinUrl: 'https://linkedin.com/in/zeynepaydin', verificationStatus: 'Approved', ratingAvg: 5.0, ratingCount: 64, priceFrom: 15000 },
  { id: 6, appUserId: 6, firstName: 'Ege', lastName: 'Demir', bio: 'Funk/soul grubunun bas gitaristi, düğün orkestralarında da yer alıyor.', branch: 'BassGuitar', genres: 'Funk, Soul, Pop', experienceYears: 7, city: 'Antalya', district: 'Muratpaşa', isAvailableToTravel: 'Yes', hasOwnEquipment: true, workStatus: 'Group', verificationStatus: 'Approved', ratingAvg: 4.5, ratingCount: 21, priceFrom: 5500 },
  { id: 7, appUserId: 7, firstName: 'Selin', lastName: 'Kurt', bio: 'Senfoni orkestrası kökenli kemancı. Düğün, nişan ve klasik konser organizasyonları.', branch: 'Violin', genres: 'Klasik, Enstrümantal Pop', experienceYears: 10, city: 'Istanbul', district: 'Şişli', isAvailableToTravel: 'Yes', hasOwnEquipment: true, workStatus: 'Solo', instagramUrl: 'https://instagram.com/selinkurt', verificationStatus: 'Approved', ratingAvg: 4.9, ratingCount: 38, priceFrom: 9000 },
  { id: 8, appUserId: 8, firstName: 'Kerem', lastName: 'Şahin', bio: 'Latin ve funk esintili saksafon performansları, DJ setleriyle canlı katkı.', branch: 'Saxophone', genres: 'Latin, Funk, Deep House', experienceYears: 8, city: 'Izmir', district: 'Karşıyaka', isAvailableToTravel: 'Yes', hasOwnEquipment: true, workStatus: 'Solo', instagramUrl: 'https://instagram.com/keremsahin', verificationStatus: 'Approved', ratingAvg: 4.7, ratingCount: 29, priceFrom: 7000 },
  { id: 9, appUserId: 9, firstName: 'Ayşe', lastName: 'Öztürk', bio: 'Elektronik prodüktör ve canlı performans sanatçısı, kendi setlerini prodükte ediyor.', branch: 'Producer', genres: 'Elektronik, Ambient', experienceYears: 6, city: 'Ankara', district: 'Kızılay', isAvailableToTravel: 'No', hasOwnEquipment: true, workStatus: 'Solo', verificationStatus: 'Pending', ratingAvg: 4.4, ratingCount: 15, priceFrom: 6000 },
  { id: 10, appUserId: 10, firstName: 'Cem', lastName: 'Yalçın', bio: 'Afro-Türk perküsyon ansambli lideri, festival ve plaj kulüpleri deneyimi.', branch: 'Percussion', genres: 'Afro, World, Deep House', experienceYears: 5, city: 'Mugla', district: 'Bodrum', isAvailableToTravel: 'Yes', hasOwnEquipment: true, workStatus: 'Group', verificationStatus: 'Approved', ratingAvg: 4.6, ratingCount: 9, priceFrom: 7500 },
  { id: 11, appUserId: 11, firstName: 'Naz', lastName: 'Güneş', bio: 'Yeni nesil pop vokalist, sosyal medyada yükselen bir isim.', branch: 'Vocal', genres: 'Pop, R&B', experienceYears: 3, city: 'Mugla', district: 'Bodrum', isAvailableToTravel: 'Yes', hasOwnEquipment: false, workStatus: 'Solo', instagramUrl: 'https://instagram.com/nazgunes', verificationStatus: 'Pending', ratingAvg: 4.2, ratingCount: 6, priceFrom: 4000 },
  { id: 12, appUserId: 12, firstName: 'Oğuz', lastName: 'Kaan', bio: 'Big band ve nefesli grup lideri, kurumsal galalar için özel repertuvar hazırlıyor.', branch: 'Trumpet', genres: 'Big Band, Swing', experienceYears: 11, city: 'Istanbul', district: 'Bakırköy', isAvailableToTravel: 'Yes', hasOwnEquipment: true, workStatus: 'Group', verificationStatus: 'Approved', ratingAvg: 4.8, ratingCount: 22, priceFrom: 11000 },
];
export const SEED_MUSICIANS: MusicianProfile[] = SEED_MUSICIANS_BASE.map((m, i) => ({
  ...m, avatarUrl: AVATAR_PALETTE[i % AVATAR_PALETTE.length],
}));

// ---------- Organizatör / Mekan profilleri ----------
export const SEED_ORGANIZERS: OrganizerProfile[] = [
  { id: 1, appUserId: 51, organizerName: 'Bosphorus Events', organizerType: 'EventCompany', bio: 'İstanbul merkezli, kurumsal etkinlik ve konser organizasyonunda 12 yıllık deneyime sahip prodüksiyon şirketi.', city: 'Istanbul', district: 'Beyoğlu', address: 'İstiklal Cd. No:120', verificationStatus: 'Approved', websiteUrl: 'https://bosphorusevents.com', instagramUrl: 'https://instagram.com/bosphorusevents' },
  { id: 2, appUserId: 52, organizerName: 'Anadolu Düğün Organizasyon', organizerType: 'WeddingOrganizer', bio: 'Ankara ve çevresinde butik düğün organizasyonu, canlı müzik koordinasyonu.', city: 'Ankara', district: 'Çankaya', address: 'Tunalı Hilmi Cd. No:45', verificationStatus: 'Approved', instagramUrl: 'https://instagram.com/anadoludugun' },
  { id: 3, appUserId: 53, organizerName: 'SunClub Sunset', organizerType: 'SunsetOrganizer', bio: 'Bodrum sahilinde her yaz düzenli sunset partileri organize eden ekip.', city: 'Mugla', district: 'Bodrum', address: 'Sahil Yolu No:8', verificationStatus: 'Pending', instagramUrl: 'https://instagram.com/sunclubsunset' },
  { id: 4, appUserId: 54, organizerName: 'İzmir Kültür Sanat Derneği', organizerType: 'Municipality', bio: 'Şehir çapında kültür-sanat etkinlikleri ve festival organizasyonları düzenleyen dernek.', city: 'Izmir', district: 'Konak', address: 'Cumhuriyet Meydanı No:3', verificationStatus: 'Approved' },
];

export const SEED_VENUES: VenueProfile[] = [
  { id: 1, appUserId: 61, venueName: 'Zorlu PSM', venueType: 'ConcertHall', bio: 'İstanbul\'un önde gelen sahne sanatları merkezi, 800 kişilik ana salon.', city: 'Istanbul', district: 'Beşiktaş', capacity: 800, address: 'Levazım Mah. Koru Sk. No:2', hasSoundSystem: true, verificationStatus: 'Approved', websiteUrl: 'https://zorlupsm.com' },
  { id: 2, appUserId: 62, venueName: 'Kartal Beach Club', venueType: 'OutdoorVenue', bio: 'Antalya sahilinde canlı müzik ağırlıklı plaj kulübü, yaz sezonu boyunca haftalık program.', city: 'Antalya', district: 'Konyaaltı', capacity: 350, address: 'Sahil Cd. No:60', hasSoundSystem: true, verificationStatus: 'Approved' },
  { id: 3, appUserId: 63, venueName: 'Nu Teras', venueType: 'NightClub', bio: 'Boğaz manzaralı, DJ ve canlı performans ağırlıklı gece mekanı.', city: 'Istanbul', district: 'Beşiktaş', capacity: 500, address: 'Kuruçeşme Cd. No:15', hasSoundSystem: true, verificationStatus: 'Approved', instagramUrl: 'https://instagram.com/nuteras' },
  { id: 4, appUserId: 64, venueName: 'Marina Otel', venueType: 'Hotel', bio: 'Bursa\'da düğün ve kurumsal etkinlikler için balo salonu ve teras alanı.', city: 'Bursa', district: 'Nilüfer', capacity: 600, address: 'Marina Blv. No:22', hasSoundSystem: false, verificationStatus: 'Pending' },
];

// ---------- İlanlar (Advert) ----------
export const SEED_ADVERTS: Advert[] = [
  { id: 1, creatorId: 51, creatorName: 'Bosphorus Events', creatorKind: 'Organizer', title: 'Kurumsal Gala Gecesi için Caz Vokalisti', description: 'Boğaz\'da düzenlenecek 300 kişilik kurumsal gala gecesi için caz/soul repertuvarına hakim, sahne deneyimi yüksek bir solo vokalist arıyoruz. Canlı trio eşliğinde 45 dakikalık iki set.', city: 'Istanbul', district: 'Sarıyer', address: 'Boğaziçi Otel Balo Salonu', equipmentProvided: true, eventTime: iso(24), budget: 18000, minimumExperienceYears: 5, status: 'Open', applicationDeadline: iso(14), createdDate: iso(-6), branch: 'Vocal', offerCount: 3 },
  { id: 2, creatorId: 61, creatorName: 'Zorlu PSM', creatorKind: 'Venue', title: 'Klasik Piyano Resitali — Ana Salon', description: 'Ana salonda düzenlenecek akşam resitali için klasik repertuvara hakim konser piyanisti aranıyor. Kuyruklu piyano mekanda mevcut.', city: 'Istanbul', district: 'Beşiktaş', address: 'Zorlu PSM Ana Salon', equipmentProvided: true, eventTime: iso(40), budget: 22000, minimumExperienceYears: 8, status: 'Open', applicationDeadline: iso(21), createdDate: iso(-10), branch: 'Piano', offerCount: 2 },
  { id: 3, creatorId: 53, creatorName: 'SunClub Sunset', creatorKind: 'Organizer', title: 'Yaz Sezonu Sunset DJ Seti', description: 'Bodrum sahilinde her cumartesi düzenlenen sunset partisi için deep/afro house ağırlıklı set çalacak DJ arıyoruz. Sezonluk anlaşma da değerlendirilir.', city: 'Mugla', district: 'Bodrum', address: 'SunClub Sahil', equipmentProvided: true, eventTime: iso(9), budget: 14000, minimumExperienceYears: 3, status: 'Open', applicationDeadline: iso(5), createdDate: iso(-3), branch: 'DJ', offerCount: 5 },
  { id: 4, creatorId: 62, creatorName: 'Kartal Beach Club', creatorKind: 'Venue', title: 'Cuma Akşamları Canlı Funk Grubu', description: 'Yaz boyunca her cuma akşamı sahne alacak, funk/soul repertuvarına hakim 4-5 kişilik canlı grup arıyoruz.', city: 'Antalya', district: 'Konyaaltı', address: 'Kartal Beach Club Sahne', equipmentProvided: true, eventTime: iso(16), budget: 20000, minimumExperienceYears: 4, status: 'Open', applicationDeadline: iso(10), createdDate: iso(-8), branch: 'BassGuitar', offerCount: 1 },
  { id: 5, creatorId: 52, creatorName: 'Anadolu Düğün Organizasyon', creatorKind: 'Organizer', title: 'Düğün Töreni için Kemancı', description: 'Ankara\'da düzenlenecek düğün töreninde nikah ve kokteyl bölümü için solo kemancı aranıyor. Klasik ve pop repertuvar beklenmektedir.', city: 'Ankara', district: 'Çankaya', address: 'Rixos Ankara Bahçe', equipmentProvided: false, eventTime: iso(31), budget: 9000, minimumExperienceYears: 3, status: 'Open', applicationDeadline: iso(20), createdDate: iso(-4), branch: 'Violin', offerCount: 2 },
  { id: 6, creatorId: 63, creatorName: 'Nu Teras', creatorKind: 'Venue', title: 'Perşembe Gecesi Saksafon + DJ Kombinasyonu', description: 'Boğaz manzaralı terasımızda DJ setine canlı katkı yapacak saksafoncu arıyoruz. Latin/deep house geçişlerine hakim olması tercih sebebi.', city: 'Istanbul', district: 'Beşiktaş', address: 'Nu Teras Ana Sahne', equipmentProvided: true, eventTime: iso(5), budget: 7500, minimumExperienceYears: 2, status: 'Open', applicationDeadline: iso(2), createdDate: iso(-2), branch: 'Saxophone', offerCount: 4 },
  { id: 7, creatorId: 54, creatorName: 'İzmir Kültür Sanat Derneği', creatorKind: 'Organizer', title: 'Kültür Festivali — Big Band Performansı', description: 'İzmir Kültür Festivali kapanış gecesi için big band/swing repertuvarına sahip bir grup arıyoruz. Açık hava sahnesi, 2000+ kişilik alan.', city: 'Izmir', district: 'Konak', address: 'Kültürpark Açık Hava Sahnesi', equipmentProvided: true, eventTime: iso(52), budget: 35000, minimumExperienceYears: 6, status: 'Open', applicationDeadline: iso(35), createdDate: iso(-15), branch: 'Trumpet', offerCount: 1 },
  { id: 8, creatorId: 64, creatorName: 'Marina Otel', creatorKind: 'Venue', title: 'Düğün Sezonu için Perküsyon Ansamblı', description: 'Otel balo salonumuzda düzenlenecek düğünler için karşılama ve kokteyl bölümünde performans sergileyecek perküsyon ansamblı arıyoruz.', city: 'Bursa', district: 'Nilüfer', address: 'Marina Otel Balo Salonu', equipmentProvided: false, eventTime: iso(-3), budget: 6000, minimumExperienceYears: 2, status: 'Completed', applicationDeadline: iso(-10), createdDate: iso(-40), branch: 'Percussion', offerCount: 2 },
  { id: 9, creatorId: 51, creatorName: 'Bosphorus Events', creatorKind: 'Organizer', title: 'Ürün Lansmanı için Elektronik Prodüktör', description: 'Teknoloji ürün lansmanı sonrası after-party için ambient/elektronik set çalacak prodüktör/DJ arıyoruz.', city: 'Istanbul', district: 'Maslak', address: 'Sanayi Etkinlik Merkezi', equipmentProvided: true, eventTime: iso(-15), budget: 10000, minimumExperienceYears: 2, status: 'Cancelled', applicationDeadline: iso(-20), createdDate: iso(-45), branch: 'Producer', offerCount: 0 },
  { id: 10, creatorId: 61, creatorName: 'Zorlu PSM', creatorKind: 'Venue', title: 'Akustik Gitar Resitali — Stüdyo Sahne', description: 'Küçük stüdyo sahnede 120 kişilik samimi bir akustik gitar performansı için sanatçı arıyoruz.', city: 'Istanbul', district: 'Beşiktaş', address: 'Zorlu PSM Stüdyo Sahne', equipmentProvided: true, eventTime: iso(2), budget: 8500, minimumExperienceYears: 3, status: 'Closed', applicationDeadline: iso(-1), createdDate: iso(-20), branch: 'Guitar', offerCount: 3 },
];

// ---------- Teklifler (Offer) ----------
export const SEED_OFFERS: Offer[] = [
  { id: 1, musicianId: 1, musicianName: 'Elif Yıldız', musicianBranch: 'Vocal', advertId: 1, advertTitle: 'Kurumsal Gala Gecesi için Caz Vokalisti', message: 'Merhaba, benzer ölçekte 3 kurumsal gala gecesinde sahne aldım. Repertuvar listemi ve referans videolarımı paylaşabilirim.', proposedPrice: 17000, offerStatus: 'Pending', createdDate: iso(-2) },
  { id: 2, musicianId: 5, musicianName: 'Zeynep Aydın', musicianBranch: 'Piano', advertId: 2, advertTitle: 'Klasik Piyano Resitali — Ana Salon', message: 'Ana salonunuzdaki akustiği biliyorum, geçen yıl orada bir resital vermiştim. Programımı iletebilirim.', proposedPrice: 21000, offerStatus: 'Accepted', createdDate: iso(-8) },
  { id: 3, musicianId: 3, musicianName: 'Deniz Aksoy', musicianBranch: 'DJ', advertId: 3, advertTitle: 'Yaz Sezonu Sunset DJ Seti', message: 'Geçen sezon başka bir plaj kulübünde düzenli set çaldım, sezonluk anlaşmaya açığım.', proposedPrice: 13500, offerStatus: 'Pending', createdDate: iso(-1) },
  { id: 4, musicianId: 10, musicianName: 'Cem Yalçın', musicianBranch: 'Percussion', advertId: 3, advertTitle: 'Yaz Sezonu Sunset DJ Seti', message: 'Ansamblimle canlı perküsyon katkısı sunabiliriz, DJ setinizle uyumlu çalışırız.', proposedPrice: 12000, offerStatus: 'Rejected', createdDate: iso(-2) },
  { id: 5, musicianId: 6, musicianName: 'Ege Demir', musicianBranch: 'BassGuitar', advertId: 4, advertTitle: 'Cuma Akşamları Canlı Funk Grubu', message: 'Grubumuzla sezonluk cuma programına uygun bir teklif sunuyoruz, demo kaydımızı iletebilirim.', proposedPrice: 19000, offerStatus: 'Pending', createdDate: iso(-3) },
  { id: 6, musicianId: 7, musicianName: 'Selin Kurt', musicianBranch: 'Violin', advertId: 5, advertTitle: 'Düğün Töreni için Kemancı', message: 'Ankara\'da bu tarihte müsaitim, nikah töreni repertuvarım hazır.', proposedPrice: 8500, offerStatus: 'Accepted', createdDate: iso(-5) },
  { id: 7, musicianId: 8, musicianName: 'Kerem Şahin', musicianBranch: 'Saxophone', advertId: 6, advertTitle: 'Perşembe Gecesi Saksafon + DJ Kombinasyonu', message: 'Deep house geçişlerinde deneyimliyim, DJ ile prova için müsait olabilirim.', proposedPrice: 7000, offerStatus: 'Pending', createdDate: iso(-1) },
  { id: 8, musicianId: 12, musicianName: 'Oğuz Kaan', musicianBranch: 'Trumpet', advertId: 7, advertTitle: 'Kültür Festivali — Big Band Performansı', message: 'Big band grubum 12 kişi, festival sahnelerinde deneyimliyiz. Teknik rider\'ı paylaşabiliriz.', proposedPrice: 33000, offerStatus: 'Pending', createdDate: iso(-6) },
  { id: 9, musicianId: 2, musicianName: 'Baran Kaya', musicianBranch: 'Guitar', advertId: 10, advertTitle: 'Akustik Gitar Resitali — Stüdyo Sahne', message: 'Akustik setlerimden örnekler iletebilirim, stüdyo sahne deneyimim var.', proposedPrice: 8000, offerStatus: 'Rejected', createdDate: iso(-15) },
];

// ---------- Sohbetler / Mesajlar ----------
// Her konuşma iki tarafı da (userA/userB) saklar; oturum açan kullanıcıya göre
// "karşı taraf" messageService içinde türetilir (bkz. services/messageService.ts).
export const SEED_CONVERSATIONS: ConversationRecord[] = [
  {
    id: 1, userAId: 1, userAName: 'Elif Yıldız', userARole: 'Musician',
    userBId: 51, userBName: 'Bosphorus Events', userBRole: 'Organizer',
    lastMessage: 'Harika, gala gecesi için sizi bekliyoruz. Prova saatini paylaşır mısınız?',
    lastMessageAt: iso(-1, 11), unreadCountA: 1, unreadCountB: 0,
  },
  {
    id: 2, userAId: 5, userAName: 'Zeynep Aydın', userARole: 'Musician',
    userBId: 61, userBName: 'Zorlu PSM', userBRole: 'Venue',
    lastMessage: 'Teklifiniz onaylandı, sözleşme detaylarını e-posta ile ileteceğiz.',
    lastMessageAt: iso(-3, 16), unreadCountA: 0, unreadCountB: 0,
  },
  {
    id: 3, userAId: 3, userAName: 'Deniz Aksoy', userARole: 'Musician',
    userBId: 53, userBName: 'SunClub Sunset', userBRole: 'Organizer',
    lastMessage: 'Sezonluk anlaşma konusunda düşünüyoruz, birkaç gün içinde dönüş yaparız.',
    lastMessageAt: iso(-0.3, 9), unreadCountA: 2, unreadCountB: 0,
  },
];

export const SEED_MESSAGES: Message[] = [
  { id: 1, conversationId: 1, senderId: 51, body: 'Merhaba, teklifinizi inceledik ve gala gecesi için sizi düşünüyoruz.', sentAt: iso(-2, 10) },
  { id: 2, conversationId: 1, senderId: 1, body: 'Merhaba, çok sevindim! Repertuvar listemi de iletmemi ister misiniz?', sentAt: iso(-2, 10.5) },
  { id: 3, conversationId: 1, senderId: 51, body: 'Evet lütfen, ayrıca ses sistemi ihtiyaçlarınızı da not alalım.', sentAt: iso(-1, 15) },
  { id: 4, conversationId: 1, senderId: 51, body: 'Harika, gala gecesi için sizi bekliyoruz. Prova saatini paylaşır mısınız?', sentAt: iso(-1, 11) },
  { id: 5, conversationId: 2, senderId: 61, body: 'Teklifiniz onaylandı, sözleşme detaylarını e-posta ile ileteceğiz.', sentAt: iso(-3, 16) },
  { id: 6, conversationId: 3, senderId: 53, body: 'Merhaba, sunset setinizi çok beğendik.', sentAt: iso(-1, 9) },
  { id: 7, conversationId: 3, senderId: 53, body: 'Sezonluk anlaşma konusunda düşünüyoruz, birkaç gün içinde dönüş yaparız.', sentAt: iso(-0.3, 9) },
];

// ---------- Bildirimler ----------
export const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: 1, type: 'offer', title: 'Teklifiniz kabul edildi', body: 'Zorlu PSM, "Klasik Piyano Resitali" ilanınıza gönderdiğiniz teklifi kabul etti.', isRead: false, createdDate: iso(-3, 16), linkTo: '/offers/2' },
  { id: 2, type: 'message', title: 'Yeni mesaj', body: 'Bosphorus Events size bir mesaj gönderdi.', isRead: false, createdDate: iso(-1, 11), linkTo: '/messages/1' },
  { id: 3, type: 'advert', title: 'İlanınıza yeni teklif geldi', body: '"Yaz Sezonu Sunset DJ Seti" ilanınıza Deniz Aksoy teklif gönderdi.', isRead: true, createdDate: iso(-1, 9), linkTo: '/my-adverts/3' },
  { id: 4, type: 'verification', title: 'Profil doğrulaması onaylandı', body: 'Müzisyen profiliniz doğrulandı, artık ilanlara başvurabilirsiniz.', isRead: true, createdDate: iso(-30, 12) },
  { id: 5, type: 'system', title: 'Sahnem\'e hoş geldiniz', body: 'Profilinizi tamamlayarak ilk ilanınızı keşfedebilirsiniz.', isRead: true, createdDate: iso(-45, 10) },
];
