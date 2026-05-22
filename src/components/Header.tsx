"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PresenceBadge from "./PresenceBadge";

const NAV: { href: string; label: string }[] = [
  { href: "/lessons", label: "레슨" },
  { href: "/coop", label: "코업" },
  { href: "/race", label: "레이스" },
  { href: "/daily", label: "오늘" },
  { href: "/leaderboard", label: "랭킹" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-100"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-emerald-500/15 text-emerald-300">
            ⌘
          </span>
          <span className="hidden sm:inline">learn-codex-kr</span>
          <span className="sm:hidden">codex-kr</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto text-xs">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  active
                    ? "bg-emerald-500/20 text-emerald-200"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <PresenceBadge variant="compact" />
      </div>
    </header>
  );
}
