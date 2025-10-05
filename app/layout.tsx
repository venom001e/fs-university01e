import "./globals.css";
import { NextAuthProvider } from "./providers";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "FS University",
  description: "Professional form builder for educational institutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <NextAuthProvider>{children}</NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
