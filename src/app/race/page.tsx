import { Suspense } from "react";
import RaceMode from "./RaceMode";

export const metadata = {
  title: "레이스 모드",
  description: "공개 로비에서 가장 빠른 프롬프트로 챌린지 정답까지.",
};

export default function RacePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-20 pt-8 sm:px-6">
      <Suspense fallback={<p className="text-sm text-text-2">로딩...</p>}>
        <RaceMode />
      </Suspense>
    </div>
  );
}
