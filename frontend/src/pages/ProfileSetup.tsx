import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, Check, Mic2, Sparkles, Store } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatApiError } from '@/lib/apiClient';
import * as authService from '@/services/authService';
import * as profileService from '@/services/profileService';
import { uploadAvatar } from '@/services/uploadService';
import {
  CITIES, CITY_LABELS, MUSIC_BRANCHES, MUSIC_BRANCH_LABELS, ORGANIZER_TYPES, ORGANIZER_TYPE_LABELS,
  USER_TYPE_LABELS, VENUE_TYPES, VENUE_TYPE_LABELS, optionsFrom,
  type City, type IsAvailableToTravel, type MusicBranch, type OrganizerType, type VenueType, type WorkStatus,
} from '@/types';
import { cn } from '@/lib/cn';

// Backend'de rol, register anında değil profil oluşturma anında atanıyor —
// bu yüzden "hangi formu göstereceğiz" bilgisi user.role'den DEĞİL, Register
// sayfasından navigation state ile taşınan seçimden geliyor. Sayfa yenilenip
// bu state kaybolursa (ör. kullanıcı linki kopyalayıp sonra açtıysa), aşağıdaki
// RoleSelector adımı devreye girip aynı seçimi tekrar yaptırıyor.
type Role = 'Musician' | 'Organizer' | 'Venue';
const ROLE_OPTIONS: { value: Role; icon: typeof Mic2 }[] = [
  { value: 'Musician', icon: Mic2 },
  { value: 'Organizer', icon: Building2 },
  { value: 'Venue', icon: Store },
];

interface MusicianForm {
  avatarUrl?: string; branch: MusicBranch | ''; genres: string; experienceYears: string;
  workStatus: WorkStatus; city: City | ''; district: string; isAvailableToTravel: IsAvailableToTravel;
  hasOwnEquipment: boolean; bio: string; instagramUrl: string; youtubeUrl: string; linkedinUrl: string;
}
interface EmployerForm {
  avatarUrl?: string; name: string; organizerType: OrganizerType | ''; venueType: VenueType | '';
  city: City | ''; district: string; address: string; capacity: string; hasSoundSystem: boolean;
  bio: string; websiteUrl: string; instagramUrl: string; youtubeUrl: string; linkedinUrl: string;
}

