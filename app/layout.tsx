import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Partum Panel — Reklam Raporları",
  description: "Partum Ajans müşteri raporlama paneli",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
