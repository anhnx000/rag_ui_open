import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github.css";
// 如果使用 App Router
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
      title: "Ngân hàng VietinBank Bot - Trợ lý AI thông minh",
    description: "Chatbot AI chuyên nghiệp cho ngân hàng, hỗ trợ tư vấn và giải đáp thông tin",
  icons: {
    icon: "/logo_vietinbank.png",
    shortcut: "/logo_vietinbank.png",
    apple: "/logo_vietinbank.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
