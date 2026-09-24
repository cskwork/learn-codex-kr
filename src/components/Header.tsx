"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PresenceBadge from "./PresenceBadge";
import StreakBadge from "./StreakBadge";

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
    <header className="sticky top-0 z-30 border-b-[1.5px] border-ink bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-stretch justify-between gap-x-4 px-4 sm:flex-nowrap sm:px-6">
        <Link
          href="/"
          className="flex min-h-12 items-center gap-2.5 py-2 text-marker"
          aria-label="codex-tutorial 홈"
        >
          <span aria-hidden className="flex flex-col gap-[3px]">
            <span className="block h-[5px] w-4 bg-marker" />
            <span className="block h-[5px] w-4 bg-marker" />
            <span className="block h-[5px] w-4 bg-ink" />
          </span>
          <span className="font-serif text-[1.05rem] font-extrabold tracking-tight">codex-tutorial</span>
        </Link>

        <div className="flex items-center gap-3 sm:order-last">
          <StreakBadge compact />
          <PresenceBadge variant="compact" />
        </div>

        <nav
          className="-mx-4 grid w-[calc(100%+2rem)] grid-cols-5 border-t-[1.5px] border-ink-line sm:mx-0 sm:ml-auto sm:flex sm:w-auto sm:border-t-0"
          aria-label="주요 메뉴"
        >
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center justify-center border-r-[1.5px] border-ink-line px-3 text-[0.85rem] font-bold transition-colors last:border-r-0 sm:border-r-0 sm:border-l-[1.5px] sm:last:border-r-[1.5px] sm:px-4 ${
                  active
                    ? "bg-marker text-paper"
                    : "text-ink-strong hover:bg-ink-tint"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
