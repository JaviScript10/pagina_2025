"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const projects = [
  { id: 1, title: "E-commerce Moda", category: "Tienda Online", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80", description: "Tienda online con pasarela de pagos integrada" },
  { id: 2, title: "Restaurante Gourmet", category: "Landing Page", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80", description: "Sitio web con reservas online y menú digital" },
  { id: 3, title: "App Fitness", category: "Aplicación Web", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80", description: "Plataforma de entrenamiento personalizado" },
  { id: 4, title: "Inmobiliaria Premium", category: "Sitio Corporativo", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80", description: "Portal de propiedades con búsqueda avanzada" },
  { id: 5, title: "Clínica Dental", category: "Sitio Corporativo", image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80", description: "Web profesional con sistema de citas" },
  { id: 6, title: "Tienda de Tecnología", category: "Tienda Online", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80", description: "E-commerce con carrito y gestión de inventario" },
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil dinámicamente
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categories = ["Todos", "Landing Page", "Sitio Corporativo", "Tienda Online", "Aplicación Web"];
  const filteredProjects = selectedCategory === "Todos"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const handleImgError = (e) => {
    if (!e.currentTarget.dataset.fallback) {
      e.currentTarget.dataset.fallback = "1";
      e.currentTarget.src = "/og.jpg"; // fallback local opcional
    }
  };

  // Bloquear scroll cuando modal está abierto (solo desktop)
  useEffect(() => {
    if (selectedProject && !isMobile) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev || ""; };
    }
  }, [selectedProject, isMobile]);

  const openProject = (p) => { if (!isMobile) setSelectedProject(p); };

  return (
    <section
      id="projects" /* <- ANCLA NUEVA */
      style={{
        paddingTop: "6rem",
        paddingBottom: "6rem",
        background: "linear-gradient(to bottom, rgb(15 23 42), rgb(30 41 59))",
        position: "relative",
        overflow: "hidden",
        scrollMarginTop: "84px",
      }}
      aria-label="Proyectos Destacados"
    >
      {/* Fondo animado suave */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          background:
            "radial-gradient(800px 400px at 20% 20%, rgba(34, 211, 238, 0.35), transparent 70%), radial-gradient(900px 500px at 80% 70%, rgba(14, 165, 233, 0.28), transparent 75%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
        >
          <h2
            style={{
              fontSize: "2.2rem",
              lineHeight: 1.15,
              fontWeight: 900,
              color: "#fff",
              margin: 0,
              textShadow: "0 6px 30px rgba(0,0,0,.25)",
            }}
          >
            Proyectos Destacados
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,.85)",
              maxWidth: 740,
              margin: "12px auto 0",
            }}
          >
            Ejemplos de sitios desarrollados con tecnología de punta
          </p>
        </motion.div>

        {/* Filtros */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "0.65rem 1.2rem",
                background:
                  selectedCategory === cat
                    ? "linear-gradient(135deg, rgb(34 211 238), rgb(6 182 212))"
                    : "rgba(255,255,255,0.1)",
                color: "white",
                border: selectedCategory === cat ? "none" : "1px solid rgba(255,255,255,0.2)",
                borderRadius: "9999px",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.25s",
                fontSize: "0.95rem",
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <div className="gallery-grid">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={!isMobile ? { y: -6, scale: 1.01 } : {}}
              onClick={() => openProject(project)}
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: isMobile ? "default" : "zoom-in",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 10px 30px rgba(2, 6, 23, 0.18)",
                transition: "all 0.25s",
              }}
            >
              {/* Thumb */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  overflow: "hidden",
                  position: "relative",
                  background: "linear-gradient(180deg, rgba(2,6,23,.6), rgba(2,6,23,.2))",
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={handleImgError}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scale(1.02)",
                    transition: "transform 0.35s ease",
                    display: "block",
                    backgroundColor: "#0b1324",
                  }}
                  onMouseEnter={(e) => !isMobile && (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => !isMobile && (e.currentTarget.style.transform = "scale(1.02)")}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "rgba(34, 211, 238, 0.95)",
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: "white",
                    boxShadow: "0 6px 20px rgba(34,211,238,.35)",
                  }}
                >
                  {project.category}
                </div>
              </div>

              {/* Meta */}
              <div style={{ padding: "12px 14px 16px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
                  {project.title}
                </h3>
                <p style={{ fontSize: ".95rem", color: "rgba(255,255,255,.78)", margin: 0, lineHeight: 1.55 }}>
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal (SOLO DESKTOP) */}
        {!isMobile && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="gallery-modal-overlay"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="gallery-modal"
            >
              <div className="gallery-modal-img-wrap">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  onError={handleImgError}
                  style={{ width: "100%", height: "100%", objectFit: "contain", background: "#0b1324", display: "block" }}
                />
              </div>

              <div className="gallery-modal-content">
                <div className="gallery-modal-category">{selectedProject.category}</div>
                <h3 className="gallery-modal-title">{selectedProject.title}</h3>
                <p className="gallery-modal-desc">{selectedProject.description}</p>
              </div>

              <button onClick={() => setSelectedProject(null)} className="gallery-modal-close" aria-label="Cerrar">
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }
        @media (max-width: 1100px) {
          .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .gallery-grid { grid-template-columns: 1fr; }
        }

        .gallery-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0, 0, 0, 0.88); backdrop-filter: blur(8px);
          z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .gallery-modal {
          width: min(580px, 90vw); max-height: min(680px, 85vh);
          background: #0b1324; border-radius: 18px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.15); box-shadow: 0 25px 90px rgba(0,0,0,.6);
          display: flex; flex-direction: column; position: relative;
        }
        .gallery-modal-img-wrap { position: relative; flex: 1; overflow: hidden; min-height: 320px; }
        .gallery-modal-content {
          padding: 18px 20px 20px; background: rgba(2,6,23,.95); border-top: 1px solid rgba(255,255,255,.1);
        }
        .gallery-modal-category { font-size: .85rem; color: rgb(34 211 238); font-weight: 800; margin-bottom: 8px; text-transform: uppercase; letter-spacing: .5px; }
        .gallery-modal-title { font-size: 1.3rem; font-weight: 900; color: #fff; margin: 0 0 10px; line-height: 1.3; }
        .gallery-modal-desc { font-size: 1rem; color: rgba(255,255,255,.88); margin: 0; line-height: 1.65; }
        .gallery-modal-close {
          position: absolute; top: 12px; right: 12px;
          background: rgba(0,0,0,.75); color: #fff; border: 1px solid rgba(255,255,255,.25);
          border-radius: 10px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 18px; font-weight: 800; transition: all .2s; z-index: 10;
        }
        .gallery-modal-close:hover { background: rgba(239,68,68,.9); border-color: rgba(255,255,255,.4); transform: rotate(90deg); }
      `}</style>
    </section>
  );
}
