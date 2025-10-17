"use client";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Maria Gonzalez", company: "Restaurante Mar Adentro", text: "Increible trabajo. El sitio quedo hermoso y funcional. Las ventas online aumentaron 200% en el primer mes. Totalmente recomendados.", avatar: "M" },
  { name: "Carlos Muñoz", company: "Deportes Extremos", text: "Servicio profesional y rapido. Mi tienda online esta funcionando perfecto. El equipo siempre esta disponible para cualquier consulta.", avatar: "C" },
  { name: "Ana Perez", company: "Estudio Juridico", text: "Entendieron perfectamente lo que necesitaba. El resultado supero mis expectativas. Ahora recibo mas consultas por mi web que por telefono.", avatar: "A" }
];

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ paddingTop: '8rem', paddingBottom: '8rem', background: 'linear-gradient(to bottom right, rgb(15 23 42), rgb(30 41 59))' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.div animate={{ boxShadow: ['0 0 20px rgba(34, 211, 238, 0.5)', '0 0 40px rgba(34, 211, 238, 0.8)', '0 0 20px rgba(34, 211, 238, 0.5)'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'inline-block', background: 'linear-gradient(to right, rgba(34, 211, 238, 0.2), rgba(6, 182, 212, 0.2))', border: '2px solid rgb(34 211 238)', borderRadius: '9999px', padding: '1.5rem 3rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'white' }}>Clientes Satisfechos</h2>
          </motion.div>
          <br/>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '9999px', padding: '1rem 2rem' }}>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.9)' }}>Mas de 50 negocios confian en nosotros para su presencia digital</p>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ y: -5 }} style={{ background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.08), rgba(6, 182, 212, 0.08))', backdropFilter: 'blur(10px)', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '2px solid rgba(34, 211, 238, 0.25)', transition: 'all 0.3s' }}>
              <div style={{ color: 'rgb(251 191 36)', marginBottom: '1.5rem', fontSize: '1.3rem' }}>★★★★★</div>
              <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', lineHeight: '1.8', fontSize: '1.05rem' }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, rgb(34 211 238), rgb(6 182 212))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1.5rem' }}>{t.avatar}</div>
                <div>
                  <h4 style={{ color: 'white', marginBottom: '0.3rem', fontWeight: '700' }}>{t.name}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
