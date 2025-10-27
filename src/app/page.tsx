import dynamic from 'next/dynamic';
import Hero from './components/Hero';

const Services = dynamic(() => import('./components/Services'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});

const Benefits = dynamic(() => import('./components/Benefits'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});

const Gallery = dynamic(() => import('./components/Gallery'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});

const AboutSection = dynamic(() => import('./components/AboutSection'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});

const Testimonials = dynamic(() => import('./components/Testimonials'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});

const FAQ = dynamic(() => import('./components/FAQ'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});

const WhatsAppForm = dynamic(() => import('./components/WhatsAppForm'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});

const Footer = dynamic(() => import('./components/Footer'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
});

const WhatsAppButton = dynamic(() => import('./components/WhatsAppButton'), {
  loading: () => <div style={{ minHeight: '80px' }} />,
});

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <AboutSection />
      <Gallery />
      <Benefits />
      <Testimonials />
      <FAQ />
      <WhatsAppForm />
      <Footer />
      <WhatsAppButton />
    </>
  );
}