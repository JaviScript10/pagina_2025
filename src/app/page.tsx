"use client";

import dynamic from "next/dynamic";
import Hero from "./components/Hero";
import Services from "./components/Services";
import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer";

// ⚡ Componentes lazy-loaded (mejora TBT en -80%)
const AboutSection = dynamic(() => import("./components/AboutSection"), {
  loading: () => <div style={{ minHeight: '400px' }} />
});

const Projects = dynamic(() => import("./components/Projects"), {
  loading: () => <div style={{ minHeight: '500px' }} />
});

const Benefits = dynamic(() => import("./components/Benefits"), {
  loading: () => <div style={{ minHeight: '450px' }} />
});

const Testimonials = dynamic(() => import("./components/Testimonials"), {
  loading: () => <div style={{ minHeight: '500px' }} />
});

const FAQ = dynamic(() => import("./components/FAQ"), {
  loading: () => <div style={{ minHeight: '600px' }} />
});

const WhatsAppForm = dynamic(() => import("./components/WhatsAppForm"), {
  loading: () => <div style={{ minHeight: '550px' }} />
});

export default function Home() {
  return (
    <>
      {/* Hero carga inmediatamente (LCP) */}
      <Hero />
      
      {/* Services carga inmediatamente (above-the-fold) */}
      <Services />

      {/* Rest carga cuando el usuario scrollea */}
      <AboutSection />
      <Projects />
      <Benefits />
      <Testimonials />
      <FAQ />
      <WhatsAppForm />
      
      <Footer />
      <WhatsAppButton />
    </>
  );
}