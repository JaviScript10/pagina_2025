"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const canvasRef = useRef(null);
  const rafId = useRef(0);
  const runningRef = useRef(false);
  const mouse = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  const [isCoarse, setIsCoarse] = useState(false);
  const [reduced, setReduced] = useState(false);

  // ====== ANIMACIÓN CANVAS ===================================================
  useEffect(() => {
    const mqCoarse = window.matchMedia?.("(pointer: coarse)");
    const mqReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    setIsCoarse(mqCoarse?.matches || false);
    setReduced(mqReduced?.matches || false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mqReduced?.matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    const lowEnd = cores <= 4 || mem <= 4 || dpr >= 3;
    const isMobileViewport = window.matchMedia("(max-width: 900px)").matches;

    const BLOBS = lowEnd || isMobileViewport ? 4 : 6;
    const PARTS = lowEnd || isMobileViewport ? 56 : 90;

    const resize = () => {
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      if (!w || !h) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    const blobs = Array.from({ length: BLOBS }, () => ({
      x: Math.random() * (canvas.width / dpr),
      y: Math.random() * (canvas.height / dpr),
      r: 170 + Math.random() * 200,
      ax: (Math.random() - 0.5) * 0.14,
      ay: (Math.random() - 0.5) * 0.14,
      hue: 180 + Math.random() * 140,
      alpha: 0.12 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
      speed: 0.002 + Math.random() * 0.003,
    }));

    const parts = Array.from({ length: PARTS }, () => ({
      x: Math.random() * (canvas.width / dpr),
      y: Math.random() * (canvas.height / dpr),
      v: 0.5 + Math.random() * 1.1,
      o: 0.1 + Math.random() * 0.3,
      len: 80 + Math.random() * 120,
    }));

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.current.vx = x - mouse.current.x;
      mouse.current.vy = y - mouse.current.y;
      mouse.current.x = x;
      mouse.current.y = y;
    };
    if (!mqCoarse?.matches) window.addEventListener("mousemove", onMove, { passive: true });

    const onVis = () => {
      runningRef.current = document.visibilityState === "visible";
      if (runningRef.current) loop(performance.now());
    };
    document.addEventListener("visibilitychange", onVis);

    const FRAME_MS = 1000 / 30;
    let last = 0;

    const loop = (t) => {
      if (!runningRef.current) return;
      if (t - last < FRAME_MS) {
        rafId.current = requestAnimationFrame(loop);
        return;
      }
      last = t;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      if (w === 0 || h === 0) {
        rafId.current = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(2,6,23,0.85)";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        b.phase += b.speed;
        b.x += Math.cos(b.phase + i) * b.ax + mouse.current.vx * 0.02;
        b.y += Math.sin(b.phase + i) * b.ay + mouse.current.vy * 0.02;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        const c1 = `hsla(${b.hue},85%,65%,${b.alpha})`;
        const c2 = `hsla(${(b.hue + 40) % 360},90%,55%,${b.alpha * 0.7})`;
        g.addColorStop(0, c1);
        g.addColorStop(1, c2);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      const repelBase = mqCoarse?.matches ? 0 : 0.006;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        ctx.save();
        ctx.strokeStyle = `rgba(163,230,255,${p.o})`;
        ctx.shadowColor = "rgba(56,189,248,0.6)";
        ctx.shadowBlur = 6;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.len, p.y + p.len);
        ctx.stroke();
        ctx.restore();

        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.hypot(dx, dy) || 1;
        const repel = Math.max(0, 140 - dist) * repelBase;

        p.x += p.v + (dx / dist) * repel;
        p.y += p.v + (dy / dist) * repel;

        if (p.x > w + 160 || p.y > h + 160) {
          p.x = -110 + Math.random() * 40;
          p.y = Math.random() * h * 0.7;
        }
      }

      rafId.current = requestAnimationFrame(loop);
    };

    runningRef.current = true;
    rafId.current = requestAnimationFrame(loop);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", onResize);
      if (!mqCoarse?.matches) window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // ====== PARALLAX DEL RAYO (solo desktop) ==================================
  const rayRef = useRef(null);
  useEffect(() => {
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
    if (coarse) return;
    const el = rayRef.current;
    if (!el) return;

    const onMouse = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.style.transform = `translateY(-6px) rotate(4deg) translate(${dx * 10}px, ${dy * 10}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translateY(-6px) rotate(4deg) translate(0, 0)";
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="hero-ultra">
      <canvas ref={canvasRef} className="hero-bg" aria-hidden="true" />

      <div className="hero-wrap">
        {/* RAYO ARRIBA DEL TÍTULO */}
        <div className="ray-top" aria-hidden="true" ref={rayRef}>
          <div className="ray-glow" />
          <Image
            src="/brand/rayo.png"
            alt=""
            fill
            sizes="(max-width: 520px) 130px, (max-width: 900px) 180px, 260px"
            className="ray-img"
            priority
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
              <Image src="/brand/rayo.png" alt="" width={22} height={22} priority />
            </span>
            Cotizar Proyecto
          </a>
          <a href="#projects" className="btn wire">★ Proyectos</a>
        </div>

        <ul className="badges">
          <li>Entrega 2–3 semanas</li>
          <li>SEO + Performance</li>
          <li>Hosting incluido</li>
          <li>Soporte humano</li>
        </ul>
      </div>

      <style jsx>{`
        .hero-ultra {
          position: relative;
          min-height: clamp(640px, 92vh, 980px);
          display: grid;
          place-items: center;
          text-align: center;
          overflow: hidden;
          isolation: isolate;
          padding: 5rem 1rem 4rem;
          background:
            radial-gradient(1200px 420px at 80% -10%, rgba(56,189,248,0.18), rgba(0,0,0,0)),
            linear-gradient(180deg, rgb(2 6 23), rgb(2 6 23));
        }
        .hero-bg {
          position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.9; z-index: 0;
        }
        .hero-wrap { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }
        .ray-top {
          position: relative; width: 260px; height: 220px; margin: 0 auto 8px;
          transform: translateY(-6px) rotate(4deg);
          filter: drop-shadow(0 16px 36px rgba(56,189,248,0.28));
          pointer-events: none;
        }
        .ray-img { object-fit: contain; }
        .ray-glow {
          position: absolute; inset: -18%; border-radius: 50%;
          background: radial-gradient(closest-side, rgba(163,230,255,0.35), rgba(163,230,255,0) 70%);
          filter: blur(8px); animation: rayPulse 3.6s ease-in-out infinite;
        }
        @keyframes rayPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.6;  transform: scale(1.06); }
        }
        .title { margin: 0 0 0.75rem; line-height: 1.1; letter-spacing: -0.02em; }
        .title-top {
          display: block; font-size: clamp(1.2rem, 2.2vw, 1.6rem);
          font-weight: 800; color: #c7faff; opacity: 0.85; text-shadow: 0 4px 16px rgba(0,0,0,0.45);
        }
        .title-strong {
          display: block; font-size: clamp(2rem, 6.2vw, 4rem); font-weight: 900;
          color: #eaffff; background: linear-gradient(90deg, #e5fdff, #b8f3ff 30%, #e5fdff);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 18px rgba(56,189,248,0.38));
        }
        .subtitle {
          margin: 0 auto 1.6rem; max-width: 820px;
          font-size: clamp(1.05rem, 2vw, 1.35rem); line-height: 1.8;
          color: #dff8ff; text-shadow: 0 2px 12px rgba(0,0,0,0.45); font-weight: 600;
        }
        .subtitle .float { display: inline-block; animation: float 5.5s ease-in-out infinite; }
        .subtitle .muted { opacity: 0.9; }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        .cta-row { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin: 1.2rem 0 2.2rem; }
        .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: .6rem;
          text-decoration: none; font-weight: 900; letter-spacing: 0.2px;
          padding: 0.95rem 1.6rem; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.2);
          color: #03141a; transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease, color .18s ease;
          cursor: pointer; user-select: none; will-change: transform, box-shadow;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-icon { display: inline-flex; align-items: center; justify-content: center; transform: translateY(-1px); filter: drop-shadow(0 0 8px rgba(56,189,248,0.35)); }
        .btn.holo {
          color: #061923;
          background: radial-gradient(120% 180% at 10% 20%, rgba(255,255,255,0.95), rgba(210,245,255,0.95)),
                      linear-gradient(90deg, rgba(34,211,238,0.25), rgba(14,165,233,0.25));
          border: 1px solid rgba(34,211,238,0.6);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55), 0 14px 40px rgba(14,165,233,0.35), 0 0 40px rgba(14,165,233,0.35);
        }
        .btn.holo:hover {
          background: radial-gradient(110% 180% at 10% 20%, rgba(255,255,255,1), rgba(225,250,255,1)),
                      linear-gradient(90deg, rgba(34,211,238,0.35), rgba(14,165,233,0.35));
          border-color: rgba(34,211,238,0.9);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.75), 0 20px 54px rgba(14,165,233,0.45), 0 0 62px rgba(14,165,233,0.5);
        }
        .btn.wire {
          color: #dffaff; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(163,230,255,0.45);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 10px 26px rgba(0,0,0,0.28);
          backdrop-filter: blur(6px);
        }
        .btn.wire:hover {
          color: #ffffff; background: rgba(163,230,255,0.14);
          border-color: rgba(163,230,255,0.75);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 16px 44px rgba(56,189,248,0.28), 0 0 44px rgba(56,189,248,0.32);
        }

        .badges {
          display: flex; gap: .6rem; flex-wrap: wrap;
          justify-content: center; list-style: none;
          padding: 0; margin: 0;
        }
        .badges li {
          color: #0a1c24;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.75);
          border-radius: 9999px;
          padding: 0.55rem 1rem;
          font-weight: 700;
          box-shadow: 0 8px 22px rgba(255,255,255,0.25);
        }

        @media (max-width: 1000px) {
          .ray-top { width: 220px; height: 190px; }
        }
        @media (max-width: 900px) {
          .hero-ultra { padding-top: 4.5rem; }
          .ray-top { width: 180px; height: 150px; margin-bottom: 6px; transform: translateY(-4px) rotate(4deg); }
          .title-strong { font-size: clamp(2rem, 8vw, 3rem); }
          .subtitle { font-size: 1.05rem; }
        }
        @media (max-width: 520px) {
          .hero-ultra { padding-top: 4rem; }
          .ray-top { width: 150px; height: 130px; margin-bottom: 4px; }
          .badges li { font-size: .95rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .subtitle .float, .ray-glow { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

