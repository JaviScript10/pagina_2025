"use client";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
    const [open, setOpen] = useState(false);

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
                {/* Brand */}
                <a href="#top" aria-label="Inicio Velocity Web" onClick={scrollToTop} className="brand">
                    <Image
                        src="/brand/velocityweb-logo.png"
                        alt="Velocity Web"
                        width={210}
                        height={56}
                        priority
                        className="brand-img"
                    />
                    <span className="brand-name"></span>
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
                    onClick={() => setOpen((v) => !v)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            {/* Energy line ultra fina */}
            <div className="energy" aria-hidden="true" />

            {/* Overlay + Drawer */}
            <div className={`overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
            <aside className={`drawer ${open ? "open" : ""}`} aria-label="Menú móvil">
                <div className="drawer-head">
                    <Image
                        src="/brand/velocityweb-logo.png"
                        alt="Velocity Web"
                        width={160}
                        height={46}
                        className="brand-img"
                    />
                    <button className="close" aria-label="Cerrar menú" onClick={() => setOpen(false)}>✕</button>
                </div>
                <nav className="drawer-nav" aria-label="Primary mobile">
                    <MenuLinks />
                </nav>
            </aside>

            <style jsx>{`
        /* === Header SLIM (más delgado) === */
        .hdr {
          position: sticky;
          top: 0;
          z-index: 9999;
          background: rgba(12, 14, 18, 0.78);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(34, 211, 238, 0.16);
        }
        .row {
          max-width: 1240px;
          margin: 0 auto;
          padding: 6px 14px;           /* ⬅️ súper delgado */
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 62px;            /* control de altura total */
        }

        /* === Brand === */
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .brand-img {
          height: 56px;                /* ⬅️ un poco más grande */
          width: auto;
          filter: brightness(1.32) saturate(1.1)
                  drop-shadow(0 0 10px rgba(34,211,238,.38));
          mix-blend-mode: screen;
        }
        .brand-name {
          font-weight: 900;
          font-size: 1.35rem;
          letter-spacing: .15px;
          background: linear-gradient(180deg, #f8fdff 0%, #dff7ff 60%, #baf0ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: .95;                /* más claro para contraste */
        }

        /* === Desktop Nav: botones más grandes y claros === */
        .nav { display: flex; align-items: center; gap: .75rem; }
        .chip {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 900;
          font-size: 1.24rem;          /* ⬅️ más grande */
          letter-spacing: .12px;
          color: rgba(246, 252, 255, 0.98);  /* ⬅️ más blanco */
          padding: 0.72rem 1.25rem;    /* ⬅️ más alto/ancho */
          border-radius: 9999px;
          background: radial-gradient(120% 120% at 10% 10%, rgba(255,255,255,.12), rgba(255,255,255,.07));
          border: 1px solid rgba(34,211,238,.45);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.16),
            0 8px 20px rgba(0,0,0,.28);
          transition: transform .16s ease, box-shadow .16s ease, color .16s ease, border-color .16s ease;
        }
        .chip::after {
          content: "";
          position: absolute; left: 18px; right: 18px; bottom: 6px;
          height: 2px; width: 0%;
          background: #22d3ee;
          box-shadow: 0 0 12px #22d3ee;
          transition: width .22s ease;
          opacity: .98;
        }
        .chip:hover::after,
        .chip:focus-visible::after { width: calc(100% - 36px); }

        .chip:hover,
        .chip:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(34,211,238,.75);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.22),
            0 14px 34px rgba(34,211,238,.22),
            0 0 28px rgba(34,211,238,.22);
          color: #ffffff;
          outline: none;
        }

        .cta {
          background: linear-gradient(135deg, rgba(34,211,238,.34), rgba(14,165,233,.3));
          border: 1px solid rgba(34,211,238,.8);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.25),
            0 18px 38px rgba(14,165,233,.32),
            0 0 40px rgba(14,165,233,.36);
        }

        /* === Hamburger === */
        .hamb { display: none; width: 44px; height: 36px; border: 0; background: transparent; position: relative; cursor: pointer; }
        .hamb span {
          position: absolute; left: 8px; right: 8px; height: 3px;
          background: #f3fbff; border-radius: 4px; transition: transform .25s, opacity .25s;
        }
        .hamb span:nth-child(1){ top: 9px; }
        .hamb span:nth-child(2){ top: 16px; }
        .hamb span:nth-child(3){ top: 23px; }
        .hamb.is-open span:nth-child(1){ transform: translateY(7px) rotate(45deg); }
        .hamb.is-open span:nth-child(2){ opacity: 0; }
        .hamb.is-open span:nth-child(3){ transform: translateY(-7px) rotate(-45deg); }

        /* === Energy line ultra-fina === */
        .energy {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,211,238,.95), transparent);
          background-size: 220px 1px;
          animation: energyFlow 1.9s linear infinite;
        }
        @keyframes energyFlow {
          0% { background-position: -220px 0; }
          100% { background-position: 220px 0; }
        }

        /* === Overlay + Drawer === */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); backdrop-filter: blur(4px); opacity: 0; pointer-events: none; transition: opacity .25s; z-index: 9998; }
        .overlay.show { opacity: 1; pointer-events: auto; }

        .drawer {
          position: fixed; top: 0; right: 0; width: 82vw; max-width: 340px; height: 100vh;
          background: rgba(12,16,24,.98);
          border-left: 1px solid rgba(34,211,238,.2);
          transform: translateX(100%); transition: transform .3s ease; z-index: 9999;
          display: flex; flex-direction: column;
        }
        .drawer.open { transform: translateX(0%); }
        .drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 12px; border-bottom: 1px solid rgba(255,255,255,.08); }
        .drawer .brand-img { height: 46px; width: auto; filter: brightness(1.25) drop-shadow(0 0 10px rgba(34,211,238,.35)); mix-blend-mode: screen; }
        .drawer .close { border: none; background: rgba(255,255,255,.1); color: #fff; font-size: 1.2rem; border-radius: 10px; padding: 6px 10px; cursor: pointer; }
        .drawer-nav { display: grid; gap: 10px; padding: 12px; }
        .drawer-nav .chip { text-align: center; }

        /* === Breakpoints === */
        @media (max-width: 1120px) {
          .chip { font-size: 1.18rem; padding: 0.66rem 1.1rem; }
        }
        @media (max-width: 920px) {
          .nav { display: none; }
          .hamb { display: inline-block; }
          .brand-img { height: 54px; }
          .brand-name { display: none; } /* ahorramos ancho en móvil */
        }
        @media (max-width: 420px) {
          .brand-img { height: 48px; }
          .row { padding: 4px 10px; min-height: 58px; }
        }
      `}</style>
        </header>
    );
}
