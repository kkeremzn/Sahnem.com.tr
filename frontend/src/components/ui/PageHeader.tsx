import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-text-dim">{description}</p>}
      </div>
      {action}
    </div>
  );
}
