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
  title: "learn-codex-kr · Codex CLI 한국어 인터랙티브 학습",
  description:
    "OpenAI Codex CLI를 한국어로 인터랙티브하게 배우는 멀티플레이어 학습 사이트. 회원가입 없이 5분에 시작.",
  openGraph: {
    title: "learn-codex-kr · Codex CLI 한국어 인터랙티브 학습",
    description:
      "OpenAI Codex CLI를 한국어로 인터랙티브하게 배우는 멀티플레이어 학습 사이트.",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
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
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="mx-auto w-full max-w-3xl px-4 py-6 text-center text-[11px] text-zinc-600 sm:px-6">
          MIT · {" "}
          <a
            href="https://github.com/cskwork/learn-codex-kr"
            className="underline hover:text-zinc-400"
          >
            GitHub
          </a>
          {" "}· 회원가입 없이 학습 가능 · 모바일 친화
        </footer>
      </body>
    </html>
  );
}
