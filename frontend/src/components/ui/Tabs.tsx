import { cn } from '@/lib/cn';

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ items, active, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 overflow-x-auto border-b border-border', className)}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={cn(
            'focus-ring relative flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
            active === item.key ? 'text-text' : 'text-text-dim hover:text-text',
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className={cn('rounded-full px-1.5 py-0.5 text-xs', active === item.key ? 'bg-gold/20 text-gold-soft' : 'bg-card text-text-faint')}>
              {item.count}
            </span>
          )}
          {active === item.key && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gold" />
          )}
        </button>
      ))}
    </div>
  );
}
