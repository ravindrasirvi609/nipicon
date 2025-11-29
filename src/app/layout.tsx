import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/nav";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import LoadingExample from "@/components/Loader";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <Suspense
          fallback={
            <div>
              <LoadingExample />
            </div>
          }
        >
          <Navbar />
          <div className="mt-[4rem] bg-light">
            {children}
            <Analytics />
          </div>
        </Suspense>
      </body>
    </html>
  );
}
