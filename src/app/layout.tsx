import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cskwork.github.io/learn-codex-kr/"),
  title: {
    default: "codex-tutorial · Codex CLI 한국어 훈련장",
    template: "%s · codex-tutorial",
  },
  description:
    "내 Mac을 AI 코딩 작업장으로 만드는 한국어 Codex CLI 인터랙티브 학습 사이트. 회원가입 없이 5분에 시작.",
  applicationName: "codex-tutorial",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "codex-tutorial · Codex CLI 한국어 훈련장",
    description:
      "좋은 지시, 작업 분해, 검증 루프를 짧은 실습과 챌린지로 익히는 한국어 Codex CLI 학습 제품.",
    url: "/",
    siteName: "codex-tutorial",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "codex-tutorial · Codex CLI 한국어 훈련장",
    description: "회원가입 없이 5분에 시작하는 한국어 Codex CLI 인터랙티브 학습.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050607",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#050607] text-zinc-100">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="mx-auto w-full max-w-6xl px-4 py-8 text-center text-[11px] text-zinc-600 sm:px-6">
          codex-tutorial · MIT · {" "}
          <a
            href="https://github.com/cskwork/learn-codex-kr"
            className="underline underline-offset-4 hover:text-zinc-300"
          >
            GitHub
          </a>
          {" "}· 회원가입 없이 학습 가능 · 모바일 친화
        </footer>
      </body>
    </html>
  );
}
