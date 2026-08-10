import { cn } from '@/lib/cn';

const GRADIENTS = [
  'from-fuchsia-500 to-purple-700', 'from-cyan-500 to-blue-700', 'from-amber-400 to-orange-600',
  'from-rose-500 to-pink-700', 'from-emerald-400 to-teal-700', 'from-violet-500 to-indigo-700',
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return hash;
}

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  ring?: boolean;
  className?: string;
}

export function Avatar({ name, src, size = 40, ring = false, className }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
  const gradient = GRADIENTS[hashName(name) % GRADIENTS.length];

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-bold text-white',
        `bg-gradient-to-br ${gradient}`,
        ring && 'ring-2 ring-gold ring-offset-2 ring-offset-black',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </span>
  );
}
