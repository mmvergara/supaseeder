import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SupaSeeder",
  description:
    "Generate seed queries for your Supabase database using the power of AI.",
  authors: [
    {
      name: "mmvergara",
      url: "https://github.com/mmvergara/markvergara",
    },
  ],
  keywords: [
    "supabase",
    "seed data",
    "ai",
    "sql",
    "generator",
    "database",
    "development",
  ],
  openGraph: {
    title: "SupaSeeder - AI Seed Query Generator for Supabase",
    description:
      "Generate seed queries for your Supabase database using the power of AI.",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
