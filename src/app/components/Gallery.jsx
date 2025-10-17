"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const projects = [
  {
    id: 1,
    title: "E-commerce Moda",
    category: "Tienda Online",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    description: "Tienda online con pasarela de pagos integrada"
  },
  {
    id: 2,
    title: "Restaurante Gourmet",
    category: "Landing Page",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    description: "Sitio web con reservas online y menú digital"
  },
  {
    id: 3,
    title: "App Fitness",
    category: "Aplicación Web",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    description: "Plataforma de entrenamiento personalizado"
  },
  {
    id: 4,
    title: "Inmobiliaria Premium",
    category: "Sitio Corporativo",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    description: "Portal de propiedades con búsqueda avanzada"
  },
  {
    id: 5,
    title: "Clínica Dental",
    category: "Sitio Corporativo",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
    description: "Web profesional con sistema de citas"
  },
  {
    id: 6,
    title: "Tienda de Tecnología",
    category: "Tienda Online",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
    description: "E-commerce con carrito y gestión de inventario"
  }
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ["Todos", "Landing Page", "Sitio Corporativo", "Tienda Online", "Aplicación Web"];

  const filteredProjects = selectedCategory === "Todos"
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="gallery" style={{
      paddingTop: '8rem',
      paddingBottom: '8rem',
      background: 'linear-gradient(to bottom, rgb(15 23 42), rgb(30 41 59))',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Fondo animado */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        background: 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.3), transparent 50%)'
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(34, 211, 238, 0.4)', '0 0 35px rgba(34, 211, 238, 0.7)', '0 0 20px rgba(34, 211, 238, 0.4)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              display: 'inline-block',
              background: 'rgba(34, 211, 238, 0.1)',
              border: '2px solid rgb(34 211 238)',
              borderRadius: '9999px',
              padding: '1.5rem 3rem',
              marginBottom: '2rem'
            }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'white' }}>
              Proyectos Destacados
            </h2>
          </motion.div>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: '700px', margin: '0 auto' }}>
            Ejemplos de sitios web desarrollados con tecnología de punta
          </p>
        </motion.div>

        {/* Filtros */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.75rem 1.5rem',
                background: selectedCategory === cat
                  ? 'linear-gradient(135deg, rgb(34 211 238), rgb(6 182 212))'
                  : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: selectedCategory === cat ? 'none' : '2px solid rgba(255,255,255,0.2)',
                borderRadius: '9999px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '0.95rem'
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Grid de proyectos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              onClick={() => setSelectedProject(project)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s'
              }}
            >
              {/* Imagen */}
              <div style={{
                height: '250px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(34, 211, 238, 0.9)',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  {project.category}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '0.75rem'
                }}>
                  {project.title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.6'
                }}>
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal (opcional) */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedProject(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.9)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '800px',
                background: 'rgb(30 41 59)',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                border: '2px solid rgb(34 211 238)'
              }}
            >
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
              <div style={{ padding: '2rem' }}>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'rgb(34 211 238)',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {selectedProject.category}
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>
                  {selectedProject.title}
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                  {selectedProject.description}
                </p>
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 2rem',
                    background: 'rgb(34 211 238)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '9999px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}