import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
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
import { CITIES, CITY_LABELS, MUSIC_BRANCHES, MUSIC_BRANCH_LABELS, optionsFrom } from '@/types';

const schema = z.object({
  title: z.string().min(6, 'Başlık en az 6 karakter olmalı.'),
  description: z.string().min(30, 'Açıklama en az 30 karakter olmalı.'),
  city: z.string().min(1, 'Şehir seç.'),
  district: z.string().optional(),
  address: z.string().min(4, 'Adres gerekli.'),
  branch: z.string().optional(),
  eventTime: z.string().min(1, 'Etkinlik tarihi gerekli.'),
  applicationDeadline: z.string().min(1, 'Son başvuru tarihi gerekli.'),
  budget: z.coerce.number().min(1, 'Geçerli bir bütçe gir.'),
  minimumExperienceYears: z.coerce.number().min(0).optional(),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

export function PostAdvert() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [employerName, setEmployerName] = useState('');
  const [employerKind, setEmployerKind] = useState<'Organizer' | 'Venue'>('Organizer');
  const [equipmentProvided, setEquipmentProvided] = useState(true);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!user) return;
    profileService.getEmployerByUserId(user.id).then((e) => {
      if (!e) return;
      setEmployerKind(e.kind);
      setEmployerName(e.kind === 'Organizer' ? e.organizerName : e.venueName);
    });
  }, [user]);

  async function onSubmit(data: FormData) {
    if (!user) return;
    try {
      const advert = await advertService.createAdvert(user.id, employerName, employerKind, {
        title: data.title, description: data.description, city: data.city as never,
        district: data.district || undefined, address: data.address,
        equipmentProvided, eventTime: new Date(data.eventTime).toISOString(),
        budget: data.budget, minimumExperienceYears: data.minimumExperienceYears || undefined,
        applicationDeadline: new Date(data.applicationDeadline).toISOString(),
        branch: (data.branch || undefined) as never,
      });
      toast('İlanın yayınlandı.', 'success');
      navigate(`/my-adverts/${advert.id}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Bir hata oluştu.', 'error');
    }
  }

  return (
    <div>
      <PageHeader title="İlan Ver" description="Etkinliğin için aradığın müzisyeni bulmak üzere bir ilan yayınla." />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="space-y-4">
          <Field label="İlan başlığı" required error={errors.title?.message}>
            <Input placeholder="ör. Kurumsal Gala Gecesi için Caz Vokalisti" {...register('title')} invalid={!!errors.title} />
          </Field>
          <Field label="Açıklama" required error={errors.description?.message}>
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
              <Select {...register('city')} invalid={!!errors.city}>
                <option value="">Seç</option>
                {optionsFrom(CITIES, CITY_LABELS).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
            <Field label="İlçe" hint="Opsiyonel">
              <Input {...register('district')} />
            </Field>
            <Field label="Adres" required error={errors.address?.message}>
              <Input placeholder="Etkinlik mekanı" {...register('address')} invalid={!!errors.address} />
            </Field>
          </div>

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

          <Switch checked={equipmentProvided} onChange={setEquipmentProvided} label="Ekipman sağlanıyor mu?" description="Ses sistemi, enstrüman vb." />

          <div className="flex justify-end border-t border-border pt-5">
            <Button type="submit" icon={<Send size={16} />} loading={isSubmitting}>İlanı Yayınla</Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
