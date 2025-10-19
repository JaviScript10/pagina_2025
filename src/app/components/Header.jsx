"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Bloquear scroll del body cuando el drawer está abierto (móvil)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { 
      document.body.style.overflow = ""; 
    };
  }, [open]);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };
  const handleNavClick = () => setOpen(false);

  const MenuLinks = () => (
    <>
      <a className="chip" href="#services" onClick={handleNavClick}>Servicios</a>
      <a className="chip" href="#benefits" onClick={handleNavClick}>Beneficios</a>
      <a className="chip" href="#gallery" onClick={handleNavClick}>Galería</a>
      <a className="chip" href="#testimonials" onClick={handleNavClick}>Clientes</a>
      <a className="chip" href="#faq" onClick={handleNavClick}>FAQ</a>
      <a className="chip cta" href="#cotizar" onClick={handleNavClick}>Cotizar Ahora →</a>
    </>
  );

  return (
    <header className="hdr" role="banner">
      <div className="row">
        {/* Brand con contenedor fijo (evita que el PNG engorde el header) */}
        <a href="#top" aria-label="Inicio Velocity Web" onClick={scrollToTop} className="brand">
          <span className="brand-box">
            <Image
              src="/brand/velocityweb-logo.png"
              alt="Velocity Web"
              fill
              sizes="(max-width: 920px) 140px, 190px"
              priority
              className="brand-img"
            />
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="nav" aria-label="Primary">
          <MenuLinks />
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`hamb ${open ? "is-open" : ""}`}
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-hidden={open} 
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Energy line */}
      <div className="energy" aria-hidden="true" />

      {/* Overlay + Drawer */}
      <div className={`overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-label="Menú móvil">
        <div className="drawer-head">
          <Image
            src="/brand/velocityweb-logo.png"
            alt="Velocity Web"
            width={160}
            height={44}
            className="drawer-brand"
          />
          <button className="close" aria-label="Cerrar menú" onClick={() => setOpen(false)}>✕</button>
        </div>
        <nav className="drawer-nav" aria-label="Primary mobile">
          <MenuLinks />
        </nav>
      </aside>

      <style jsx>{`
        /* Header slim y consistente */
        .hdr {
          position: sticky;
          top: 0;
          z-index: 9999;
          background: rgba(11, 14, 20, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(34, 211, 238, 0.18);
        }

        /* Oculta el hamburger cuando el drawer está abierto para evitar “doble X” */
.hamb.is-open {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}

/* Por si algún z-index te lo deja por encima del drawer en ciertos móviles */
.hamb { z-index: 10000; }
.drawer { z-index: 10001; }  /* drawer arriba del hamburger */

        .row {
          max-width: 1240px;
          margin: 0 auto;
          padding: 8px 20px;          /* un poco más de respiro */
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 64px;           /* controla altura total */
        }

        /* Brand */
        .brand {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          transition: transform 0.25s ease;
        }
        .brand:hover { transform: scale(1.03); }

        /* Caja fija del logo: fill + object-fit: contain */
        .brand-box {
          position: relative;
          display: inline-block;
          height: 52px;               /* alto visual fijo del logo */
          width: 195px;               /* ancho visual del logo */
        }
        .brand-img {
          object-fit: contain;
          object-position: left center;
          filter: brightness(1.32) saturate(1.12)
                  drop-shadow(0 0 14px rgba(34,211,238,.48));
          mix-blend-mode: screen;
          transition: filter 0.25s ease;
        }
        .brand:hover .brand-img {
          filter: brightness(1.48) saturate(1.2)
                  drop-shadow(0 0 22px rgba(34,211,238,.75));
        }

        /* Desktop Nav: chips más blancos + subrayado animado */
        .nav { display: flex; align-items: center; gap: 0.75rem; }
        .chip {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 800;
          font-size: 1.08rem;
          letter-spacing: .08px;
          color: rgba(255, 255, 255, 0.96);
          padding: 0.68rem 1.18rem;
          border-radius: 9999px;
          background: radial-gradient(120% 120% at 10% 10%,
                      rgba(255,255,255,.13), rgba(255,255,255,.07));
          border: 1px solid rgba(34,211,238,.42);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.16),
            0 8px 20px rgba(0,0,0,.3);
          transition: transform .18s ease, box-shadow .18s ease,
                      color .18s ease, border-color .18s ease;
        }
        .chip::after {
          content: "";
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 7px;
          height: 2px;
          width: 0%;
          background: linear-gradient(90deg, #22d3ee, #06b6d4);
          box-shadow: 0 0 12px #22d3ee;
          transition: width .24s ease, opacity .24s ease;
          opacity: 0;
        }
        .chip:hover::after,
        .chip:focus-visible::after { width: calc(100% - 32px); opacity: 1; }
        .chip:hover,
        .chip:focus-visible {
          transform: translateY(-2px);
          border-color: rgba(34,211,238,.7);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.24),
            0 14px 34px rgba(34,211,238,.26),
            0 0 30px rgba(34,211,238,.28);
          color: #ffffff;
          outline: none;
        }

        /* CTA más contundente */
        .chip.cta {
          background: linear-gradient(135deg, rgba(34,211,238,.32), rgba(14,165,233,.28));
          border: 1px solid rgba(34,211,238,.75);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.28),
            0 16px 36px rgba(14,165,233,.3),
            0 0 38px rgba(14,165,233,.34);
        }
        .chip.cta:hover,
        .chip.cta:focus-visible {
          background: linear-gradient(135deg, rgba(34,211,238,.38), rgba(14,165,233,.34));
          border-color: rgba(34,211,238,.9);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.35),
            0 20px 46px rgba(14,165,233,.38),
            0 0 50px rgba(14,165,233,.44);
          transform: translateY(-3px);
        }

        /* Hamburger (solo móvil) */
        .hamb {
          display: none;
          width: 44px; height: 38px;
          border: none; background: transparent;
          position: relative; cursor: pointer;
          z-index: 10000;
          padding: 0;
        }
        .hamb span {
          position: absolute; left: 8px; right: 8px; height: 3px;
          background: #eaf8ff; border-radius: 4px;
          transition: transform .3s ease, opacity .3s ease;
        }
        .hamb span:nth-child(1) { top: 10px; }
        .hamb span:nth-child(2) { top: 17px; }
        .hamb span:nth-child(3) { top: 24px; }
        .hamb.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamb.is-open span:nth-child(2) { opacity: 0; }
        .hamb.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Energy line */
        .energy {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,211,238,.95), transparent);
          background-size: 220px 1px;
          animation: energyFlow 2s linear infinite;
        }
        @keyframes energyFlow {
          0% { background-position: -220px 0; }
          100% { background-position: 220px 0; }
        }

        /* Overlay + Drawer */
        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.6); 
          backdrop-filter: blur(6px);
          opacity: 0; pointer-events: none;
          transition: opacity .3s ease;
          z-index: 9998;
        }
        .overlay.show { opacity: 1; pointer-events: auto; }

        .drawer {
          position: fixed; top: 0; right: 0;
          width: 85vw; max-width: 340px;
          height: 100vh; height: 100dvh;
          background: rgba(12,16,24,.98);
          border-left: 1px solid rgba(34,211,238,.28);
          box-shadow: -12px 0 60px rgba(0,0,0,.75);
          transform: translateX(100%);
          transition: transform .35s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 9999;
          display: flex; flex-direction: column;
          overflow-y: auto;
        }
        .drawer.open { transform: translateX(0%); }

        .drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px;
          border-bottom: 1px solid rgba(255,255,255,.1);
          background: rgba(2,6,23,.88);
        }
        .drawer-brand {
          height: auto; width: auto;
          filter: brightness(1.32) saturate(1.12)
                  drop-shadow(0 0 12px rgba(34,211,238,.48));
          mix-blend-mode: screen;
        }
        .close {
          border: none; 
          background: rgba(255,255,255,.14);
          color: #fff; 
          font-size: 1.35rem; 
          border-radius: 10px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer; 
          line-height: 1;
          transition: all 0.25s ease;
        }
        .close:hover { 
          background: rgba(255,255,255,.24); 
          transform: rotate(90deg); 
        }

        .drawer-nav {
          display: flex; flex-direction: column;
          gap: 10px; padding: 18px;
        }
        .drawer-nav .chip {
          text-align: center; width: 100%;
          padding: 14px 18px; font-size: 1.08rem;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.14);
        }
        .drawer-nav .chip:hover {
          background: rgba(34,211,238,.16);
          border-color: rgba(34,211,238,.48);
          transform: translateX(-4px);
        }

        /* Accesibilidad: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .energy { animation: none !important; }
          .chip, .cta, .brand, .hamb span, .close { 
            transition: none !important; 
          }
        }

        /* Breakpoints */
        @media (max-width: 1120px) {
          .nav { gap: .65rem; }
          .chip { font-size: 1.02rem; padding: 0.62rem 1.05rem; }
        }
        @media (max-width: 920px) {
          .nav { display: none; }
          .hamb { display: inline-block; }
          .row { padding: 7px 16px; min-height: 58px; }
          .brand-box { height: 48px; width: 165px; }
        }
        @media (max-width: 480px) {
          .row { padding: 6px 14px; min-height: 54px; }
          .brand-box { height: 44px; width: 150px; }
          .drawer { width: 90vw; max-width: 300px; }
        }
      `}</style>
    </header>
  );
}