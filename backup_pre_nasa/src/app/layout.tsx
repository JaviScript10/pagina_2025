import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "./components/Header";
import ChatDock from "./components/ChatDock";
import CursorMount from "./components/CursorMount";
import { Inter } from "next/font/google";

// ✅ Fuente optimizada con next/font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Velocity Web - Soluciones Digitales",
  description:
    "Desarrollo web profesional en Chile: Landing pages, sitios corporativos, E-commerce y Apps. Entrega ágil, SEO y soporte.",
  metadataBase: new URL("https://pagina-2025.vercel.app"),
  alternates: { canonical: "https://pagina-2025.vercel.app" },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Velocity Web - Soluciones Digitales",
    description:
      "Desarrollo web profesional: landings, corporativos, tiendas y apps. Rápidos, bonitos y optimizados.",
    url: "https://pagina-2025.vercel.app",
    siteName: "Velocity Web",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Velocity Web — Desarrollo Web de Alta Velocidad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velocity Web - Soluciones Digitales",
    description:
      "Sitios rápidos y bonitos en Chile: landings, corporativos, e-commerce y apps.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* ⚡ Preload imágenes críticas (LCP) */}
        
        {/* ⚡ Preconnect a dominios externos */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>

      <body id="top" className={`${inter.className} antialiased`}>
        {/* Header global */}
        <Header />

        {/* Cursor visual controlado por el Client Component */}
        <div id="cursor" className="custom-cursor" aria-hidden="true" />
        <CursorMount />

        {/* Contenido principal */}
        {children}

        {/* Chat flotante global */}
        <ChatDock />
      </body>
    </html>
  );
}