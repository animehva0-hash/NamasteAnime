import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Namaste Anime - Stream Anime Online",
  description: "Watch anime online for free. Browse thousands of anime with subtitles and dub.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f0f23",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-text-primary antialiased overflow-x-hidden">
        <div className="flex min-h-dvh w-full">
          <Sidebar />
          <div className="flex-1 lg:ml-[260px] flex flex-col min-h-dvh w-full min-w-0">
            <Navbar />
            <main className="flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 w-full max-w-[1600px] mx-auto min-w-0">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
