"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { q: "¿Cuánto tiempo toma desarrollar mi sitio?", a: "El tiempo varía según la complejidad: landing pages 1-2 semanas, sitios corporativos 2-3 semanas, tiendas online 3-4 semanas. Te entregamos un cronograma detallado al iniciar tu proyecto." },
  { q: "¿El dominio y hosting están incluidos?", a: "Sí, incluimos dominio .cl por 1 año completo y hosting premium por 3 meses. Luego puedes renovar con nosotros o migrar a cualquier otro proveedor sin restricciones." },
  { q: "¿Puedo actualizar el contenido yo mismo?", a: "Absolutamente. Todos nuestros sitios incluyen un panel de administración intuitivo. Te capacitamos para que hagas cambios básicos sin conocimientos técnicos." },
  { q: "¿Ofrecen planes de mantenimiento?", a: "Sí. Tenemos planes desde 30.000/mes que incluyen actualizaciones, copias de seguridad y soporte prioritario. También ofrecemos soporte por hora sin plan." },
  { q: "¿Trabajan con clientes fuera de Valparaíso?", a: "Sí, atendemos todo Chile. Para Valparaíso ofrecemos reuniones presenciales, y para otras regiones trabajamos 100% online con videollamadas y correo electrónico." }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" style={{ paddingTop: "8rem", paddingBottom: "8rem", background: "#111827" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 25px rgba(6, 182, 212, 0.4)",
                "0 0 40px rgba(6, 182, 212, 0.7)",
                "0 0 25px rgba(6, 182, 212, 0.4)"
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "inline-block",
              background: "linear-gradient(to right, rgb(14 165 233), rgb(2 132 199))",
              borderRadius: "9999px",
              padding: "1.5rem 3rem",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ fontSize: "3rem", fontWeight: 900, color: "white" }}>Preguntas Frecuentes</h2>
          </motion.div>
          <p style={{ fontSize: "1.125rem", color: "rgb(203 213 225)", marginTop: "0.75rem" }}>
            Todo lo que necesitas saber antes de comenzar
          </p>
        </motion.div>

        <div>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "#1f2937", // un tono más claro que el fondo
                marginBottom: "1.5rem",
                borderRadius: "1rem",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgb(34 211 238)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(34, 211, 238, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "1.8rem",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "white",
                  transition: "color 0.3s",
                }}
              >
                <span>{faq.q}</span>
                <span
                  style={{
                    fontSize: "1.5rem",
                    color: "rgb(34 211 238)",
                    transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                >
                  +
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        padding: "0 1.8rem 1.8rem",
                        color: "rgb(203 213 225)",
                        lineHeight: 1.75,
                        fontSize: "1.05rem",
                      }}
                    >
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
