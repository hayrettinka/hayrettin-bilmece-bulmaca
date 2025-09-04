import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bilmece Bulmaca - Türkiye'yi Keşfet",
  description: "Türkiye'nin tarihi yerleri ve kültürel mekanları hakkında bilmeceler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
