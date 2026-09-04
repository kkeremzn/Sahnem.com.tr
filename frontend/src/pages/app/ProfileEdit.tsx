import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { MultiSelectChips } from '@/components/ui/MultiSelectChips';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as authService from '@/services/authService';
import * as profileService from '@/services/profileService';
import { uploadAvatar } from '@/services/uploadService';
import { formatApiError } from '@/lib/apiClient';
import { normalizePhoneNumber } from '@/lib/phone';
import { DISTRICTS } from '@/data/districts';
import {
  CITIES, CITY_LABELS, MUSIC_BRANCHES, MUSIC_BRANCH_LABELS, MUSIC_GENRES, MUSIC_GENRE_LABELS,
  ORGANIZER_TYPES, ORGANIZER_TYPE_LABELS,
  VENUE_TYPES, VENUE_TYPE_LABELS, WORK_STATUSES, WORK_STATUS_LABELS, optionsFrom,
  type City, type EmployerProfile, type IsAvailableToTravel, type MusicianProfile,
  type OrganizerProfile, type OrganizerType, type VenueProfile, type VenueType,
} from '@/types';
import { cn } from '@/lib/cn';

export function ProfileEdit() {
  const { user, isMusician, refreshUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // Avatar AppUser'a ait — profil (musician/employer) kaydından ayrı tutulup
  // authService.updateUser ile persist edilir, bkz. AppUserUpdateDto.AvatarUrl.
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const [musician, setMusician] = useState<MusicianProfile | null>(null);
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhoneNumber(user.phoneNumber);
    setAvatarUrl(user.avatarUrl);
    profileService
      .getMyProfile()
      .then((profile) => {
        if (isMusician) {
          setMusician(profile as MusicianProfile);
        } else if (user.role === 'Organizer') {
          setEmployer({ kind: 'Organizer', ...(profile as OrganizerProfile) });
        } else if (user.role === 'Venue') {
          setEmployer({ kind: 'Venue', ...(profile as VenueProfile) });
        }
      })
      .finally(() => setLoading(false));
  }, [user, isMusician]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await authService.updateUser({ firstName, lastName, phoneNumber: normalizePhoneNumber(phoneNumber), avatarUrl });
      if (isMusician && musician) {
        const updated = await profileService.updateMusicianProfile(musician);
        setMusician(updated);
      } else if (employer?.kind === 'Organizer') {
        const updated = await profileService.updateOrganizerProfile(employer);
        setEmployer({ kind: 'Organizer', ...updated });
      } else if (employer?.kind === 'Venue') {
        const updated = await profileService.updateVenueProfile(employer);
        setEmployer({ kind: 'Venue', ...updated });
      }
      await refreshUser();
      toast('Profilin güncellendi.', 'success');
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" size={26} /></div>;
  }

  return (
    <div>
      <PageHeader title="Profili Düzenle" description="Bilgilerini güncel tut, doğru fırsatlarla eşleş." />

      <div className="space-y-6">
        <Card>
          <h3 className="mb-4 font-display text-base font-bold">Profil görseli</h3>
          <FileDropzone
            shape="circle"
            value={avatarUrl}
            onUpload={uploadAvatar}
            onChange={setAvatarUrl}
          />
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-base font-bold">Kişisel bilgiler</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ad"><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></Field>
            <Field label="Soyad"><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></Field>
            <Field label="E-posta" hint="E-posta değiştirilemez"><Input value={user?.email} disabled /></Field>
            <Field label="Telefon"><Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></Field>
          </div>
        </Card>

        {isMusician && musician && (
          <>
            <Card>
              <h3 className="mb-4 font-display text-base font-bold">Uzmanlık</h3>
              <div className="space-y-4">
                <Field label="Branş" hint="En fazla 6">
                  <MultiSelectChips
                    options={optionsFrom(MUSIC_BRANCHES, MUSIC_BRANCH_LABELS)}
                    selected={musician.branch}
                    onChange={(branch) => setMusician({ ...musician, branch })}
                    max={6}
                  />
                </Field>
                <Field label="Deneyim (yıl)">
                  <Input type="number" min={1} max={50} value={musician.experienceYears} onChange={(e) => setMusician({ ...musician, experienceYears: Number(e.target.value) })} />
                </Field>
                <Field label="Türler" hint="En fazla 5">
                  <MultiSelectChips
                    options={optionsFrom(MUSIC_GENRES, MUSIC_GENRE_LABELS)}
                    selected={musician.genres}
                    onChange={(genres) => setMusician({ ...musician, genres })}
                    max={5}
                  />
                </Field>
                <Field label="Çalışma şekli">
                  <div className="flex gap-2">
                    {WORK_STATUSES.map((ws) => (
                      <button key={ws} type="button" onClick={() => setMusician({ ...musician, workStatus: ws })}
                        className={cn('flex-1 rounded-md border px-3 py-2.5 text-sm font-medium', musician.workStatus === ws ? 'border-gold bg-gold/10 text-gold-soft' : 'border-border text-text-dim')}>
                        {WORK_STATUS_LABELS[ws]}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-display text-base font-bold">Konum & seyahat</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Şehir">
                  <Select value={musician.city} onChange={(e) => setMusician({ ...musician, city: e.target.value as City, district: '' })}>
                    {optionsFrom(CITIES, CITY_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </Field>
                <Field label="İlçe" hint="Opsiyonel">
                  <Select value={musician.district ?? ''} onChange={(e) => setMusician({ ...musician, district: e.target.value })}>
                    <option value="">Seç</option>
                    {DISTRICTS[musician.city].map((d) => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Diğer hizmet verdiğin şehirler" hint="Opsiyonel, en fazla 5">
                  <MultiSelectChips
                    options={optionsFrom(CITIES, CITY_LABELS).filter((o) => o.value !== musician.city)}
                    selected={musician.additionalCities}
                    onChange={(additionalCities) => setMusician({ ...musician, additionalCities })}
                    max={5}
                  />
                </Field>
              </div>
              <div className="mt-4 space-y-1">
                <Switch checked={musician.isAvailableToTravel === 'Yes'} onChange={(v) => setMusician({ ...musician, isAvailableToTravel: (v ? 'Yes' : 'No') as IsAvailableToTravel })} label="Şehir dışına seyahat edebilirim" />
                <Switch checked={musician.hasOwnEquipment} onChange={(v) => setMusician({ ...musician, hasOwnEquipment: v })} label="Kendi ekipmanım var" />
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-display text-base font-bold">Biyografi & sosyal</h3>
              <Field label="Biyografi" hint="20-200 karakter"><Textarea rows={5} value={musician.bio} onChange={(e) => setMusician({ ...musician, bio: e.target.value })} /></Field>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Instagram"><Input placeholder="https://instagram.com/kullaniciadi" value={musician.instagramUrl ?? ''} onChange={(e) => setMusician({ ...musician, instagramUrl: e.target.value })} /></Field>
                <Field label="YouTube"><Input placeholder="https://youtube.com/@kanaladi" value={musician.youtubeUrl ?? ''} onChange={(e) => setMusician({ ...musician, youtubeUrl: e.target.value })} /></Field>
                <Field label="LinkedIn"><Input placeholder="https://linkedin.com/in/kullaniciadi" value={musician.linkedinUrl ?? ''} onChange={(e) => setMusician({ ...musician, linkedinUrl: e.target.value })} /></Field>
                <Field label="Spotify"><Input placeholder="https://open.spotify.com/artist/..." value={musician.spotifyUrl ?? ''} onChange={(e) => setMusician({ ...musician, spotifyUrl: e.target.value })} /></Field>
              </div>
            </Card>
          </>
        )}

        {employer && (
          <>
            <Card>
              <h3 className="mb-4 font-display text-base font-bold">{employer.kind === 'Organizer' ? 'Organizasyon bilgisi' : 'Mekan bilgisi'}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="İsim" className="sm:col-span-2">
                  <Input
                    value={employer.kind === 'Organizer' ? employer.organizerName : employer.venueName}
                    onChange={(e) => setEmployer(employer.kind === 'Organizer' ? { ...employer, organizerName: e.target.value } : { ...employer, venueName: e.target.value })}
                  />
                </Field>
                {employer.kind === 'Organizer' ? (
                  <Field label="Organizatör tipi">
                    <Select value={employer.organizerType} onChange={(e) => setEmployer({ ...employer, organizerType: e.target.value as OrganizerType })}>
                      {optionsFrom(ORGANIZER_TYPES, ORGANIZER_TYPE_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </Select>
                  </Field>
                ) : (
                  <>
                    <Field label="Mekan tipi">
                      <Select value={employer.venueType} onChange={(e) => setEmployer({ ...employer, venueType: e.target.value as VenueType })}>
                        {optionsFrom(VENUE_TYPES, VENUE_TYPE_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </Select>
                    </Field>
                    <Field label="Kapasite">
                      <Input type="number" min={0} value={employer.capacity} onChange={(e) => setEmployer({ ...employer, capacity: Number(e.target.value) })} />
                    </Field>
                  </>
                )}
              </div>
              {employer.kind === 'Venue' && (
                <div className="mt-4">
                  <Switch checked={employer.hasSoundSystem} onChange={(v) => setEmployer({ ...employer, hasSoundSystem: v })} label="Ses sistemi mevcut" />
                </div>
              )}
            </Card>

            <Card>
              <h3 className="mb-4 font-display text-base font-bold">Konum</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Şehir">
                  <Select value={employer.city} onChange={(e) => setEmployer({ ...employer, city: e.target.value as City, district: '' })}>
                    {optionsFrom(CITIES, CITY_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </Field>
                <Field label="İlçe" required>
                  <Select value={employer.district ?? ''} onChange={(e) => setEmployer({ ...employer, district: e.target.value })}>
                    <option value="">Seç</option>
                    {DISTRICTS[employer.city].map((d) => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </Field>
                <Field label="Adres" required hint="En az 15 karakter" className="sm:col-span-2">
                  <Input value={employer.address} onChange={(e) => setEmployer({ ...employer, address: e.target.value })} />
                </Field>
              </div>
              {employer.kind === 'Organizer' && (
                <div className="mt-4">
                  <Field label="Diğer hizmet verdiğin şehirler" hint="Opsiyonel, en fazla 5">
                    <MultiSelectChips
                      options={optionsFrom(CITIES, CITY_LABELS).filter((o) => o.value !== employer.city)}
                      selected={employer.additionalCities}
                      onChange={(additionalCities) => setEmployer({ ...employer, additionalCities })}
                      max={5}
                    />
                  </Field>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="mb-4 font-display text-base font-bold">Hakkında & bağlantılar</h3>
              <Field label="Açıklama"><Textarea rows={5} value={employer.bio} onChange={(e) => setEmployer({ ...employer, bio: e.target.value })} /></Field>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Website"><Input placeholder="https://siteniz.com" value={employer.websiteUrl ?? ''} onChange={(e) => setEmployer({ ...employer, websiteUrl: e.target.value })} /></Field>
                <Field label="Instagram"><Input placeholder="https://instagram.com/kullaniciadi" value={employer.instagramUrl ?? ''} onChange={(e) => setEmployer({ ...employer, instagramUrl: e.target.value })} /></Field>
                <Field label="YouTube"><Input placeholder="https://youtube.com/@kanaladi" value={employer.youtubeUrl ?? ''} onChange={(e) => setEmployer({ ...employer, youtubeUrl: e.target.value })} /></Field>
                <Field label="LinkedIn"><Input placeholder="https://linkedin.com/in/kullaniciadi" value={employer.linkedinUrl ?? ''} onChange={(e) => setEmployer({ ...employer, linkedinUrl: e.target.value })} /></Field>
                <Field label="Spotify"><Input placeholder="https://open.spotify.com/artist/..." value={employer.spotifyUrl ?? ''} onChange={(e) => setEmployer({ ...employer, spotifyUrl: e.target.value })} /></Field>
              </div>
            </Card>
          </>
        )}

        <div className="flex justify-end">
          <Button icon={<Save size={16} />} onClick={handleSave} loading={saving}>Değişiklikleri Kaydet</Button>
        </div>
      </div>
    </div>
  );
}
