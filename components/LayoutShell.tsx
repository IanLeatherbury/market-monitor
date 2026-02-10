import React from 'react';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {children}
    </div>
  );
}
