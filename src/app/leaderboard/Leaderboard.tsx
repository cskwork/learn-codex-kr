"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device-id";
import { getRaceScores } from "@/lib/storage";
import { withBase } from "@/lib/paths";
import { Icon, SheetBand, backLink, btnPrimary } from "@/components/omr";

type Row = { device_id: string; display_name: string; best_time_ms: number; races: number };

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [source, setSource] = useState<"cloud" | "local">("local");
  const [me, setMe] = useState("");

  useEffect(() => {
    setMe(getDeviceId());
    if (!isSupabaseConfigured()) {
      const local = getRaceScores();
      const best = local.reduce<number | null>(
        (acc, s) => (acc === null || s.timeMs < acc ? s.timeMs : acc),
        null
      );
      setRows(
        best === null
          ? []
          : [{ device_id: getDeviceId(), display_name: "나", best_time_ms: best, races: local.length }]
      );
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
      .then(({ data, error: err }) => {
        if (err) setError(true);
        setRows((data as Row[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Link href="/" className={backLink}>
          <Icon name="back" size={15} />홈
        </Link>
        <SheetBand left="성적표" right="최근 7일" />
        <h1 className="font-serif text-[2.2rem] font-extrabold tracking-[-0.02em] text-marker sm:text-[2.7rem]">
          주간 리더보드
        </h1>
        <p className="text-[0.95rem] text-text-2">최근 7일간 레이스 모드 최고 기록 · 디바이스별 베스트 1건</p>
        {source === "local" && !loading && (
          <p className="flex items-start gap-2 border-[1.5px] border-pen bg-pen-tint px-3 py-2 text-[0.85rem] leading-6 text-pen">
            <Icon name="info" size={16} className="mt-1" />
            서버 미연결 — 본인 로컬 기록만 표시됩니다.
          </p>
        )}
      </header>

      {loading ? (
        <p role="status" className="border-[1.5px] border-ink-line px-4 py-6 text-center text-[0.9rem] text-text-2">
          불러오는 중...
        </p>
      ) : error ? (
        <p role="alert" className="border-[1.5px] border-pen bg-pen-tint px-4 py-6 text-center text-[0.9rem] text-pen">
          랭킹을 불러오지 못했어요. 잠시 후 새로고침해 주세요.
        </p>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-4 border-[1.5px] border-ink bg-paper px-6 py-10 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase("/art/empty-answer-strip.webp")}
            alt="아직 아무것도 칠하지 않은 빈 답안 칸 다섯 개와 뚜껑이 닫힌 사인펜"
            width={640}
            height={640}
            loading="lazy"
            className="h-40 w-40 mix-blend-multiply"
          />
          <p className="text-[0.95rem] text-text">아직 기록이 없어요. 레이스에 참가해 첫 기록을 남기세요.</p>
          <Link href="/race" className={btnPrimary}>
            레이스 참가
            <Icon name="arrow" />
          </Link>
        </div>
      ) : (
        <div className="border-[1.5px] border-ink">
          <div className="grid grid-cols-[3rem_1fr_auto] border-b-[1.5px] border-ink bg-ink-tint px-4 py-2 text-[0.75rem] font-bold text-ink-strong">
            <span>순위</span>
            <span>이름</span>
            <span>최고 기록</span>
          </div>
          <ol className="divide-y divide-ink-line text-[0.95rem]">
            {rows.map((r, i) => {
              const mine = r.device_id === me;
              return (
                <li
                  key={r.device_id + i}
                  className={`grid grid-cols-[3rem_1fr_auto] items-center px-4 py-3 ${mine ? "bg-paper-2" : ""}`}
                >
                  <span className="font-mono text-[0.9rem] font-bold text-ink">{i + 1}</span>
                  <span className={mine ? "font-bold text-marker" : "text-text"}>
                    {r.display_name || "익명"}
                    {mine && <span className="ml-1 text-[0.72rem] text-ink">(나)</span>}
                  </span>
                  <span className="text-right">
                    <span className="block font-mono text-[1rem] font-bold tabular-nums text-marker">
                      {(r.best_time_ms / 1000).toFixed(2)}s
                    </span>
                    <span className="text-[0.72rem] text-text-2">{r.races}회 참가</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
