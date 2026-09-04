import { cn } from '@/lib/cn';

interface LogoMarkProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

// Yükseklikler artık ortadaki çubuğa göre tam ayna simetrik (24/60/85/60/24) —
// önceki değerler (23/60/85/52/27) neredeyse simetrikti ama birkaç birim
// kayıktı, bu da logoyu gözle fark edilir şekilde "acemi/hizasız" gösteriyordu.
const BARS = [
  { x: -43, y: -12, h: 24 },
  { x: -26, y: -30, h: 60 },
  { x: -5.5, y: -42.5, h: 85 },
  { x: 15, y: -30, h: 60 },
  { x: 32, y: -12, h: 24 },
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
