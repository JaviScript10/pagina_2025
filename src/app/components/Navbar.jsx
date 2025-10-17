"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: 'Servicios', id: 'services' },
    { name: 'Beneficios', id: 'benefits' },
    { name: 'Testimonios', id: 'testimonials' },
    { name: 'FAQ', id: 'faq' }
  ];

  return (
    <>
      <nav style={{
        width: '100%',
        padding: '0.8rem 1rem',
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(10px)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
        transition: 'all 0.3s',
        borderBottom: scrolled ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid transparent'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          {/* Logo con tono blanco y retroiluminación cyan eléctrico */}
          <motion.div
            animate={{
              textShadow: [
                '0 0 20px rgba(34, 211, 238, 0.7), 0 0 40px rgba(6, 182, 212, 0.5), 0 4px 20px rgba(34, 211, 238, 0.4)',
                '0 0 35px rgba(34, 211, 238, 1), 0 0 60px rgba(6, 182, 212, 0.7), 0 6px 30px rgba(34, 211, 238, 0.6)',
                '0 0 20px rgba(34, 211, 238, 0.7), 0 0 40px rgba(6, 182, 212, 0.5), 0 4px 20px rgba(34, 211, 238, 0.4)'
              ]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ marginLeft: 'clamp(0.5rem, 2vw, 2rem)' }}
          >
            <Link href="/" className="logo" style={{
              fontSize: '2.8rem',
              fontWeight: '900',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #f0f9ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              whiteSpace: 'nowrap',
              lineHeight: '1',
              flexShrink: 0,
              display: 'inline-block',
              position: 'relative',
              filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.7)) drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))'
            }}>
              Velocity<span style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #e0f2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '900'
              }}>Web</span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="desktop-menu" style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {menuItems.map((item, i) => (
              <motion.a
                key={i}
                href={"#" + item.id}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(103, 232, 249, 0.3)',
                    '0 0 20px rgba(103, 232, 249, 0.6)',
                    '0 0 10px rgba(103, 232, 249, 0.3)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2
                }}
                style={{
                  textDecoration: 'none',
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '1.05rem',
                  transition: 'all 0.3s',
                  background: 'rgba(103, 232, 249, 0.15)',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '9999px',
                  border: '2px solid rgba(103, 232, 249, 0.4)',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.name}
              </motion.a>
            ))}
            <a
              href="#cotizar"
              style={{
                background: 'linear-gradient(135deg, rgb(6 182 212), rgb(14 165 233))',
                color: 'white',
                padding: '0.8rem 2rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1.05rem',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
              }}
            >
              Cotizar Gratis
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-menu-btn"
            aria-label="Menu"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '0.3rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              zIndex: 1001,
              flexShrink: 0
            }}
          >
            <motion.div
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 6 : 0
              }}
              style={{
                width: '22px',
                height: '2.5px',
                background: 'white',
                borderRadius: '2px',
                transition: 'all 0.3s'
              }}
            ></motion.div>
            <motion.div
              animate={{ opacity: isOpen ? 0 : 1 }}
              style={{
                width: '22px',
                height: '2.5px',
                background: 'white',
                borderRadius: '2px',
                transition: 'all 0.3s'
              }}
            ></motion.div>
            <motion.div
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -6 : 0
              }}
              style={{
                width: '22px',
                height: '2.5px',
                background: 'white',
                borderRadius: '2px',
                transition: 'all 0.3s'
              }}
            ></motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 999,
                backdropFilter: 'blur(4px)'
              }}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                top: '60px',
                right: 0,
                width: '100%',
                maxWidth: '260px',
                height: 'calc(100vh - 60px)',
                background: 'rgba(15, 23, 42, 0.98)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
                zIndex: 1000,
                overflowY: 'auto'
              }}
            >
              {menuItems.map((item, i) => (
                <a
                  key={i}
                  href={"#" + item.id}
                  onClick={() => setIsOpen(false)}
                  style={{
                    textDecoration: 'none',
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '1rem',
                    padding: '0.9rem',
                    background: 'rgba(103, 232, 249, 0.15)',
                    borderRadius: '0.75rem',
                    border: '2px solid rgba(103, 232, 249, 0.4)',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#cotizar"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'linear-gradient(135deg, rgb(6 182 212), rgb(14 165 233))',
                  color: 'white',
                  padding: '0.9rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '1rem',
                  textAlign: 'center',
                  marginTop: '0.5rem'
                }}
              >
                Cotizar Gratis
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .logo { 
            font-size: 2.2rem !important;
            margin-left: 0.5rem !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 425px) {
          .logo { 
            font-size: 2rem !important;
          }
        }
        @media (max-width: 375px) {
          .logo { 
            font-size: 1.9rem !important;
            margin-left: 0.3rem !important;
          }
        }
        @media (max-width: 320px) {
          .logo { 
            font-size: 1.75rem !important;
            margin-left: 0.2rem !important;
          }
          nav { padding: 0.6rem 0.75rem !important; }
        }
      `}</style>
    </>
  );
}