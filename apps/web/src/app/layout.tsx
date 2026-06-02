import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prism — One content, infinite reach",
  description: "Schedule and analyze all your social media from one place",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
