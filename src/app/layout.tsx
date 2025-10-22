// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "./components/Header";
import CursorClient from "./components/CursorClient";
import ChatDock from "./components/ChatDock";

const isSpeed = process.env.NEXT_PUBLIC_OPT_SPEED === "1";

export const metadata: Metadata = {
  title: "Velocity Web - Soluciones Digitales",
  description:
    "Desarrollo web profesional en Chile: Landing pages, sitios corporativos, E-commerce y Apps. Entrega ágil, SEO y soporte.",
  metadataBase: new URL("https://pagina-2025.vercel.app"),
  alternates: { canonical: "https://pagina-2025.vercel.app" },
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/apple-touch-icon.png" },
  openGraph: {
    title: "Velocity Web - Soluciones Digitales",
    description:
      "Desarrollo web profesional: landings, corporativos, tiendas y apps. Rápidos, bonitos y optimizados.",
    url: "https://pagina-2025.vercel.app",
    siteName: "Velocity Web",
    locale: "es_CL",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Velocity Web — Desarrollo Web de Alta Velocidad" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velocity Web - Soluciones Digitales",
    description: "Sitios rápidos y bonitos en Chile: landings, corporativos, e-commerce y apps.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />

        {/* ==== PERF (opcional por flag) ==== */}
        {isSpeed && (
          <>
            {/* 1) Forzar DNS Prefetch global */}
            <meta httpEquiv="x-dns-prefetch-control" content="on" />
            <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
            <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

            {/* 2) Preconnect a Google Fonts (más rápido que @import) */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
              rel="stylesheet"
            />

            {/* 3) Preload del logo (muy visible) */}
            <link rel="preload" as="image" href="/brand/velocityweb-logo.png" />

            {/* 4) Opt-in a imagen responsive del OG si la reutilizas como hero en otras vistas */}
            {/* <link rel="preload" as="image" href="/og.jpg" /> */}
          </>
        )}
      </head>

      <body id="top" className="antialiased">
        <Header />

        {/* Cursor (elemento visual); su lógica va en el Client Component */}
        <div id="cursor" className="custom-cursor" aria-hidden="true" />
        <CursorClient />

        {children}

        {/* Chat flotante */}
        <ChatDock />
      </body>
    </html>
  );
}
