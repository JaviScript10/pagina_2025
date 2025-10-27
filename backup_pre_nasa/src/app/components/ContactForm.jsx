"use client";
import { motion } from "framer-motion";

export default function ContactForm() {
  return (
    <section id="contact" style={{ paddingTop: '8rem', paddingBottom: '8rem', background: 'linear-gradient(to bottom, rgb(6 182 212), rgb(14 165 233))' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.div animate={{ boxShadow: ['0 0 20px rgba(255, 255, 255, 0.4)', '0 0 35px rgba(255, 255, 255, 0.7)', '0 0 20px rgba(255, 255, 255, 0.4)'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '2rem', padding: '1.5rem 2.5rem', marginBottom: '1.5rem', border: '2px solid rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '1.25rem', color: 'white', fontWeight: '600', margin: 0 }}>Hablemos sobre tu idea y llevemos tu negocio al mundo digital</p>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <motion.div whileHover={{ y: -5 }} animate={{ boxShadow: ['0 0 20px rgba(251, 191, 36, 0.6)', '0 0 40px rgba(251, 191, 36, 0.9)', '0 0 20px rgba(251, 191, 36, 0.6)'] }} transition={{ boxShadow: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } }} style={{ textAlign: 'center', padding: '3rem 2.5rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(15px)', borderRadius: '1.5rem', border: '3px solid rgb(251 191 36)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📧</div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.6rem', fontWeight: '700', color: 'white' }}>Email</h3>
            <a href="mailto:contacto@velocityweb.cl" style={{ color: 'white', textDecoration: 'none', fontSize: '1.35rem', fontWeight: '600' }}>contacto@velocityweb.cl</a>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} animate={{ boxShadow: ['0 0 20px rgba(251, 191, 36, 0.6)', '0 0 40px rgba(251, 191, 36, 0.9)', '0 0 20px rgba(251, 191, 36, 0.6)'] }} transition={{ boxShadow: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } }} style={{ textAlign: 'center', padding: '3rem 2.5rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(15px)', borderRadius: '1.5rem', border: '3px solid rgb(251 191 36)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📱</div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.6rem', fontWeight: '700', color: 'white' }}>WhatsApp</h3>
            <a href="https://wa.me/56937204965" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '1.35rem', fontWeight: '600' }}>+56 9 3720 4965</a>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} animate={{ boxShadow: ['0 0 20px rgba(251, 191, 36, 0.6)', '0 0 40px rgba(251, 191, 36, 0.9)', '0 0 20px rgba(251, 191, 36, 0.6)'] }} transition={{ boxShadow: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } }} style={{ textAlign: 'center', padding: '3rem 2.5rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(15px)', borderRadius: '1.5rem', border: '3px solid rgb(251 191 36)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📍</div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.6rem', fontWeight: '700', color: 'white' }}>Ubicacion</h3>
            <p style={{ fontSize: '1.35rem', margin: 0, fontWeight: '600', color: 'white' }}>Valparaiso, Chile</p>
            <p style={{ fontSize: '1.05rem', marginTop: '0.5rem', color: 'rgba(255,255,255,0.9)' }}>Atencion en todo el pais</p>
          </motion.div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="https://wa.me/56937204965" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'white', color: 'rgb(6 182 212)', padding: '1.5rem 3.5rem', borderRadius: '9999px', fontWeight: '800', fontSize: '1.3rem', textDecoration: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)'; }}>Cotizar por WhatsApp 💬</a>
        </div>
      </div>
    </section>
  );
}
