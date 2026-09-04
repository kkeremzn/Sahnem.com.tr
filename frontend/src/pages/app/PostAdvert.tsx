import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPinned, Send } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as advertService from '@/services/advertService';
import * as profileService from '@/services/profileService';
import { CITIES, CITY_LABELS, MUSIC_BRANCHES, MUSIC_BRANCH_LABELS, optionsFrom, type City } from '@/types';
import { DISTRICTS } from '@/data/districts';
import { formatApiError } from '@/lib/apiClient';

const schema = z
  .object({
    title: z.string().min(20, 'Başlık en az 20 karakter olmalı.').max(100, 'Başlık en fazla 100 karakter olabilir.'),
    description: z.string().min(30, 'Açıklama en az 30 karakter olmalı.').max(1000, 'Açıklama en fazla 1000 karakter olabilir.'),
    city: z.string().min(1, 'Şehir seç.'),
    district: z.string().max(50, 'İlçe en fazla 50 karakter olabilir.').optional(),
    address: z.string().min(1, 'Adres gerekli.'),
    branch: z.string().optional(),
    eventTime: z.string().min(1, 'Etkinlik tarihi gerekli.'),
    applicationDeadline: z.string().min(1, 'Son başvuru tarihi gerekli.'),
    budget: z.coerce.number().min(1, 'Geçerli bir bütçe gir.'),
    minimumExperienceYears: z.coerce.number().min(0).max(50, 'En fazla 50 yıl girilebilir.').optional(),
  })
  .refine((data) => new Date(data.eventTime).getTime() > Date.now() + 24 * 60 * 60 * 1000, {
    message: 'Etkinlik tarihi en az 1 gün sonrası için olmalı.',
    path: ['eventTime'],
  })
  .refine((data) => new Date(data.applicationDeadline).getTime() > Date.now(), {
    message: 'Son başvuru tarihi gelecekte olmalı.',
    path: ['applicationDeadline'],
  })
  .refine((data) => new Date(data.applicationDeadline).getTime() < new Date(data.eventTime).getTime(), {
    message: 'Son başvuru tarihi etkinlik tarihinden önce olmalı.',
    path: ['applicationDeadline'],
  });
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

export function PostAdvert() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [equipmentProvided, setEquipmentProvided] = useState(true);
  const [equipmentNote, setEquipmentNote] = useState('');
  const [loadingOwnAddress, setLoadingOwnAddress] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
  });
  const selectedCity = watch('city') as City | undefined;

  async function handleUseOwnAddress() {
    setLoadingOwnAddress(true);
    try {
      const profile = await profileService.getMyProfile();
      if ('address' in profile) {
        setValue('city', profile.city, { shouldValidate: true });
        setValue('district', profile.district ?? '');
        setValue('address', profile.address, { shouldValidate: true });
      }
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setLoadingOwnAddress(false);
    }
  }

  async function onSubmit(data: FormData) {
    if (!user) return;
    try {
      const advert = await advertService.createAdvert({
        title: data.title, description: data.description, city: data.city as never,
        district: data.district || undefined, address: data.address,
        equipmentProvided, equipmentNote: equipmentNote || undefined,
        eventTime: new Date(data.eventTime).toISOString(),
        budget: data.budget, minimumExperienceYears: data.minimumExperienceYears || undefined,
        applicationDeadline: new Date(data.applicationDeadline).toISOString(),
        branch: (data.branch || undefined) as never,
      });
      toast('İlanın yayınlandı.', 'success');
      navigate(`/my-adverts/${advert.id}`);
    } catch (e) {
      toast(formatApiError(e), 'error');
    }
  }

  return (
    <div>
      <PageHeader title="İlan Ver" description="Etkinliğin için aradığın müzisyeni bulmak üzere bir ilan yayınla." />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="space-y-4">
          <Field label="İlan başlığı" required hint="20-100 karakter" error={errors.title?.message}>
            <Input placeholder="ör. Kurumsal Gala Gecesi için Caz Vokalisti" {...register('title')} invalid={!!errors.title} />
          </Field>
          <Field label="Açıklama" required hint="30-1000 karakter" error={errors.description?.message}>
            <Textarea rows={5} placeholder="Etkinliğin detaylarını, beklentilerini yaz..." {...register('description')} invalid={!!errors.description} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Aranan branş" hint="Opsiyonel">
              <Select {...register('branch')}>
                <option value="">Belirtilmedi</option>
                {optionsFrom(MUSIC_BRANCHES, MUSIC_BRANCH_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
            <Field label="Minimum deneyim (yıl)" hint="Opsiyonel">
              <Input type="number" min={0} placeholder="3" {...register('minimumExperienceYears')} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Şehir" required error={errors.city?.message}>
              <Select {...register('city', { onChange: () => setValue('district', '') })} invalid={!!errors.city}>
                <option value="">Seç</option>
                {optionsFrom(CITIES, CITY_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
            <Field label="İlçe" hint="Opsiyonel">
              <Select {...register('district')} disabled={!selectedCity}>
                <option value="">Seç</option>
                {selectedCity && DISTRICTS[selectedCity].map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label="Adres" required error={errors.address?.message}>
              <Input placeholder="Etkinlik mekanı" {...register('address')} invalid={!!errors.address} />
            </Field>
          </div>
          <button
            type="button"
            onClick={handleUseOwnAddress}
            disabled={loadingOwnAddress}
            className="focus-ring -mt-1 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-gold-soft hover:underline disabled:opacity-60"
          >
            <MapPinned size={13} /> {loadingOwnAddress ? 'Yükleniyor...' : 'Kendi adresimi kullan'}
          </button>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Etkinlik tarihi & saati" required error={errors.eventTime?.message}>
              <Input type="datetime-local" {...register('eventTime')} invalid={!!errors.eventTime} />
            </Field>
            <Field label="Son başvuru tarihi" required error={errors.applicationDeadline?.message}>
              <Input type="date" {...register('applicationDeadline')} invalid={!!errors.applicationDeadline} />
            </Field>
            <Field label="Bütçe (₺)" required error={errors.budget?.message}>
              <Input type="number" min={0} placeholder="15000" {...register('budget')} invalid={!!errors.budget} />
            </Field>
          </div>

          <div>
            <Switch checked={equipmentProvided} onChange={setEquipmentProvided} label="Ekipman sağlanıyor mu?" description="Ses sistemi, enstrüman vb." />
            <Input
              className="mt-3"
              placeholder="Detay ekle (opsiyonel), ör. Anfi var, gitar yok"
              value={equipmentNote}
              onChange={(e) => setEquipmentNote(e.target.value)}
              maxLength={300}
            />
          </div>

          <div className="flex justify-end border-t border-border pt-5">
            <Button type="submit" icon={<Send size={16} />} loading={isSubmitting}>İlanı Yayınla</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
