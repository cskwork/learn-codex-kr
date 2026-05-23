import Link from "next/link";
import { allLessons } from "@/lib/lessons";
import LessonsLibrary from "./LessonsLibrary";

export const metadata = {
  title: "레슨 라이브러리 · codex-tutorial",
  description:
    "Codex CLI 핵심 워크플로를 5–10분 단위 한국어 레슨으로 익혀요.",
};

export default function LessonsIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-20 pt-8 sm:px-6">
      <header className="flex flex-col gap-2">
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← 홈
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
          레슨 라이브러리
        </h1>
        <p className="text-sm text-zinc-400">
          위에서부터 차례로 따라가는 걸 추천합니다. 각 레슨은 5–10분, 진행도는 자동 저장.
        </p>
      </header>
      <LessonsLibrary lessons={allLessons} />
    </div>
  );
}
