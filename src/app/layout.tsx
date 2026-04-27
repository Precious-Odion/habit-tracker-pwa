import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegister from "../components/shared/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "A mobile-first habit tracker PWA",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
