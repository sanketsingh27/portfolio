import type { Metadata } from "next";
import PortfolioShell from "@/components/PortfolioShell";
import { getPortfolio } from "@/lib/content";
import "./globals.css";
import "./design-two.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    getPortfolio().settings.siteUrl ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
  title: {
    default: "Sanket Singh · Full-Stack Engineer",
    template: "%s · Sanket Singh",
  },
  description:
    "Backend systems, AI-powered products, and things worth shipping. Senior full-stack engineer, available to join immediately.",
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
        <PortfolioShell data={data}>{children}</PortfolioShell>
      </body>
    </html>
  );
}
