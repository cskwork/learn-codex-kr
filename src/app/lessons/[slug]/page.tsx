import { notFound } from "next/navigation";
import LessonSimulator from "@/components/LessonSimulator";
import { allLessons, getLesson, getLessonSlugs } from "@/lib/lessons";
import { lessonAfter } from "@/lib/streak";

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
    title: lesson.title,
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
  const nextSlug = lessonAfter(allLessons, slug);
  const next = nextSlug ? getLesson(nextSlug) : undefined;
  return (
    <LessonSimulator
      key={lesson.slug}
      lesson={lesson}
      nextLesson={next ? { slug: next.slug, title: next.title } : null}
    />
  );
}
