"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device-id";
import { getRaceScores } from "@/lib/storage";

type Row = { device_id: string; display_name: string; best_time_ms: number; races: number };

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"cloud" | "local">("local");
  const me = typeof window !== "undefined" ? getDeviceId() : "";

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const local = getRaceScores();
      const byMe = local
        .map((s) => ({
          device_id: getDeviceId(),
          display_name: "나",
          best_time_ms: s.timeMs,
          races: 1,
        }))
        .sort((a, b) => a.best_time_ms - b.best_time_ms)
        .slice(0, 1);
      setRows(byMe);
      setSource("local");
      setLoading(false);
      return;
    }
    setSource("cloud");
    const sb = getSupabase();
    if (!sb) return;
    sb.from("weekly_leaderboard")
      .select("device_id, display_name, best_time_ms, races")
      .order("best_time_ms", { ascending: true })
      .limit(50)
      .then(({ data }) => {
        setRows((data as Row[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← 홈
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">주간 리더보드</h1>
        <p className="mt-1 text-sm text-zinc-400">
          최근 7일간 레이스 모드 최고 기록 · 디바이스별 베스트 1건
        </p>
        {source === "local" && (
          <p className="mt-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-200">
            서버 미연결 — 본인 로컬 기록만 표시됩니다.
          </p>
        )}
      </header>

      {loading ? (
        <p className="text-sm text-zinc-500">불러오는 중...</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 text-center text-sm text-zinc-400">
          아직 기록이 없어요. <Link href="/race" className="text-emerald-300 underline">레이스에 참가</Link>해 첫 기록을 남기세요.
        </p>
      ) : (
        <ol className="flex flex-col divide-y divide-zinc-900 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 text-sm">
          {rows.map((r, i) => (
            <li
              key={r.device_id + i}
              className={`flex items-center justify-between px-4 py-3 ${
                r.device_id === me ? "bg-emerald-500/10" : ""
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="w-6 text-right font-mono text-xs text-zinc-500">
                  {i + 1}
                </span>
                <span className={r.device_id === me ? "text-emerald-100" : "text-zinc-100"}>
                  {r.display_name || "익명"}
                  {r.device_id === me && (
                    <span className="ml-1 text-[10px] text-emerald-300">(나)</span>
                  )}
                </span>
              </span>
              <span className="text-right">
                <span className="block font-mono text-sm text-zinc-100">
                  {(r.best_time_ms / 1000).toFixed(2)}s
                </span>
                <span className="text-[10px] text-zinc-500">{r.races}회 참가</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
