import type { Metadata } from "next";
import Desktop from "@/components/Desktop";
import { getPortfolio } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    getPortfolio().settings.siteUrl ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
  title: { default: "Sanket’s desktop", template: "%s · Sanket’s desktop" },
  description: "A personal desktop. Work, writing, and room to explore.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = getPortfolio();
  return (
    <html lang="en">
      <body>
        <Desktop data={data}>{children}</Desktop>
      </body>
    </html>
  );
}
