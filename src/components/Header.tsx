"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PresenceBadge from "./PresenceBadge";

const NAV: { href: string; label: string }[] = [
  { href: "/lessons", label: "레슨" },
  { href: "/daily", label: "오늘" },
  { href: "/coop", label: "코업" },
  { href: "/race", label: "레이스" },
  { href: "/leaderboard", label: "랭킹" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#050607]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#050607]/65">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-100"
          aria-label="codex-tutorial 홈"
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200 shadow-[0_0_28px_rgba(16,185,129,0.18)] transition group-hover:border-emerald-200/40">
            ⌘
          </span>
          <span className="hidden sm:inline">codex-tutorial</span>
          <span className="sm:hidden">codex-tutorial</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto text-xs" aria-label="주요 메뉴">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 font-medium transition ${
                  active
                    ? "bg-emerald-300/12 text-emerald-100 ring-1 ring-emerald-300/20"
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
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
