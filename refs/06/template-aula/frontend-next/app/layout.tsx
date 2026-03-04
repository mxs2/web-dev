import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Dashboard de Cache e Performance",
  description:
    "Comparação entre backend lento e backend com cache (Redis + cron job).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
