"use client";
import { motion } from "framer-motion";

const benefits = [
  { icon: "⚡", title: "Velocidad Garantizada", desc: "Sitios ultrarrápidos optimizados para cargar en menos de 2 segundos" },
  { icon: "💰", title: "Un Solo Pago", desc: "Sin mensualidades eternas. Pagas una vez y el sitio es tuyo" },
  { icon: "🎨", title: "Diseño Premium", desc: "Interfaces modernas que destacan tu marca y generan confianza" },
  { icon: "📱", title: "Mobile First", desc: "Optimizado para móviles, donde está el 70% de tus clientes" },
  { icon: "🌊", title: "Equipo Local", desc: "Base en Valparaíso con atención personalizada" },
  { icon: "🛠️", title: "Soporte Real", desc: "Contacto directo con desarrolladores" }
];

export default function Benefits() {
  return (
    <section id="benefits" style={{ paddingTop: '8rem', paddingBottom: '8rem', background: 'linear-gradient(to bottom right, rgb(15 23 42), rgb(30 41 59))' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.div animate={{ boxShadow: ['0 0 20px rgba(34, 211, 238, 0.5)', '0 0 40px rgba(34, 211, 238, 0.8)', '0 0 20px rgba(34, 211, 238, 0.5)'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'inline-block', background: 'linear-gradient(to right, rgba(34, 211, 238, 0.2), rgba(6, 182, 212, 0.2))', border: '2px solid rgb(34 211 238)', borderRadius: '9999px', padding: '1.5rem 3rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'white' }}>¿Por qué Velocity Web?</h2>
          </motion.div>
          <br />
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '9999px', padding: '1rem 2rem' }}>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)' }}>Más que una agencia web, somos tu partner digital estratégico</p>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {benefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }} style={{ textAlign: 'center', padding: '2.5rem 2rem', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.08), rgba(6, 182, 212, 0.08))', backdropFilter: 'blur(10px)', borderRadius: '1.5rem', border: '2px solid rgba(34, 211, 238, 0.25)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(6, 182, 212, 0.12))'; e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 211, 238, 0.08), rgba(6, 182, 212, 0.08))'; e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.25)'; }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 10px rgba(34, 211, 238, 0.5))' }}>{b.icon}</div>
              <h3 style={{ color: 'rgb(103 232 249)', marginBottom: '1rem', fontSize: '1.35rem', fontWeight: '700' }}>{b.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', fontSize: '1rem' }}>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
