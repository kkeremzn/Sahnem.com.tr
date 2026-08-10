import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/brand/LogoMark';

export function NotFound() {
  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center py-20 text-center">
      <div className="text-gold opacity-70">
        <LogoMark size={40} />
      </div>
      <h1 className="mt-6 font-display text-7xl font-extrabold text-gradient">404</h1>
      <h2 className="mt-3 font-display text-xl font-bold text-text">Bu sahne boş görünüyor</h2>
      <p className="mt-2 max-w-sm text-sm text-text-dim">Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <Link to="/">
        <Button className="mt-7" icon={<Home size={16} />}>Anasayfaya Dön</Button>
      </Link>
    </Container>
  );
}
