import type { ReactNode } from 'react';

// Uzun hukuki metinler için tek yerden yönetilen tipografi — her başlık/paragraf/
// tabloya ayrı ayrı className yazmak yerine tag bazlı stil uygulanıyor.
export function LegalProse({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        space-y-4 text-sm leading-relaxed text-text-dim
        [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-text
        [&_h2:first-child]:mt-0
        [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-text
        [&_p]:leading-relaxed
        [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5
        [&_li]:leading-relaxed
        [&_strong]:font-semibold [&_strong]:text-text
        [&_a]:text-gold-soft [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-gold
      "
    >
      {children}
    </div>
  );
}

export function LegalTable({ head, rows }: { head: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[560px] border-collapse text-xs">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="border-b border-border bg-card px-3 py-2 text-left font-semibold text-text">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border-b border-border px-3 py-2 align-top text-text-dim last:border-b-0">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
