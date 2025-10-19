"use client";
import { useEffect, useRef } from "react";

export default function Demos() {
  const ref = useRef(null);

  // Animación simple al aparecer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("show");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const demos = [
    {
      title: "Landing Ultra",
      tag: "Landing Page",
      url: "#",
      desc: "Captura leads con velocidad, animaciones y alto puntaje en Core Web Vitals.",
    },
    {
      title: "Sitio Corporativo",
      tag: "Corporativo",
      url: "#",
      desc: "Imagen premium para tu marca: secciones, equipo, servicios y blog.",
    },
    {
      title: "E-commerce Turbo",
      tag: "Tienda Online",
      url: "#",
      desc: "Catálogo, checkout y performance para vender con estilo.",
    },
    {
      title: "App a Medida",
      tag: "Aplicación Web",
      url: "#",
      desc: "Paneles, auth, dashboards y flujos a tu medida.",
    },
    {
      title: "Portfolio Visual",
      tag: "Creativos",
      url: "#",
      desc: "Galerías fluidas, lazy-load y micro-interacciones.",
    },
    {
      title: "Micrositio Campaña",
      tag: "Marketing",
      url: "#",
      desc: "Páginas de campaña con A/B testing y tracking listo.",
    },
  ];

  return (
    <section id="gallery" className="demos-wrap" ref={ref} aria-labelledby="demos-title">
      <div className="demos-inner">
        <header className="demos-head">
          <h2 id="demos-title">Demos</h2>
          <p>Explora ejemplos reales de experiencias rápidas, modernas y listas para convertir.</p>
        </header>

        <div className="demos-grid" role="list">
          {demos.map((d, i) => (
            <article className="demo-card" role="listitem" key={i}>
              {/* “Mini pantalla” generada con CSS (sin imágenes) */}
              <div className="screen">
                <div className="chrome">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="thumb">
                  <div className="layer l1" />
                  <div className="layer l2" />
                  <div className="layer l3" />
                </div>
              </div>

              <div className="demo-body">
                <span className="demo-tag">{d.tag}</span>
                <h3 className="demo-title">{d.title}</h3>
                <p className="demo-desc">{d.desc}</p>

                <div className="demo-actions">
                  <a href={d.url} className="btn-demo" aria-label={`Abrir demo ${d.title}`}>
                    Ver demo
                  </a>
                  <a href="#cotizar" className="btn-wish" aria-label={`Cotizar demo ${d.title}`}>
                    Cotizar este estilo
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .demos-wrap {
          position: relative;
          padding: 4.5rem 1rem;
          background: #ffffff;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .5s ease, transform .5s ease;
        }
        .demos-wrap.show { opacity: 1; transform: translateY(0); }

        .demos-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .demos-head {
          text-align: center;
          margin-bottom: 2.2rem;
        }
        .demos-head h2 {
          font-size: clamp(2rem, 4.5vw, 3rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #0b1220;
          margin: 0 0 .4rem;
        }
        .demos-head p {
          color: #334155;
          font-weight: 600;
        }

        /* GRID: 3 columnas en desktop, 2 en tablet, 1 en móvil */
        .demos-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }
        @media (max-width: 1024px) {
          .demos-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 520px) {
          .demos-grid { grid-template-columns: 1fr; }
        }

        /* CARD con borde animado oscuro (halo) y hover premium */
        .demo-card {
          background: #0b1018;
          border-radius: 22px;
          border: 1px solid rgba(15, 23, 42, 0.25);
          position: relative;
          overflow: hidden;
          box-shadow:
            0 20px 50px rgba(2, 6, 23, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.03) inset;
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .demo-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 24px;
          background: conic-gradient(
            from 0deg,
            rgba(0,0,0,0) 0deg,
            rgba(15,23,42,0) 60deg,
            rgba(2,132,199,0.22) 140deg,
            rgba(34,211,238,0.25) 200deg,
            rgba(2,132,199,0.22) 260deg,
            rgba(0,0,0,0) 320deg
          );
          filter: blur(10px);
          z-index: 0;
          animation: ring 10s linear infinite;
          opacity: .7;
          pointer-events: none;
        }
        @keyframes ring {
          to { transform: rotate(360deg); }
        }
        .demo-card:hover {
          transform: translateY(-4px);
          border-color: rgba(34, 211, 238, 0.4);
          box-shadow:
            0 28px 70px rgba(2, 6, 23, 0.45),
            0 0 40px rgba(34, 211, 238, 0.15);
        }

        /* “Pantalla” */
        .screen {
          position: relative;
          aspect-ratio: 16 / 9;
          background: #020a12;
          overflow: hidden;
        }
        .chrome {
          position: absolute;
          top: 10px; left: 10px; right: 10px;
          height: 14px;
          border-radius: 8px;
          background: rgba(255,255,255,.06);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 8px;
          z-index: 2;
        }
        .chrome span {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,.3);
        }
        .thumb {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(800px 300px at 20% -10%, rgba(34,211,238,.17), rgba(0,0,0,0)),
            radial-gradient(900px 400px at 120% 120%, rgba(14,165,233,.2), rgba(0,0,0,0)),
            linear-gradient(180deg, #020a12, #03131a);
          overflow: hidden;
        }
        .layer { position: absolute; inset: 0; }
        .l1 {
          background:
            linear-gradient( 55deg, rgba(255,255,255,0.08) 1px, transparent 1px) 0 0 / 22px 22px,
            linear-gradient(-55deg, rgba(255,255,255,0.06) 1px, transparent 1px) 0 0 / 22px 22px;
          mix-blend-mode: overlay;
          opacity: .6;
        }
        .l2 {
          background: radial-gradient(closest-corner at 30% 50%, rgba(34,211,238,.22), transparent 60%);
          filter: blur(8px);
          transform: translateZ(0);
          animation: pan 8s ease-in-out infinite alternate;
        }
        .l3 {
          background: linear-gradient(90deg, transparent, rgba(163,230,255,.07), transparent);
          transform: translateX(-100%);
          animation: sweep 3.2s ease-in-out infinite;
        }
        @keyframes pan {
          from { transform: translate(0, -4%); }
          to { transform: translate(2%, 3%); }
        }
        @keyframes sweep {
          0%   { transform: translateX(-120%); }
          50%  { transform: translateX(50%); }
          100% { transform: translateX(120%); }
        }

        /* Body */
        .demo-body {
          padding: 16px 16px 18px;
          display: grid;
          gap: 8px;
          position: relative;
          z-index: 1;
        }
        .demo-tag {
          display: inline-block;
          color: #aeeaff;
          font-weight: 800;
          font-size: .85rem;
          letter-spacing: .3px;
          background: rgba(34,211,238,.12);
          border: 1px solid rgba(34,211,238,.35);
          padding: 4px 10px;
          border-radius: 999px;
        }
        .demo-title {
          margin: 6px 0 4px;
          color: #e9fdff;
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: .2px;
        }
        .demo-desc {
          margin: 0 0 10px;
          color: #cfe9f3;
          line-height: 1.6;
          font-weight: 600;
        }

        .demo-actions {
          display: flex; gap: 10px; flex-wrap: wrap;
        }
        .btn-demo {
          text-decoration: none;
          font-weight: 900;
          color: #04161c;
          background: linear-gradient(135deg, rgba(34,211,238,.95), rgba(14,165,233,.95));
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 9999px;
          padding: .7rem 1.05rem;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.45),
            0 12px 28px rgba(14,165,233,.3);
          transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
        }
        .btn-demo:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.6),
            0 18px 38px rgba(14,165,233,.4);
        }
        .btn-wish {
          text-decoration: none;
          font-weight: 900;
          color: #c9f3ff;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(163,230,255,.35);
          border-radius: 9999px;
          padding: .7rem 1.05rem;
          backdrop-filter: blur(6px);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }
        .btn-wish:hover {
          transform: translateY(-2px);
          border-color: rgba(163,230,255,.7);
          box-shadow: 0 12px 28px rgba(163,230,255,.18);
        }
      `}</style>
    </section>
  );
}
