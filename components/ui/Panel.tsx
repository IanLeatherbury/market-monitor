import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className = '', ...props }: PanelProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface p-4 text-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
