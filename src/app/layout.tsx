import type { Metadata } from "next";
import { Open_Sans, Syne } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pagezz AI | Paginas de venda com IA",
  description:
    "Gere paginas de venda estrategicas para produtores digitais brasileiros com inteligencia artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`h-full ${openSans.variable} ${syne.variable}`}>
      <body className="min-h-full flex flex-col antialiased">
        <div className="flex flex-col flex-1">{children}</div>
      </body>
    </html>
  );
}