export function ProfileSetup() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Register.tsx'in navigate() ile taşıdığı state, AuthLayout'un aynı anda
  // tetiklediği kendi (state'siz) yönlendirmesiyle yarışabiliyor — bu yüzden
  // birincil kaynak sessionStorage, location.state ise yedek.
  const storedRole = sessionStorage.getItem('sahnem_pending_role') as Role | null;
  const stateRole = (location.state as { role?: Role } | null)?.role ?? storedRole ?? null;
  const [role, setRole] = useState<Role | null>(stateRole);

  const isMusician = role === 'Musician';

  const [mForm, setMForm] = useState<MusicianForm>({
    branch: '', genres: '', experienceYears: '', workStatus: 'Solo', city: '', district: '',
    isAvailableToTravel: 'Yes', hasOwnEquipment: false, bio: '', instagramUrl: '', youtubeUrl: '', linkedinUrl: '',
  });
  const [eForm, setEForm] = useState<EmployerForm>({
    name: '', organizerType: '', venueType: '', city: '', district: '', address: '', capacity: '',
    hasSoundSystem: false, bio: '', websiteUrl: '', instagramUrl: '', youtubeUrl: '', linkedinUrl: '',
  });

  const steps = ['Görsel', isMusician ? 'Uzmanlık' : 'İşletme', 'Konum', isMusician ? 'Biyografi' : 'Hakkında', 'Onay'];

  function validateStep(): string | null {
    if (step === 1) {
      if (isMusician && !mForm.branch) return 'Lütfen bir branş seç.';
      if (!isMusician && !eForm.name.trim()) return 'İsim alanı zorunlu.';
      if (!isMusician && role === 'Organizer' && !eForm.organizerType) return 'Lütfen organizatör tipini seç.';
      if (!isMusician && role === 'Venue' && !eForm.venueType) return 'Lütfen mekan tipini seç.';
    }
    if (step === 2) {
      if (isMusician && !mForm.city) return 'Lütfen şehir seç.';
      if (!isMusician && !eForm.city) return 'Lütfen şehir seç.';
      if (!isMusician && !eForm.district.trim()) return 'İlçe alanı zorunlu.';
      if (!isMusician && eForm.address.trim().length < 15) return 'Adres en az 15 karakter olmalı.';
    }
    if (step === 3) {
      if (isMusician && mForm.bio.trim().length < 20) return 'Biyografi en az 20 karakter olmalı.';
      if (!isMusician && eForm.bio.trim().length < 20) return 'Açıklama en az 20 karakter olmalı.';
    }
    return null;
  }

  function goNext() {
    const err = validateStep();
    if (err) return setError(err);
    setError('');
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function goBack() {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    if (!user || !role) return;
    setSubmitting(true);
    try {
      if (isMusician) {
        await profileService.createMusicianProfile({
          bio: mForm.bio, branch: mForm.branch as MusicBranch, genres: mForm.genres,
          experienceYears: Number(mForm.experienceYears) || 0, city: mForm.city as City,
          district: mForm.district || undefined, isAvailableToTravel: mForm.isAvailableToTravel,
          hasOwnEquipment: mForm.hasOwnEquipment, workStatus: mForm.workStatus,
          instagramUrl: mForm.instagramUrl || undefined, youtubeUrl: mForm.youtubeUrl || undefined,
          linkedinUrl: mForm.linkedinUrl || undefined,
        });
      } else if (role === 'Organizer') {
        await profileService.createOrganizerProfile({
          organizerName: eForm.name, organizerType: eForm.organizerType as OrganizerType, bio: eForm.bio,
          city: eForm.city as City, district: eForm.district || undefined, address: eForm.address,
          websiteUrl: eForm.websiteUrl || undefined, instagramUrl: eForm.instagramUrl || undefined,
          youtubeUrl: eForm.youtubeUrl || undefined, linkedinUrl: eForm.linkedinUrl || undefined,
        });
      } else {
        await profileService.createVenueProfile({
          venueName: eForm.name, venueType: eForm.venueType as VenueType, bio: eForm.bio,
          city: eForm.city as City, district: eForm.district || undefined, capacity: Number(eForm.capacity) || 0,
          address: eForm.address, hasSoundSystem: eForm.hasSoundSystem, websiteUrl: eForm.websiteUrl || undefined,
          instagramUrl: eForm.instagramUrl || undefined, youtubeUrl: eForm.youtubeUrl || undefined,
          linkedinUrl: eForm.linkedinUrl || undefined,
        });
      }
      // Profil oluşturma uçları Role + IsProfileCompleted=true claim'lerini
      // taşıyan yeni bir access token döner (bkz. backend TokenPairDto akışı);
      // refreshUser bu yeni token'la /user/me'yi tekrar çekip context'i günceller.
      await refreshUser();
      sessionStorage.removeItem('sahnem_pending_role');

      // Avatar AppUser'a ait, profil oluşturma uçları bu alanı almıyor — bu
      // yüzden yüklendiyse ayrıca /user/update ile kalıcı hale getiriliyor.
      const avatarUrl = isMusician ? mForm.avatarUrl : eForm.avatarUrl;
      if (avatarUrl) {
        await authService.updateUser({ firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, avatarUrl });
        await refreshUser();
      }

      toast('Profilin oluşturuldu, hoş geldin!', 'success');
      navigate('/dashboard');
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setSubmitting(false);
    }
  }

  // Register'dan gelen navigation state kayboldu (ör. sayfa doğrudan açıldı) —
  // sihirbaza devam etmeden önce rolü tekrar sor.
  if (!role) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold">Hangi rolde devam ediyorsun?</h2>
        <p className="mt-1 text-sm text-text-dim">Profilini bu seçime göre oluşturacağız.</p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className="flex flex-col items-center gap-1.5 rounded-md border border-border px-3 py-4 text-xs font-medium text-text-dim transition-colors hover:border-gold/50 hover:text-gold-soft"
            >
              <r.icon size={20} />
              {USER_TYPE_LABELS[r.value]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-1.5">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-1.5">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  i < step ? 'bg-gold text-white' : i === step ? 'border-2 border-gold text-gold-soft' : 'border border-border text-text-faint',
                )}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </span>
              <span className={cn('hidden text-[11px] sm:block', i === step ? 'text-text' : 'text-text-faint')}>{label}</span>
            </div>
            {i < steps.length - 1 && <span className={cn('h-px flex-1', i < step ? 'bg-gold' : 'bg-border')} />}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
        {step === 0 && (
          <div>
            <h2 className="font-display text-xl font-bold">Profil fotoğrafın</h2>
            <p className="mt-1 text-sm text-text-dim">
              {isMusician ? 'Yüz fotoğrafın öne çıkma şansını artırır.' : 'Logonuz profilinizde görünecek.'}
            </p>
            <div className="mt-6 flex justify-center">
              <FileDropzone
                shape="circle"
                value={isMusician ? mForm.avatarUrl : eForm.avatarUrl}
                onUpload={uploadAvatar}
                onChange={(url) => (isMusician ? setMForm((f) => ({ ...f, avatarUrl: url })) : setEForm((f) => ({ ...f, avatarUrl: url })))}
                label="Yükle"
              />
            </div>
          </div>
        )}

        {step === 1 && isMusician && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold">Uzmanlık alanın</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Branş" required>
                <Select value={mForm.branch} onChange={(e) => setMForm((f) => ({ ...f, branch: e.target.value as MusicBranch }))}>
                  <option value="">Seç</option>
                  {optionsFrom(MUSIC_BRANCHES, MUSIC_BRANCH_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              </Field>
              <Field label="Deneyim (yıl)">
                <Input type="number" min={0} value={mForm.experienceYears} onChange={(e) => setMForm((f) => ({ ...f, experienceYears: e.target.value }))} />
              </Field>
            </div>
            <Field label="Türler / Genre" hint="Virgülle ayırarak yaz (ör. Caz, Soul, Pop)">
              <Input value={mForm.genres} onChange={(e) => setMForm((f) => ({ ...f, genres: e.target.value }))} />
            </Field>
            <Field label="Çalışma şekli">
              <div className="flex gap-2">
                {(['Solo', 'Group'] as const).map((ws) => (
                  <button key={ws} type="button" onClick={() => setMForm((f) => ({ ...f, workStatus: ws }))}
                    className={cn('flex-1 rounded-md border px-3 py-2.5 text-sm font-medium', mForm.workStatus === ws ? 'border-gold bg-gold/10 text-gold-soft' : 'border-border text-text-dim')}>
                    {ws === 'Solo' ? 'Solo' : 'Grup'}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 1 && !isMusician && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold">{role === 'Organizer' ? 'Organizasyon bilgin' : 'Mekan bilgin'}</h2>
            <Field label={role === 'Organizer' ? 'Organizasyon adı' : 'Mekan adı'} required>
              <Input value={eForm.name} onChange={(e) => setEForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            {role === 'Organizer' ? (
              <Field label="Organizatör tipi" required>
                <Select value={eForm.organizerType} onChange={(e) => setEForm((f) => ({ ...f, organizerType: e.target.value as OrganizerType }))}>
                  <option value="">Seç</option>
                  {optionsFrom(ORGANIZER_TYPES, ORGANIZER_TYPE_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              </Field>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Mekan tipi" required>
                  <Select value={eForm.venueType} onChange={(e) => setEForm((f) => ({ ...f, venueType: e.target.value as VenueType }))}>
                    <option value="">Seç</option>
                    {optionsFrom(VENUE_TYPES, VENUE_TYPE_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </Field>
                <Field label="Kapasite">
                  <Input type="number" min={0} value={eForm.capacity} onChange={(e) => setEForm((f) => ({ ...f, capacity: e.target.value }))} />
                </Field>
              </div>
            )}
            {role === 'Venue' && (
              <Switch checked={eForm.hasSoundSystem} onChange={(v) => setEForm((f) => ({ ...f, hasSoundSystem: v }))} label="Ses sistemi mevcut" />
            )}
          </div>
        )}

        {step === 2 && isMusician && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold">Konum & seyahat</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Şehir" required>
                <Select value={mForm.city} onChange={(e) => setMForm((f) => ({ ...f, city: e.target.value as City }))}>
                  <option value="">Seç</option>
                  {optionsFrom(CITIES, CITY_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              </Field>
              <Field label="İlçe">
                <Input value={mForm.district} onChange={(e) => setMForm((f) => ({ ...f, district: e.target.value }))} />
              </Field>
            </div>
            <Switch checked={mForm.isAvailableToTravel === 'Yes'} onChange={(v) => setMForm((f) => ({ ...f, isAvailableToTravel: v ? 'Yes' : 'No' }))} label="Şehir dışına seyahat edebilirim" />
            <Switch checked={mForm.hasOwnEquipment} onChange={(v) => setMForm((f) => ({ ...f, hasOwnEquipment: v }))} label="Kendi ekipmanım var" />
          </div>
        )}

        {step === 2 && !isMusician && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold">Konum</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Şehir" required>
                <Select value={eForm.city} onChange={(e) => setEForm((f) => ({ ...f, city: e.target.value as City }))}>
                  <option value="">Seç</option>
                  {optionsFrom(CITIES, CITY_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              </Field>
              <Field label="İlçe" required>
                <Input value={eForm.district} onChange={(e) => setEForm((f) => ({ ...f, district: e.target.value }))} />
              </Field>
            </div>
            <Field label="Açık adres" required hint="En az 15 karakter">
              <Input value={eForm.address} onChange={(e) => setEForm((f) => ({ ...f, address: e.target.value }))} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold">{isMusician ? 'Biyografin' : 'Hakkında'}</h2>
            <Field label="Açıklama" required hint="En az 20 karakter">
              <Textarea
                rows={5}
                value={isMusician ? mForm.bio : eForm.bio}
                onChange={(e) => (isMusician ? setMForm((f) => ({ ...f, bio: e.target.value })) : setEForm((f) => ({ ...f, bio: e.target.value })))}
              />
            </Field>
            {!isMusician && (
              <Field label="Website" hint="Opsiyonel">
                <Input value={eForm.websiteUrl} onChange={(e) => setEForm((f) => ({ ...f, websiteUrl: e.target.value }))} placeholder="https://" />
              </Field>
            )}
            <div className="grid grid-cols-3 gap-3">
              <Field label="Instagram" hint="Opsiyonel">
                <Input
                  value={isMusician ? mForm.instagramUrl : eForm.instagramUrl}
                  onChange={(e) => (isMusician ? setMForm((f) => ({ ...f, instagramUrl: e.target.value })) : setEForm((f) => ({ ...f, instagramUrl: e.target.value })))}
                />
              </Field>
              <Field label="Youtube" hint="Opsiyonel">
                <Input
                  value={isMusician ? mForm.youtubeUrl : eForm.youtubeUrl}
                  onChange={(e) => (isMusician ? setMForm((f) => ({ ...f, youtubeUrl: e.target.value })) : setEForm((f) => ({ ...f, youtubeUrl: e.target.value })))}
                />
              </Field>
              <Field label="LinkedIn" hint="Opsiyonel">
                <Input
                  value={isMusician ? mForm.linkedinUrl : eForm.linkedinUrl}
                  onChange={(e) => (isMusician ? setMForm((f) => ({ ...f, linkedinUrl: e.target.value })) : setEForm((f) => ({ ...f, linkedinUrl: e.target.value })))}
                />
              </Field>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-soft">
              <Sparkles size={24} />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">Her şey hazır!</h2>
            <p className="mt-1.5 text-sm text-text-dim">Profilini oluşturmak için onaylamanı bekliyoruz.</p>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <div className="mt-8 flex justify-between border-t border-border pt-6">
          <Button variant="secondary" onClick={goBack} disabled={step === 0}>Geri</Button>
          {step === steps.length - 1 ? (
            <Button onClick={handleSubmit} loading={submitting}>Profili Oluştur</Button>
          ) : (
            <Button onClick={goNext}>Devam Et</Button>
          )}
        </div>
      </div>
    </div>
  );
}
