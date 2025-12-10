import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SpeechProvider } from "@/components/SpeechProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlexAI Coach",
  description: "AI-powered fitness & nutrition coach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-slate-950 text-white
          transition-colors duration-300
        `}
      >
        {/* GLOBAL THEME PROVIDER + GLOBAL SPEECH PROVIDER */}
        <ThemeProvider>
          <SpeechProvider>{children}</SpeechProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
