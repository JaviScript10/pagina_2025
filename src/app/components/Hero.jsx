"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero-ultra">
      {/* ✅ Gradiente CSS puro - 0 JavaScript, 0 Canvas */}
      <div className="hero-bg-gradient" aria-hidden="true" />

      <div className="hero-wrap">
        <div className="ray-top" aria-hidden="true">
          <div className="ray-glow" />
          <Image
            src="/brand/rayo.png"
            alt=""
            width={260}
            height={220}
            sizes="(max-width: 520px) 130px, (max-width: 900px) 180px, 260px"
            className="ray-img"
            priority
            fetchPriority="high"
            quality={90}
            loading="eager"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        <h1 className="title">
          <span className="title-top">Desarrollo Web de</span>
          <span className="title-strong">Alta Velocidad</span>
        </h1>

        <p className="subtitle">
          <span className="float">Soluciones digitales de próxima generación.</span>
          <span className="muted"> Sitios modernos, apps a medida y e-commerce listos para vender.</span>
        </p>

        <div className="cta-row">
          <a href="#cotizar" className="btn holo">
            <span className="btn-icon">
              <Image src="/brand/rayo.png" alt="" width={22} height={22} priority quality={90} loading="eager" />
            </span>
            Cotizar Proyecto
          </a>
          <a href="#gallery" className="btn wire">★ Proyectos</a>
        </div>

        <ul className="badges">
          <li>Entrega 2–3 semanas</li>
          <li>SEO + Performance</li>
          <li>Diseño a medida</li>
        </ul>
      </div>

      <style jsx>{`
        .hero-ultra {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #020617;
        }

        /* ✅ GRADIENTE CSS ANIMADO - REEMPLAZA CANVAS */
        .hero-bg-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
            radial-gradient(ellipse 60% 50% at 80% 50%, rgba(139, 92, 246, 0.15), transparent),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(6, 182, 212, 0.15), transparent),
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(168, 85, 247, 0.2), transparent),
            linear-gradient(180deg, #020617 0%, #0f172a 100%);
          animation: gradientShift 20s ease infinite;
          will-change: transform;
        }

        @keyframes gradientShift {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          33% { 
            transform: scale(1.1) rotate(2deg);
            opacity: 0.9;
          }
          66% { 
            transform: scale(1.05) rotate(-2deg);
            opacity: 0.95;
          }
        }

        .hero-wrap {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 0 1.5rem;
          max-width: 960px;
          width: 100%;
        }

        .ray-top {
          position: relative;
          width: 260px;
          height: 220px;
          margin: 0 auto 2rem;
          animation: rayFloat 6s ease-in-out infinite;
        }

        @keyframes rayFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }

        .ray-glow {
          position: absolute;
          inset: -40%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%);
          filter: blur(40px);
          animation: glowPulse 3s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .ray-img {
          position: relative;
          filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.8));
        }

        .title {
          margin: 0 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .title-top {
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 400;
          color: #cbd5e1;
          letter-spacing: 0.05em;
        }

        .title-strong {
          font-size: clamp(2.5rem, 7vw, 5rem);
          font-weight: 900;
          background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .subtitle {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          line-height: 1.6;
          color: #94a3b8;
          margin: 0 auto 2.5rem;
          max-width: 600px;
        }

        .float {
          color: #e2e8f0;
          font-weight: 600;
        }

        .cta-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .btn.holo {
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          color: white;
          box-shadow: 0 10px 40px rgba(139, 92, 246, 0.3);
        }

        .btn.holo:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 50px rgba(139, 92, 246, 0.4);
        }

        .btn.wire {
          background: transparent;
          color: #e2e8f0;
          border: 2px solid rgba(139, 92, 246, 0.5);
        }

        .btn.wire:hover {
          border-color: rgba(139, 92, 246, 0.8);
          background: rgba(139, 92, 246, 0.1);
        }

        .btn-icon {
          display: flex;
          width: 22px;
          height: 22px;
        }

        .badges {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .badges li {
          padding: 0.5rem 1rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .ray-top {
            width: 180px;
            height: 150px;
          }
        }

        /* ✅ Reduce motion para accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          .hero-bg-gradient,
          .ray-top,
          .ray-glow,
          .btn {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
