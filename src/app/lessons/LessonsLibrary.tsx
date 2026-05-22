"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lesson } from "@/lib/lessons";
import { getProgress } from "@/lib/storage";

type Props = { lessons: Lesson[] };

export default function LessonsLibrary({ lessons }: Props) {
  const [doneSlugs, setDoneSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDoneSlugs(new Set(getProgress().map((p) => p.slug)));
  }, []);

  return (
    <ul className="flex flex-col gap-3">
      {lessons.map((l) => {
        const done = doneSlugs.has(l.slug);
        return (
          <li key={l.slug}>
            <Link
              href={`/lessons/${l.slug}`}
              className="group flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-emerald-500/40 hover:bg-zinc-900/70"
            >
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                  done
                    ? "bg-emerald-500/20 text-emerald-200"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                {done ? "✓" : l.order}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-200">
                    {l.title}
                  </h3>
                  <span className="text-[11px] text-zinc-500">
                    {l.estMinutes}분
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  {l.subtitle}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {l.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
