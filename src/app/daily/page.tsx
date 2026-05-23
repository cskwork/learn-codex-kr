import DailyChallenge from "./DailyChallenge";

export const metadata = {
  title: "오늘의 챌린지 · codex-tutorial",
  description: "매일 새로 열리는 5분짜리 Codex 챌린지. 스트릭을 이어 가세요.",
};

export default function DailyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-20 pt-8 sm:px-6">
      <DailyChallenge />
    </div>
  );
}
