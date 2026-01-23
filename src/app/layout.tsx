import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StatsProvider } from "@/components/stats-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IM King - 益智王",
  description: "彰師大資管系開發的益智問答遊戲",
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH}/manifest.json`,
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/icon.png`,
    apple: `${process.env.NEXT_PUBLIC_BASE_PATH}/icon.png`,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IM King",
  },
};
export const viewport = {
  themeColor: "#07c9cc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StatsProvider>
          <div id="root-container">
            {children}
          </div>
        </StatsProvider>
      </body>
    </html>
  );
}
