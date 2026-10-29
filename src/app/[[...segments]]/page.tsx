import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentView from "@/components/ContentView";
import { getPortfolio } from "@/lib/content";
import { resolveView } from "@/lib/navigation";

type Props = { params: Promise<{ segments?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const segments = (await params).segments || [];
  const data = getPortfolio();
  const view = resolveView(segments, data);
  if (!view) return { title: "Not found", robots: { index: false } };
  const canonical = data.settings.siteUrl
    ? new URL(`/${segments.join("/")}`, data.settings.siteUrl).href
    : undefined;
  return {
    title: view.title,
    description: view.description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: `${view.title} · ${data.profile.name}`,
      description: view.description,
      type: "website",
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: view.title,
      description: view.description,
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const segments = (await params).segments || [];
  const data = getPortfolio();
  if (!resolveView(segments, data)) notFound();
  return <ContentView data={data} segments={segments} />;
}
