import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border px-6 py-16 text-center">
      {icon && <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-card text-text-faint">{icon}</div>}
      <h3 className="font-display text-lg font-bold text-text">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-text-dim">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
