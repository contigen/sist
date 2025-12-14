"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UserProfile } from "./user-profile";

type NavItem = {
  name: string;
  href: string;
  requiresAgent?: boolean;
};

export function Nav() {
  const pathname = usePathname();
  const [agentId, setAgentId] = useState<string | null>(null);

  useEffect(() => {
    setAgentId(localStorage.getItem("agentId"));
  }, []);

  const navItems: NavItem[] = [
    { name: "Playground", href: "/playground" },
    { name: "Deploy", href: `/deploy/${agentId}`, requiresAgent: true },
    {
      name: "Preview",
      href: `/preview?agentId=${agentId}`,
      requiresAgent: true,
    },
    { name: "Library", href: "/library" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-gold-400 to-gold-600">
            <span className="text-lg font-bold text-background">S</span>
          </div>
          <span className="text-xl font-bold">Sist</span>
        </Link>

        <nav className="flex items-center space-x-1">
          {navItems.map((item) => {
            const isDisabled = item.requiresAgent && !agentId;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={isDisabled ? "#" : item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isDisabled && "pointer-events-none opacity-50",
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto">
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
