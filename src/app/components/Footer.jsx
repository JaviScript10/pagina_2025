"use client";

export default function Footer() {
  // Scroll con offset del header
  const handleAnchor = (e) => {
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    const header = document.querySelector("header.hdr");
    const offset = header ? header.getBoundingClientRect().height : 72;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <footer className="footer-nasa">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Columna 1: Branding */}
          <div className="footer-col">
            <h3 className="footer-brand">⚡ Velocity Web</h3>
            <p className="footer-tagline">
              Soluciones digitales de próxima generación
            </p>
            <p className="footer-location">📍 Valparaíso, Chile</p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="footer-col">
            <h4 className="footer-title">Navegación</h4>
            <ul className="footer-links">
              <li><a href="#services" onClick={handleAnchor}>Servicios</a></li>
              <li><a href="#about" onClick={handleAnchor}>Quiénes somos</a></li>
              <li><a href="#gallery" onClick={handleAnchor}>Proyectos</a></li>
              <li><a href="#benefits" onClick={handleAnchor}>Beneficios</a></li>
              <li><a href="#testimonials" onClick={handleAnchor}>Clientes</a></li>
              <li><a href="#faq" onClick={handleAnchor}>FAQ</a></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="footer-col">
            <h4 className="footer-title">Contacto</h4>
            <ul className="footer-contact">
              <li>
                <a href="mailto:contacto@velocityweb.cl" className="contact-link">
                  📧 contacto@velocityweb.cl
                </a>
              </li>
              <li>
                <a href="tel:+56937204965" className="contact-link">
                  📱 +56 9 3720 4965
                </a>
              </li>
              <li>
                <a href="https://wa.me/56937204965" target="_blank" rel="noopener noreferrer" className="contact-link">
                  💬 WhatsApp directo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>© 2025 Velocity Web | Desarrollo Web Profesional</p>
          <p className="footer-made">Hecho con ⚡ en Chile</p>
        </div>
      </div>

      <style jsx>{`
        .footer-nasa {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          padding: 4rem 1.5rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .footer-nasa::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 60% 40% at 20% 0%, rgba(139, 92, 246, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(6, 182, 212, 0.15), transparent);
          pointer-events: none;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-col {
          text-align: left;
        }

        .footer-brand {
          font-size: 1.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.5rem;
        }

        .footer-tagline {
          color: #94a3b8;
          font-size: 0.95rem;
          margin: 0 0 1rem;
        }

        .footer-location {
          color: #cbd5e1;
          font-size: 0.9rem;
          margin: 0;
        }

        .footer-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f1f5f9;
          margin: 0 0 1rem;
        }

        .footer-links,
        .footer-contact {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li,
        .footer-contact li {
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s, transform 0.2s;
          display: inline-block;
          font-size: 0.95rem;
        }

        .footer-links a:hover {
          color: #a78bfa;
          transform: translateX(4px);
        }

        .contact-link {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s, transform 0.2s;
          display: inline-block;
          font-size: 0.95rem;
        }

        .contact-link:hover {
          color: #22d3ee;
          transform: translateX(4px);
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(139, 92, 246, 0.2);
          text-align: center;
        }

        .footer-bottom p {
          color: #94a3b8;
          font-size: 0.9rem;
          margin: 0.5rem 0;
        }

        .footer-made {
          color: #64748b;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .footer-nasa {
            padding: 3rem 1.5rem 1.5rem;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .footer-col {
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}