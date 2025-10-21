"use client";
import Image from "next/image";

export default function AboutSection() {
    return (
        <section id="about" className="about-wrap">
            {/* Decor: aurora + stars */}
            <div className="bg-aurora" aria-hidden="true" />
            <div className="stars" aria-hidden="true" />

            <div className="about-container">
                {/* Intro */}
                <header className="about-head">
                    <span className="about-kicker">Quiénes somos</span>
                    <h2 className="about-title">
                        Diseñamos, desarrollamos y optimizamos{" "}
                        <span className="glow">sitios que convierten</span>
                    </h2>
                    <p className="about-sub">
                        Equipo ágil liderado por <strong>Javier</strong>. Combinamos diseño premium,
                        performance y SEO on-page para que tu web sea <em>rápida</em>, <em>clara</em> y <em>rentable</em>.
                    </p>
                    <div className="about-cta">
                        <a href="#projects" className="btn-primary">Proyectos</a>
                        <a href="#contact" className="btn-ghost">Hablemos</a>
                    </div>

                    {/* Mini stats */}
                    <ul className="stats">
                        <li><b>90+ </b><span>Lighthouse</span></li>
                        <li><b>8+ </b><span>años de experiencia</span></li>
                        <li><b>50+ </b><span>sitios lanzados</span></li>
                    </ul>
                </header>

                {/* Grid principal */}
                <div className="about-grid" style={{ perspective: 1200 }}>
                    {/* Founder card */}
                    <article className="card founder tilt" tabIndex={0}>
                        <div className="founder-media">
                            <div className="avatar">
                                <Image src="/founder.jpg" alt="Javier - Founder" fill className="avatar-img" />
                            </div>
                            <div className="badge">+8 años</div>
                        </div>
                        <div className="founder-body">
                            <h3 className="card-title">Javier — Founder & Lead</h3>
                            <p className="card-desc">
                                Full-stack con foco en UX, Core Web Vitals e integraciones. He trabajado con pymes y marcas en Chile y LATAM.
                            </p>
                            <ul className="bullets">
                                <li>⚡ Performance 90+ (Lighthouse)</li>
                                <li>🔒 Infra sin dolores: dominio, hosting, SSL</li>
                                <li>🧠 CRO y SEO on-page</li>
                            </ul>
                        </div>
                    </article>

                    {/* Cómo trabajamos */}
                    <article className="card values tilt" tabIndex={0}>
                        <h3 className="card-title">Cómo trabajamos</h3>
                        <ul className="pill-grid">
                            <li className="pill">Diseño premium</li>
                            <li className="pill">Responsive real</li>
                            <li className="pill">SEO on-page</li>
                            <li className="pill">Integraciones</li>
                            <li className="pill">Entrega rápida</li>
                            <li className="pill">Soporte cercano</li>
                        </ul>

                        <div className="timeline">
                            <div className="t-line" aria-hidden="true" />
                            {[
                                ["Kickoff & Brief", "Entendemos negocio, objetivos y propuesta de valor."],
                                ["UI + Contenido", "Wireframes, diseño y estructura SEO. Revisión ágil."],
                                ["Dev & Performance", "Implementación con métricas altas."],
                                ["Go-Live & Soporte", "Despliegue, analítica, ajustes y mantención."]
                            ].map(([title, desc], i) => (
                                <div className="t-item" key={i}>
                                    <span className="t-dot" />
                                    <div className="t-content">
                                        <h4>{title}</h4>
                                        <p>{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>

                {/* Equipo */}
                <div className="team">
                    <h3 className="card-title" style={{ marginBottom: 12 }}>Nuestro equipo</h3>
                    <p className="card-desc" style={{ marginBottom: 20 }}>
                        Núcleo compacto con especialistas a demanda (UX, SEO, contenido, data).
                    </p>

                    <div className="team-grid" style={{ perspective: 1200 }}>
                        {[
                            { img: "/team-ux.jpg", name: "Carla", role: "UX/UI" },
                            { img: "/team-seo.jpg", name: "Leo", role: "SEO & Contenido" },
                            { img: "/team-dev.jpg", name: "Maca", role: "Front-end" }
                        ].map((m, i) => (
                            <div className="member tilt" key={i} tabIndex={0}>
                                <div className="avatar small">
                                    <Image src={m.img} alt={m.role} fill className="avatar-img" />
                                </div>
                                <div className="m-body">
                                    <div className="m-name">{m.name}</div>
                                    <div className="m-role">{m.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Confianza / herramientas */}
                <div className="trust">
                    <span className="trust-kicker">Stack & herramientas</span>
                    <div className="logos">
                        {["Next.js", "React", "Tailwind", "Vercel", "Cloudflare", "Stripe"].map((t, i) => (
                            <span className="logo-chip" key={i}>{t}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Styles */}
            <style jsx>{`
        /* ====== Base ====== */
        .about-wrap {
          position: relative;
          isolation: isolate;
          background: radial-gradient(1200px 600px at 10% -10%, rgba(8,145,178,.25), transparent 60%),
                      radial-gradient(900px 480px at 90% 10%, rgba(139,92,246,.2), transparent 60%),
                      #0a0f1a;
          padding: 80px 16px;
          border-top: 1px solid rgba(255,255,255,.06);
          border-bottom: 1px solid rgba(255,255,255,.06);
          scroll-margin-top: 84px;
          overflow: hidden;
        }
        .about-container { max-width: 1100px; margin: 0 auto; color: #eaf6ff; }

        /* ====== Decor ====== */
        .bg-aurora {
          position: absolute; inset: -20% -10% auto -10%; height: 60%;
          background: conic-gradient(from 180deg at 50% 50%, rgba(34,211,238,.25), rgba(139,92,246,.22), rgba(34,211,238,.25));
          filter: blur(80px) saturate(1.2);
          animation: aurora 12s ease-in-out infinite alternate;
          z-index: -2;
        }
        .stars {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.8), transparent),
            radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,.7), transparent),
            radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,.6), transparent),
            radial-gradient(1px 1px at 60% 50%, rgba(255,255,255,.5), transparent);
          opacity: .35; z-index: -1;
          animation: twinkle 6s linear infinite;
        }
        @keyframes aurora { 0%{ transform: translateY(-2%) rotate(0deg); } 100%{ transform: translateY(2%) rotate(4deg); } }
        @keyframes twinkle { 0%,100%{opacity:.25;} 50%{opacity:.45;} }

        /* ====== Header ====== */
        .about-head { text-align: center; margin-bottom: 36px; }
        .about-kicker {
          display: inline-block; font-weight: 900; font-size: .9rem; letter-spacing: .12em; text-transform: uppercase;
          color: #06b6d4; background: rgba(6,182,212,.08); border: 1px solid rgba(6,182,212,.24);
          padding: 6px 10px; border-radius: 999px;
        }
        .about-title { font-size: clamp(1.6rem, 2.6vw, 2.6rem); margin: 14px 0 8px; font-weight: 900; line-height: 1.15; }
        .glow { background: linear-gradient(90deg,#eaf6ff, #8bd3ff, #bfa7ff); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 0 24px rgba(139,92,246,.25); }
        .about-sub { color: #b6d6e8; max-width: 760px; margin: 0 auto; }
        .about-cta { display: flex; gap: 12px; justify-content: center; margin-top: 18px; flex-wrap: wrap; }
        .btn-primary, .btn-ghost { font-weight: 900; padding: 10px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,.22); }
        .btn-primary { background: linear-gradient(135deg, #06b6d4, #8b5cf6); color: #fff; box-shadow: 0 12px 30px rgba(14,165,233,.22); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(14,165,233,.32); }
        .btn-ghost { background: rgba(255,255,255,.06); color: #eaf6ff; }
        .btn-ghost:hover { background: rgba(255,255,255,.1); }

        /* Stats */
        .stats { list-style: none; padding: 0; margin: 16px 0 0; display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .stats li {
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 12px; padding: 8px 12px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
        }
        .stats b { font-size: 1.05rem; margin-right: 6px; }
        .stats span { color: #b6d6e8; }

        /* ====== Grid ====== */
        .about-grid { display: grid; grid-template-columns: 1.08fr 1fr; gap: 18px; margin-top: 10px; }
        @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; } }

        .card {
          position: relative;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 18px;
          padding: 18px;
          transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s, border-color .35s;
          box-shadow: 0 10px 40px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.06);
        }
        .card::before {
          content: ""; position: absolute; inset: -1px; border-radius: 19px;
          background: linear-gradient(135deg, rgba(6,182,212,.4), rgba(139,92,246,.35));
          opacity: .0; filter: blur(10px); transition: opacity .35s;
          z-index: -1;
        }
        .card:hover::before, .card:focus-visible::before { opacity: .7; }
        .card:hover, .card:focus-visible {
          transform: translateY(-6px) rotateX(2deg) rotateY(-2deg);
          border-color: rgba(255,255,255,.16);
          box-shadow: 0 20px 70px rgba(14,165,233,.25), 0 0 60px rgba(139,92,246,.18), inset 0 1px 0 rgba(255,255,255,.12);
          outline: none;
        }
        .card-title { font-weight: 900; margin: 0 0 8px; }
        .card-desc { color: #c6d9e6; margin: 0 0 12px; }

        /* Founder */
        .founder { display: grid; grid-template-columns: 170px 1fr; gap: 16px; align-items: center; }
        @media (max-width: 560px) { .founder { grid-template-columns: 1fr; } }
        .founder-media { position: relative; }
        .avatar { position: relative; width: 170px; height: 170px; border-radius: 16px; overflow: hidden; }
        .avatar.small { width: 72px; height: 72px; border-radius: 12px; }
        .avatar-img { object-fit: cover; }
        .badge {
          position: absolute; bottom: -8px; left: 8px; background: #06101d;
          color: #22c55e; font-weight: 900; border: 1px solid rgba(34,197,94,.4); border-radius: 10px; padding: 6px 10px;
          box-shadow: 0 8px 20px rgba(34,197,94,.2);
        }
        .bullets { list-style: none; padding: 0; margin: 12px 0 0; color: #eaf6ff; display: grid; gap: 8px; }
        .bullets li { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 10px; padding: 10px 12px; }

        /* Valores + timeline */
        .pill-grid { list-style: none; padding: 0; margin: 0 0 16px; display: flex; flex-wrap: wrap; gap: 10px; }
        .pill {
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); color: #eaf6ff;
          padding: 9px 13px; border-radius: 999px; font-weight: 800; font-size: .92rem; transition: transform .2s, background .2s, border-color .2s;
        }
        .pill:hover { transform: translateY(-2px); background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); }

        .timeline { position: relative; display: grid; gap: 14px; padding-left: 6px; }
        .t-line { position: absolute; left: 9px; top: 4px; bottom: 4px; width: 2px;
                  background: linear-gradient(180deg, rgba(6,182,212,.3), rgba(139,92,246,.35));
                  box-shadow: 0 0 18px rgba(139,92,246,.35), 0 0 18px rgba(6,182,212,.25) inset;
                  animation: pulseLine 3.8s ease-in-out infinite; }
        @keyframes pulseLine { 0%,100%{opacity:.7;} 50%{opacity:1;} }
        .t-item { display: grid; grid-template-columns: 20px 1fr; gap: 12px; align-items: start; }
        .t-dot { width: 12px; height: 12px; margin-top: 4px; border-radius: 50%;
                 background: radial-gradient(circle at 40% 40%, #8b5cf6, #06b6d4);
                 box-shadow: 0 0 12px rgba(139,92,246,.6); }
        .t-content h4 { margin: 0 0 4px; }
        .t-content p { margin: 0; color: #bed8ea; }

        /* Equipo */
        .team { margin-top: 28px; }
        .team-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        @media (max-width: 900px) { .team-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .team-grid { grid-template-columns: 1fr; } }
        .member {
          display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: center;
          background: rgba(255,255,255,.035); border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px; padding: 10px; transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s, border-color .35s;
          box-shadow: 0 10px 30px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.06);
        }
        .member:hover, .member:focus-visible {
          transform: translateY(-4px) rotateX(1.5deg) rotateY(-1.5deg);
          border-color: rgba(255,255,255,.16);
          box-shadow: 0 16px 50px rgba(139,92,246,.25), inset 0 1px 0 rgba(255,255,255,.12);
          outline: none;
        }
        .m-name { font-weight: 900; }
        .m-role { color: #b6d6e8; font-size: .95rem; }

        /* Logos */
        .trust { margin-top: 36px; text-align: center; }
        .trust-kicker { color: #8bbcd7; font-weight: 800; }
        .logos { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 12px; }
        .logo-chip {
          color: #d9ecf7; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px; padding: 8px 12px; font-weight: 800; transition: transform .2s, background .2s, border-color .2s;
        }
        .logo-chip:hover { transform: translateY(-2px) scale(1.03); background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); }

        /* Accesibilidad: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .bg-aurora, .stars, .t-line, .card, .member, .btn-primary { animation: none !important; transition: none !important; }
        }
      `}</style>
        </section>
    );
}
