"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrame;
    const PARTICLE_COUNT = 80; // ↑ antes 60

    // Tamaño canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Partículas
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3.6 + 1.2, // ↑ +40%
        speedX: (Math.random() - 0.5) * 0.55,
        speedY: (Math.random() - 0.5) * 0.55,
      });
    }

    // Cursor reactivo
    const mouse = { x: null, y: null };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const animate = () => {
      // Fondo “nebulosa”
      ctx.fillStyle = "rgba(2, 6, 23, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Velo de nebulosa extra
      const grd = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.4,
        60,
        canvas.width * 0.5,
        canvas.height * 0.6,
        Math.max(canvas.width, canvas.height) * 0.8
      );
      grd.addColorStop(0, "rgba(34,211,238,0.12)");
      grd.addColorStop(0.4, "rgba(6,182,212,0.08)");
      grd.addColorStop(1, "rgba(2,6,23,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Atracción suave hacia el cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            p.x -= dx / (dist || 1);
            p.y -= dy / (dist || 1);
          }
        }

        // Movimiento base
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.y < 0) p.y = canvas.height;
        if (p.x > canvas.width) p.x = 0;
        if (p.y > canvas.height) p.y = 0;

        // Partícula con glow ↑ +40%
        ctx.beginPath();
        ctx.fillStyle = "rgba(34, 211, 238, 0.9)";
        ctx.shadowBlur = 22; // ↑
        ctx.shadowColor = "rgba(34, 211, 238, 0.9)";
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section
      className="hero-ultra"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "radial-gradient(circle at center, #0a0f1f, #020617)",
      }}
    >
      {/* Fondo: Nebulosa + Partículas */}
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Glow central pulsante */}
      <div className="hero-glow" />

      {/* Contenido */}
      <div className="hero-content">
        {/* Cohete cartoon premium */}
        <RocketIcon />

        <h1 className="hero-title">
          Desarrollo Web de <span>Alta Velocidad</span>
        </h1>

        <p className="hero-sub">
          Soluciones digitales de próxima generación
        </p>

        <div className="hero-cta">
          <Link href="#cotizar" className="btn-holo">
            <span className="btn-ring" />
            <span className="btn-label">Cotizar Ahora</span>
          </Link>

          <Link href="#portfolio" className="btn-holo-ghost">
            <span className="btn-ring" />
            <span className="btn-label">Ver Portafolio</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          animation: fadeIn 1s ease forwards;
          transform: translateY(-24px); /* Título un poco más arriba */
        }

        .hero-title {
          font-size: clamp(2.2rem, 6.2vw, 4.3rem);
          font-weight: 900;
          text-shadow: 0 4px 25px rgba(0, 0, 0, 0.5);
          margin: 0.25rem 0 0.4rem;
          letter-spacing: 0.2px;
        }
        .hero-title span {
          color: #22d3ee;
          text-shadow: 0 0 28px rgba(34, 211, 238, 0.9);
        }

        /* Subtítulo cinematográfico */
        .hero-sub {
          margin-top: 6px;
          font-size: clamp(1.1rem, 2vw, 1.6rem);
          font-weight: 800;
          opacity: 0.92;
          letter-spacing: 0.6px;
          text-shadow: 0 0 18px rgba(34, 211, 238, 0.45);
          animation: floatText 3.2s ease-in-out infinite;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        /* Botón holográfico (Opción A) */
        .btn-holo,
        .btn-holo-ghost {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 999px;
          font-weight: 900;
          text-decoration: none;
          overflow: hidden;
          isolation: isolate;
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
        }

        .btn-holo {
          background: linear-gradient(135deg, rgba(6,182,212,0.4), rgba(14,165,233,0.6));
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow:
            0 12px 36px rgba(6, 182, 212, 0.45),
            inset 0 0 24px rgba(34, 211, 238, 0.35);
          backdrop-filter: blur(8px);
        }
        .btn-holo:hover {
          transform: translateY(-3px);
          filter: brightness(1.05) saturate(1.05);
          box-shadow:
            0 16px 44px rgba(6, 182, 212, 0.6),
            inset 0 0 28px rgba(34, 211, 238, 0.45);
        }

        .btn-holo-ghost {
          background: rgba(255, 255, 255, 0.09);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.35);
          backdrop-filter: blur(10px);
        }
        .btn-holo-ghost:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.16);
          box-shadow:
            0 14px 36px rgba(15, 23, 42, 0.45),
            inset 0 0 16px rgba(255, 255, 255, 0.18);
        }

        /* Aro de energía */
        .btn-ring {
          position: absolute;
          inset: -2px;
          border-radius: 999px;
          background:
            conic-gradient(
              from 0deg,
              rgba(34,211,238,0),
              rgba(34,211,238,0.75),
              rgba(14,165,233,0.85),
              rgba(34,211,238,0)
            );
          animation: spinRing 2.8s linear infinite;
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          padding: 2px;
          pointer-events: none;
          opacity: 0.8;
        }
        .btn-label {
          position: relative;
          z-index: 1;
          letter-spacing: 0.2px;
        }
        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }

        /* Glow central */
        .hero-glow {
          position: absolute;
          width: 720px; /* ↑ leve */
          height: 720px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(34, 211, 238, 0.18),
            rgba(6, 182, 212, 0) 70%
          );
          filter: blur(90px);
          z-index: 1;
          animation: pulseGlow 6s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.28); opacity: 0.85; }
          100% { transform: scale(1); opacity: 0.5; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatText {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

/* ==== Cohete cartoon premium (SVG con gradientes + estela animada) ==== */
function RocketIcon() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
      <svg
        width="86"
        height="86"
        viewBox="0 0 86 86"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 10px 30px rgba(34,211,238,0.45))" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#0ea5e9" />
          </linearGradient>
          <radialGradient id="flame" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fde047" />
            <stop offset="0.5" stopColor="#fb923c" />
            <stop offset="1" stopColor="#ef4444" />
          </radialGradient>
        </defs>

        {/* Estela */}
        <path
          d="M30 70 C 28 80, 58 80, 56 70"
          fill="none"
          stroke="url(#accent)"
          strokeWidth="6"
          strokeLinecap="round"
          style={{ opacity: 0.8 }}
        >
          <animate
            attributeName="stroke-opacity"
            values="0.4;1;0.4"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Llama */}
        <ellipse cx="43" cy="62" rx="9" ry="12" fill="url(#flame)">
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.08;1"
            dur="1.2s"
            repeatCount="indefinite"
            additive="sum"
          />
        </ellipse>

        {/* Cuerpo */}
        <g transform="translate(16, 6)">
          <path
            d="M27 0c10 10 16 26 16 40 0 7-1 12-3 16H14C12 52 11 47 11 40 11 26 17 10 27 0z"
            fill="url(#body)"
            stroke="rgba(2,6,23,0.15)"
            strokeWidth="2"
          />
          {/* Ventana */}
          <circle cx="27" cy="24" r="7.5" fill="url(#accent)" stroke="white" strokeWidth="2" />
          {/* Aletas */}
          <path d="M11 44c-5 2-8 8-8 12h12c0-4 0-8-4-12z" fill="url(#accent)" opacity="0.9" />
          <path d="M43 44c5 2 8 8 8 12H39c0-4 0-8 4-12z" fill="url(#accent)" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}
