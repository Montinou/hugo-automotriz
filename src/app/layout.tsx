import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asistencia Vehicular AI - Tu Copiloto en Bolivia",
  description: "Asistencia vehicular inmediata y gestión de talleres en Bolivia. Grúas, mecánicos y mantenimiento al alcance de tu mano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        <html lang="es">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
            <Toaster />
            <ServiceWorkerRegistration />
          </body>
        </html>
      </StackTheme>
    </StackProvider>
  );
}
