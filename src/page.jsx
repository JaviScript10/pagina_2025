import Hero from './components/Hero'
import Services from './components/Services'
import Benefits from './components/Benefits'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import WhatsAppForm from './components/WhatsAppForm'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

export default function Home() {
    return (
        <>
            {/* 🔴 CTA del Hero baja a #cotizar */}
            <Hero />

            <section id="services">
                <Services />
            </section>

            <section id="benefits">
                <Benefits />
            </section>

            <section id="gallery">
                <Gallery />
            </section>

            <section id="testimonials">
                <Testimonials />
            </section>

            <section id="faq">
                <FAQ />
            </section>

            {/* Destino del scroll */}
            <WhatsAppForm />

            <Footer />
            <WhatsAppButton />
        </>
    )
}
