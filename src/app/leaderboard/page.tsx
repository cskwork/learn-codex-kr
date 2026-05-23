import Leaderboard from "./Leaderboard";

export const metadata = {
  title: "주간 리더보드 · codex-tutorial",
  description: "이번 주 가장 빠른 학습자들.",
};

export default function LeaderboardPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-20 pt-8 sm:px-6">
      <Leaderboard />
    </div>
  );
}
