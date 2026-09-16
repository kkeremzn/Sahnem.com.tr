import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';

const DOCS = [
  { label: 'Kullanım Koşulları', to: '/kullanim-kosullari' },
  { label: 'Gizlilik Politikası', to: '/gizlilik-politikasi' },
  { label: 'KVKK Aydınlatma Metni', to: '/kvkk-aydinlatma-metni' },
];

export function LegalHero({ title, effectiveDate, version, current }: { title: string; effectiveDate: string; version: string; current: string }) {
  return (
    <section className="border-b border-border bg-noise py-14">
      <Container className="max-w-3xl">
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-xs text-text-faint">
          Yürürlük tarihi: {effectiveDate} · Sürüm {version}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {DOCS.map((doc) => (
            <Link
              key={doc.to}
              to={doc.to}
              className={
                doc.label === current
                  ? 'rounded-full bg-gold/15 px-3 py-1.5 text-xs font-medium text-gold-soft'
                  : 'rounded-full bg-card-hover px-3 py-1.5 text-xs font-medium text-text-dim transition-colors hover:text-text'
              }
            >
              {doc.label}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
