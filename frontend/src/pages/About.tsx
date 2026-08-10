import { useNavigate } from 'react-router-dom';
import { Compass, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

const VALUES = [
  { icon: Sparkles, title: 'Profesyonellik', desc: 'Her müzisyen ve organizasyon, hak ettiği ciddiyetle karşılanır.' },
  { icon: ShieldCheck, title: 'Güven', desc: 'Doğrulanmış profiller ve şeffaf teklif süreciyle güvenli bir ortam sağlıyoruz.' },
  { icon: Compass, title: 'Erişilebilirlik', desc: '81 ilde, her ölçekte etkinlik için doğru ismi bulmayı kolaylaştırıyoruz.' },
  { icon: Heart, title: 'Müziğe saygı', desc: 'Platformun merkezinde her zaman sanatçı ve sanatı var.' },
];

const TEAM = [
  { name: 'Kerem Uzun', role: 'Kurucu & Ürün' },
  { name: 'Elif Demir', role: 'Tasarım' },
  { name: 'Can Yıldız', role: 'Mühendislik' },
];

export function About() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="border-b border-border bg-noise py-20">
        <Container className="max-w-3xl text-center">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            Müziğin <span className="text-gradient">buluşma noktası</span>
          </h1>
          <p className="mt-4 text-base text-text-dim">
            Sahnem, müzisyenleri organizatör ve mekanlarla doğrudan buluşturan bir platform. Amacımız, sahne arayan her
            yeteneğin ve doğru sanatçıyı arayan her etkinliğin birbirini kolayca bulmasını sağlamak.
          </p>
        </Container>
      </section>

      <section className="border-b border-border py-16">
        <Container className="grid gap-8 lg:grid-cols-2">
          <Card>
            <h2 className="font-display text-xl font-bold">Misyonumuz</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-dim">
              Türkiye'nin her yerindeki müzisyenlerin yeteneklerini sergileyebileceği, organizatör ve mekanların da
              güvenilir bir şekilde doğru sanatçıya ulaşabileceği şeffaf bir pazar yeri kurmak.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-xl font-bold">Vizyonumuz</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-dim">
              Canlı müzik ekosisteminde ilk akla gelen platform olmak; her ölçekten etkinliğin müzik ihtiyacını
              saniyeler içinde karşılayabildiği bir altyapı sunmak.
            </p>
          </Card>
        </Container>
      </section>

      <section className="border-b border-border bg-deep py-16">
        <Container>
          <h2 className="text-center font-display text-2xl font-bold">Değerlerimiz</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <Card key={v.title} className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-soft">
                  <v.icon size={20} />
                </div>
                <h3 className="mt-3 font-semibold text-text">{v.title}</h3>
                <p className="mt-1.5 text-sm text-text-dim">{v.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-16">
        <Container>
          <h2 className="text-center font-display text-2xl font-bold">Ekibimiz</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {TEAM.map((member) => (
              <Card key={member.name} className="text-center">
                <Avatar name={member.name} size={64} className="mx-auto" />
                <h3 className="mt-3 font-semibold text-text">{member.name}</h3>
                <p className="text-sm text-text-dim">{member.role}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="text-center">
          <h2 className="font-display text-2xl font-bold">Bize katıl</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-dim">Müzisyen ya da organizatör olarak Sahnem ailesine katılmak sadece bir dakika sürer.</p>
          <Button size="lg" className="mt-6" onClick={() => navigate('/register')}>Ücretsiz Kayıt Ol</Button>
        </Container>
      </section>
    </div>
  );
}
