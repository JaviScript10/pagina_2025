import FadeIn from './components/FadeIn'
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
      <FadeIn delay={0.00}><Hero /></FadeIn>
      <FadeIn delay={0.05}><Services /></FadeIn>
      <FadeIn delay={0.10}><Benefits /></FadeIn>
      <FadeIn delay={0.15}><Gallery /></FadeIn>
      <FadeIn delay={0.20}><Testimonials /></FadeIn>
      <FadeIn delay={0.25}><FAQ /></FadeIn>
      <FadeIn delay={0.30}><WhatsAppForm /></FadeIn>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
