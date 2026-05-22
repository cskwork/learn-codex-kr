import { Suspense } from "react";
import CoopRoom from "./CoopRoom";

export const metadata = {
  title: "코업 모드 · learn-codex-kr",
  description: "친구 1명과 같은 Codex 챌린지를 함께 해결.",
};

export default function CoopPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-20 pt-8 sm:px-6">
      <Suspense fallback={<p className="text-sm text-zinc-500">로딩...</p>}>
        <CoopRoom />
      </Suspense>
    </div>
  );
}
