import type { Metadata, Viewport } from "next";
import { Nanum_Gothic_Coding, Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { SITE_URL } from "@/lib/paths";

const myeongjo = Nanum_Myeongjo({
  variable: "--font-myeongjo",
  weight: ["700", "800"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const notoKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const coding = Nanum_Gothic_Coding({
  variable: "--font-coding",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const OG_IMAGE = {
  url: `${SITE_URL}/og.jpg`,
  width: 1200,
  height: 630,
  alt: "분홍색으로 인쇄된 OMR 답안지 위에 몇 개의 답이 검은 사인펜으로 칠해져 있고, 사인펜 한 자루가 놓여 있다.",
};

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: "codex-tutorial · Codex CLI 한국어 훈련장",
    template: "%s · codex-tutorial",
  },
  description:
    "내 Mac을 AI 코딩 작업장으로 만드는 한국어 Codex CLI 인터랙티브 학습 사이트. 회원가입 없이 5분에 시작.",
  applicationName: "codex-tutorial",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "codex-tutorial · Codex CLI 한국어 훈련장",
    description:
      "좋은 지시, 작업 분해, 검증 루프를 짧은 실습과 챌린지로 익히는 한국어 Codex CLI 학습 제품.",
    url: "./",
    siteName: "codex-tutorial",
    locale: "ko_KR",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "codex-tutorial · Codex CLI 한국어 훈련장",
    description: "회원가입 없이 5분에 시작하는 한국어 Codex CLI 인터랙티브 학습.",
    images: [OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fdfdfb",
  colorScheme: "light",
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
      className={`${myeongjo.variable} ${notoKr.variable} ${coding.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-marker focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-paper"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <footer className="mt-16 border-t-[1.5px] border-ink bg-ink-tint">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-[0.8rem] text-ink-strong sm:px-6">
            <span className="font-serif font-extrabold">codex-tutorial</span>
            <span>
              MIT ·{" "}
              <a
                href="https://github.com/cskwork/learn-codex-kr"
                className="underline hover:text-marker"
              >
                GitHub
              </a>{" "}
              · 회원가입 없이 학습 가능 · 모바일 친화
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
