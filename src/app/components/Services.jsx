"use client";

const PALETTES = {
    landing: ["#22d3ee", "#06b6d4", "#0ea5e9"],
    corporativo: ["#a78bfa", "#8b5cf6", "#22d3ee"],
    ecommerce: ["#f59e0b", "#f97316", "#fb7185"],
    app: ["#34d399", "#10b981", "#22c55e"],
    soporte: ["#60a5fa", "#3b82f6", "#22d3ee"],
    seo: ["#f43f5e", "#ef4444", "#f59e0b"],
};

export default function Services() {
    const items = [
        {
            key: "landing",
            title: "Landing Page",
            price: "Desde: $150.000 a $280.000",
            desc: "Página enfocada en conversión para campañas o lanzamiento de marca.",
            features: [
                "1 sección larga (scroll) o 3–4 bloques",
                "Formulario de contacto + WhatsApp",
                "Diseño premium responsive",
                "Optimización básica SEO & velocidad",
            ],
        },
        {
            key: "corporativo",
            title: "Sitio Corporativo",
            price: "Desde: $350.000 a $650.000",
            desc:
                "Estructura clara para tu empresa: quiénes somos, servicios, equipo y contacto.",
            features: [
                "3–6 páginas internas",
                "Blog/Noticias (opcional)",
                "Integración mapas + RRSS",
                "SEO on-page + performance",
            ],
        },
        {
            key: "ecommerce",
            title: "Tienda Online",
            price: "Desde: $600.000 a $1.200.000",
            desc:
                "Vende online con catálogo, carro, pagos y despacho. Enfocado en conversión.",
            features: [
                "Catálogo y variantes",
                "Checkout + integración de pagos",
                "Despacho / retiro en tienda",
                "Cupones y analítica",
            ],
        },
        {
            key: "app",
            title: "Aplicación Web",
            price: "Desde: $900.000 a $2.000.000",
            desc:
                "Sistemas personalizados, paneles, integraciones API y automatizaciones.",
            features: [
                "Arquitectura a medida",
                "Panel administrador",
                "Integración con APIs/ERP",
                "Roadmap y escalabilidad",
            ],
        },
        {
            key: "soporte",
            title: "Soporte & Mantención",
            price: "Planes mensuales",
            desc:
                "Correcciones, mejoras continuas, seguridad, hosting y monitoreo.",
            features: [
                "Actualizaciones y fixes",
                "Backups y seguridad",
                "Pequeñas mejoras mensuales",
                "Soporte por WhatsApp",
            ],
        },
        {
            key: "seo",
            title: "SEO & Performance",
            price: "Pack por proyecto",
            desc:
                "Mejoramos velocidad y posicionamiento para atraer tráfico orgánico.",
            features: [
                "Core Web Vitals",
                "Auditoría técnica + fixes",
                "Contenido/Metas/Schema",
                "Analítica y reportes",
            ],
        },
    ];

    return (
        <section
            id="services"
            aria-labelledby="services-title"
            style={{ background: "#fff", paddingInline: "1rem" }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <header style={{ textAlign: "center", marginBottom: "2.2rem" }}>
                    <h2 id="services-title" style={{ fontWeight: 900 }}>
                        Servicios que entregan resultados
                    </h2>
                    <p style={{ color: "#52607a", maxWidth: 760, margin: "8px auto 0" }}>
                        Diseños modernos, rápidos y listos para convertir. Transparencia en{" "}
                        <strong>precios base</strong> y en lo que incluye cada paquete.
                    </p>
                </header>

                {/* GRID: Desktop 3; Tablet/Mobile 2; Phones ≤425px 1 */}
                <div className="services-grid">
                    {items.map((it) => (
                        <article key={it.key} className="service-card halo">
                            {/* Media generativo */}
                            <GenerativeMedia palette={PALETTES[it.key]} label={it.price} />

                            {/* Body */}
                            <div className="card-body">
                                <h3 className="card-title">{it.title}</h3>
                                <p className="card-desc">{it.desc}</p>
                                <ul className="card-list">
                                    {it.features.map((f, idx) => (
                                        <li key={idx} className="card-li">
                                            <span className="dot" aria-hidden="true" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Footer */}
                            <div className="card-footer">
                                <a href="#cotizar" className="btn-cta">
                                    Cotizar ahora
                                </a>
                                <a href="#projects" className="btn-ghost-dark">
                                    Ver ejemplos
                                </a>
                            </div>
                        </article>
                    ))}
                </div>

                <style jsx>{`
          /* ====== GRID ====== */
          .services-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          @media (max-width: 1024px) {
            .services-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
          @media (max-width: 425px) {
            .services-grid {
              grid-template-columns: 1fr;
            }
          }

          /* ====== CARD BASE ====== */
          .service-card {
            position: relative;
            border-radius: 20px;
            background: #ffffff;
            border: 1px solid rgba(2, 6, 23, 0.1);
            box-shadow:
              0 18px 50px rgba(15, 23, 42, 0.10),
              0 2px 10px rgba(15, 23, 42, 0.06);
            overflow: hidden;
            display: grid;
            grid-template-rows: auto 1fr auto;
            transition: transform 0.25s ease, box-shadow 0.25s ease, filter .25s ease;
          }

/* === CONTORNO NEGRO + HALO GIRATORIO === */
.service-card.halo {
  border: 2px solid rgba(0, 0, 0, 0.9); /* Borde base negro */
  position: relative;
}

.service-card.halo::before {
  content: "";
  position: absolute;
  inset: -3px; /* Halo ligeramente más grande que el borde */
  border-radius: 24px;
  padding: 3px;
  background: conic-gradient(
    from 0deg,
    rgba(0, 0, 0, 0.8),
    rgba(34, 211, 238, 0.9),
    rgba(0, 0, 0, 0.8),
    rgba(14, 165, 233, 0.9),
    rgba(0, 0, 0, 0.8)
  );
  animation: orbitHalo 6s linear infinite;
  filter: blur(1px);
  pointer-events: none;

  /* MÁSCARA PARA QUE SOLO SE VEA EL BORDE ANIMADO */
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
}

@keyframes orbitHalo {
  to {
    transform: rotate(360deg);
  }
}


          /* ====== BODY ====== */
          .card-body { padding: 16px 16px 10px; }
          .card-title {
            margin: 0;
            font-weight: 900;
            color: #0f172a;
            font-size: 1.25rem;
            letter-spacing: 0.2px;
            text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
          }
          .card-desc { color: #334155; margin: 8px 0 14px; }
          .card-list {
            list-style: none; padding: 0; margin: 0; display: grid; gap: 8px;
          }
          .card-li {
            display: flex; align-items: center; gap: 8px;
            color: #0f172a; font-weight: 600;
          }
          .dot {
            display: inline-block; width: 8px; height: 8px; border-radius: 50%;
            background: #0f172a;
            box-shadow: 0 0 10px rgba(15,23,42,.4);
          }

          /* ====== FOOTER & BUTTONS ====== */
          .card-footer {
            padding: 12px 16px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
          }
          .btn-cta {
            background: linear-gradient(135deg, #06b6d4, #0ea5e9);
            color: white;
            padding: 10px 16px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 900;
            border: 1px solid rgba(255, 255, 255, 0.35);
            box-shadow: 0 10px 26px rgba(6, 182, 212, 0.35);
            transition: transform 0.15s ease, filter 0.15s ease;
          }
          .btn-cta:hover {
            filter: brightness(1.06);
            transform: translateY(-1px);
          }
          .btn-ghost-dark {
            background: rgba(15, 23, 42, 0.92);
            color: #fff;
            padding: 10px 14px;
            border-radius: 999px;
            text-decoration: none;
            font-weight: 800;
            border: 1px solid rgba(255, 255, 255, 0.22);
            box-shadow: 0 6px 18px rgba(15, 23, 42, 0.25);
            transition: background 0.2s ease, transform 0.15s ease, box-shadow .2s ease;
          }
          .btn-ghost-dark:hover {
            background: rgba(15, 23, 42, 0.98);
            transform: translateY(-1px);
            box-shadow: 0 10px 26px rgba(15, 23, 42, 0.35);
          }

          /* ====== Animaciones media ====== */
          @keyframes float {
            0% { transform: translateY(0px) }
            50% { transform: translateY(-6px) }
            100% { transform: translateY(0px) }
          }
          @keyframes spinSlow {
            0% { transform: rotate(0deg) }
            100% { transform: rotate(360deg) }
          }
        `}</style>
            </div>
        </section>
    );
}

/** ========= Media generativo (sin imágenes) ========= */
function GenerativeMedia({ palette = ["#22d3ee", "#06b6d4", "#0ea5e9"], label }) {
    const [c1, c2, c3] = palette;
    return (
        <div
            style={{
                position: "relative",
                aspectRatio: "16 / 9",
                overflow: "hidden",
                background: `conic-gradient(from 180deg at 70% 30%, ${c1}, ${c2}, ${c3}, ${c1})`,
            }}
        >
            {/* Velo para contraste */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backdropFilter: "blur(2px)",
                    background:
                        "radial-gradient(800px 300px at 90% 0%, rgba(0,0,0,.08), rgba(0,0,0,0)), radial-gradient(800px 300px at 0% 100%, rgba(0,0,0,.06), rgba(0,0,0,0))",
                    opacity: 0.8,
                }}
            />

            {/* Rejilla SVG */}
            <svg
                viewBox="0 0 600 300"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                aria-hidden="true"
                style={{ position: "absolute", inset: 0, opacity: 0.25 }}
            >
                <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Orbes animados */}
            <Orb color={c1} size={120} left="10%" top="12%" delay="0s" />
            <Orb color={c2} size={90} left="78%" top="18%" delay=".2s" />
            <Orb color={c3} size={80} left="60%" top="65%" delay=".5s" />

            {/* Disco giratorio sutil */}
            <div
                style={{
                    position: "absolute",
                    right: "-60px",
                    bottom: "-60px",
                    width: 260,
                    height: 260,
                    borderRadius: "50%",
                    border: "2px dashed rgba(255,255,255,.6)",
                    opacity: 0.6,
                    animation: "spinSlow 18s linear infinite",
                }}
            />

            {/* Precio */}
            <div
                style={{
                    position: "absolute",
                    left: 12,
                    top: 12,
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(15, 23, 42, 0.92)",
                    color: "white",
                    fontWeight: 900,
                    fontSize: ".95rem",
                    boxShadow: "0 8px 20px rgba(0,0,0,.25)",
                    border: "1px solid rgba(255,255,255,.22)",
                }}
            >
                {label}
            </div>
        </div>
    );
}

function Orb({ color, size = 100, left = "50%", top = "50%", delay = "0s" }) {
    return (
        <div
            aria-hidden="true"
            style={{
                position: "absolute",
                left,
                top,
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), ${color})`,
                boxShadow: `0 0 40px ${color}AA, inset 0 0 30px rgba(255,255,255,.6)`,
                filter: "saturate(1.1)",
                transform: "translate(-50%, -50%)",
                animation: `float 6s ease-in-out infinite`,
                animationDelay: delay,
            }}
        />
    );
}
