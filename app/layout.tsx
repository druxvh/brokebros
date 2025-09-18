import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TanstackQueryProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "BrokeBros – Discover Movies & TV Shows for Broke People",
    template: "%s | BrokeBros",
  },
  description:
    "Explore trending movies and TV shows with detailed ratings, cast info, and more. Stay updated with BrokeBros – your go-to platform for film and TV discovery.",
  keywords: [
    "movies",
    "tv shows",
    "film discovery",
    "movie ratings",
    "streaming info",
    "top rated movies",
    "popular tv shows",
    "BrokeBros",
  ],
  authors: [{ name: "drx" }],
  creator: "drx",
  publisher: "BrokeBros",

  // openGraph: {
  //   type: "website",
  //   url: process.env.NEXT_PUBLIC_SITE_URL,
  //   title: "BrokeBros – Discover Movies & TV Shows for Broke People",
  //   description:
  //     "Discover trending and top-rated movies & TV shows with BrokeBros. Get ratings, details, and more in one place.",
  //   siteName: "BrokeBros",
  //   images: [
  //     {
  //       url: "/og-image.png", // place an OG image in public/
  //       width: 1200,
  //       height: 630,
  //       alt: "BrokeBros – Discover Movies & TV Shows for Broke People",
  //     },
  //   ],
  // },

  // icons: {
  //   icon: "/favicon.ico",
  //   apple: "/apple-touch-icon.png",
  // },

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
          <TanstackQueryProvider>
            {children}
          </TanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
