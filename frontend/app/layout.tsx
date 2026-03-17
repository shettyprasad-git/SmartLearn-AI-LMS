import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartLearn LMS | AI-Powered Learning",
  description: "Next-generation Learning Management System powered by YouTube and AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-background text-foreground antialiased overflow-x-hidden`}>
        <div className="flex h-screen w-full">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden relative">
            <Navbar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
