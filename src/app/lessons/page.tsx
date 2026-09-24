import Link from "next/link";
import { allLessons } from "@/lib/lessons";
import { Icon, SheetBand, backLink } from "@/components/omr";
import LessonsLibrary from "./LessonsLibrary";

export const metadata = {
  title: "레슨 라이브러리",
  description:
    "Codex CLI 핵심 워크플로를 5–10분 단위 한국어 레슨으로 익혀요.",
};

export default function LessonsIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-20 pt-6 sm:px-6">
      <header className="flex flex-col gap-3">
        <Link href="/" className={backLink}>
          <Icon name="back" size={15} />홈
        </Link>
        <SheetBand left="1교시 · 기본기" right={`${allLessons.length}문항`} />
        <h1 className="font-serif text-[2.2rem] font-extrabold tracking-[-0.02em] text-marker sm:text-[2.7rem]">
          레슨 라이브러리
        </h1>
        <p className="text-[0.95rem] text-text-2">
          위에서부터 차례로 따라가는 걸 추천합니다. 각 레슨은 5–10분, 진행도는 자동 저장.
        </p>
      </header>
      <LessonsLibrary lessons={allLessons} />
    </div>
  );
}
