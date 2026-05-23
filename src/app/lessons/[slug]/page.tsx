import { notFound } from "next/navigation";
import LessonSimulator from "@/components/LessonSimulator";
import { allLessons, getLesson, getLessonSlugs } from "@/lib/lessons";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getLessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return {};
  return {
    title: `${lesson.title} · codex-tutorial`,
    description: lesson.subtitle,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  // Ensure the imports are not dropped by tree-shaking when stats are needed downstream.
  void allLessons;
  return <LessonSimulator lesson={lesson} />;
}
