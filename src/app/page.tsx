"use client";

import dynamic from "next/dynamic";
import FadeIn from "./components/FadeIn";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Benefits from "./components/Benefits";
import Projects from "./components/Projects"; // ✅ reemplaza Gallery por Projects
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import WhatsAppForm from "./components/WhatsAppForm";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// Import dinámico del About (agarra el default sí o sí)
const AboutSection = dynamic(
  () => import("./components/AboutSection").then((m) => m.default || m),
  { ssr: true }
);

export default function Home() {
  return (
    <>
      {/* Hero arriba (el Header va en _app/layout o donde lo tengas) */}
      <FadeIn delay={0.00}>
        <Hero />
      </FadeIn>

      {/* 1) Servicios */}
      <FadeIn delay={0.05}>
        <Services />
      </FadeIn>

      {/* 2) Quiénes somos */}
      <FadeIn delay={0.10}>
        <AboutSection />
      </FadeIn>

      {/* 3) Proyectos */}
      <FadeIn delay={0.15}>
        <Projects />
      </FadeIn>

      {/* 4) Beneficios */}
      <FadeIn delay={0.20}>
        <Benefits />
      </FadeIn>

      {/* 5) Clientes */}
      <FadeIn delay={0.25}>
        <Testimonials />
      </FadeIn>

      {/* 6) FAQ */}
      <FadeIn delay={0.30}>
        <FAQ />
      </FadeIn>

      {/* 7) Cotizar / Contacto */}
      <FadeIn delay={0.35}>
        <WhatsAppForm />
      </FadeIn>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
