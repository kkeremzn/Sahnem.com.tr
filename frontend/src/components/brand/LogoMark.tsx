import { cn } from '@/lib/cn';

interface LogoMarkProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

const BARS = [
  { x: -43, y: -11.5, h: 23 },
  { x: -26, y: -30, h: 60 },
  { x: -5.5, y: -42.5, h: 85 },
  { x: 15, y: -26, h: 52 },
  { x: 32, y: -13.5, h: 27 },
];

export function LogoMark({ size = 28, withWordmark = false, className }: LogoMarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg width={size} height={size} viewBox="-50 -50 100 100" className="shrink-0">
        <g fill="currentColor">
          {BARS.map((bar, i) => (
            <rect key={i} x={bar.x} y={bar.y} width={11} height={bar.h} rx={3} />
          ))}
        </g>
      </svg>
      {withWordmark && (
        <span className="font-display text-lg font-extrabold tracking-tight text-text">
          SAHNEM
        </span>
      )}
    </span>
  );
}
