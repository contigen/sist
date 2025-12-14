import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  breadcrumb?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({ breadcrumb, children }: PageHeaderProps) {
  return (
    <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter">Sist</span>
          </Link>
          {breadcrumb && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">
                {breadcrumb}
              </span>
            </>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}
