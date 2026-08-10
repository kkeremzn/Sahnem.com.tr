import { useState } from 'react';
import { ChevronDown, FileText, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

const FAQS = [
  { q: 'Sahnem\'e nasıl kayıt olabilirim?', a: 'Kayıt Ol sayfasından e-posta adresin ile hızlıca hesap oluşturabilir, ardından müzisyen ya da organizatör/mekan profilini tamamlayabilirsin.' },
  { q: 'Müzisyen olarak nasıl ilana teklif verebilirim?', a: 'İlanlar sayfasından sana uygun bir ilan bul, detay sayfasındaki teklif formunu doldurarak mesaj ve fiyat teklifini gönder.' },
  { q: 'Organizatör olarak nasıl ilan açarım?', a: 'Panelinden "İlan Ver" butonuna tıklayarak etkinlik detaylarını, bütçeni ve tarihini içeren bir ilan oluşturabilirsin.' },
  { q: 'Profilim ne zaman doğrulanır?', a: 'Profil doğrulama süreci ekibimiz tarafından manuel olarak yürütülür; genellikle 1-2 iş günü içinde tamamlanır.' },
  { q: 'Ödeme süreci platform üzerinden mi yürüyor?', a: 'Şu an için ödeme koordinasyonu taraflar arasında doğrudan yürütülüyor; platform üzerinden ödeme entegrasyonu yol haritamızda.' },
  { q: 'Hesabımı nasıl silebilirim?', a: 'Ayarlar sayfasındaki Hesap sekmesinden hesabını kalıcı olarak silebilirsin.' },
];

const LEGAL = [
  { icon: FileText, title: 'Kullanım Koşulları', desc: 'Platformu kullanırken uyman gereken kurallar.' },
  { icon: Lock, title: 'Gizlilik Politikası', desc: 'Verilerini nasıl işlediğimizi öğren.' },
  { icon: ShieldCheck, title: 'KVKK Aydınlatma Metni', desc: 'Kişisel verilerin korunması hakkında bilgi.' },
];

export function Help() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Container className="max-w-3xl py-14">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold">Yardım Merkezi</h1>
        <p className="mt-3 text-sm text-text-dim">Sık sorulan sorular ve destek kaynakları.</p>
      </div>

      <div className="mt-10 space-y-2.5">
        {FAQS.map((faq, i) => (
          <Card key={faq.q} className="cursor-pointer p-0" onClick={() => setOpen(open === i ? null : i)}>
            <div className="flex items-center justify-between px-5 py-4">
              <h3 className="text-sm font-semibold text-text">{faq.q}</h3>
              <ChevronDown size={16} className={cn('shrink-0 text-text-faint transition-transform', open === i && 'rotate-180')} />
            </div>
            {open === i && <p className="border-t border-border px-5 pb-4 pt-3 text-sm text-text-dim">{faq.a}</p>}
          </Card>
        ))}
      </div>

      <div className="mt-14">
        <h2 className="mb-4 font-display text-lg font-bold">Yasal Belgeler</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {LEGAL.map((item) => (
            <Card key={item.title} hover className="cursor-pointer">
              <item.icon size={18} className="text-gold-soft" />
              <h3 className="mt-2.5 text-sm font-semibold">{item.title}</h3>
              <p className="mt-1 text-xs text-text-dim">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <Mail size={20} className="text-gold-soft" />
          <div>
            <h3 className="text-sm font-semibold">Sorunun mu var?</h3>
            <p className="text-xs text-text-dim">destek@sahnem.com adresinden bize ulaşabilirsin.</p>
          </div>
        </div>
      </Card>
    </Container>
  );
}
