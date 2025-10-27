"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  const phoneNumber = "+56937204965";
  const message = "Hola! Me interesa solicitar información sobre sus servicios";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <motion.a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="whatsapp-button shine"
        aria-label="Abrir WhatsApp"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          borderRadius: isHovered ? "999px" : "50%",
          width: isHovered ? "auto" : "60px",
          height: "62px",
          minWidth: "62px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 28px rgba(37, 211, 102, 0.45)",
          cursor: "pointer",
          zIndex: 999,
          textDecoration: "none",
          border: "3px solid white",
          padding: isHovered ? "0 1.2rem" : "0",
          gap: "0.6rem",
          transition: "all 0.28s ease"
        }}
      >
        {/* Reflection layer */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: "linear-gradient(180deg, rgba(255,255,255,.28), rgba(255,255,255,0))",
            opacity: .25,
            pointerEvents: "none",
          }}
        />
        {/* Logo WhatsApp SVG */}
        <svg
          viewBox="0 0 24 24"
          className="whatsapp-icon"
          style={{
            width: "40px",
            height: "40px",
            minWidth: "38px",
            fill: "white",
            flexShrink: 0
          }}
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Texto "Chatea" */}
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.25 }}
            className="whatsapp-text"
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: "1rem",
              whiteSpace: "nowrap",
              letterSpacing: ".2px",
              textShadow: "0 1px 8px rgba(0,0,0,.35)"
            }}
          >
            Chatea
          </motion.span>
        )}
      </motion.a>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 10px 28px rgba(37, 211, 102, 0.45), 0 0 0 0 rgba(37, 211, 102, 0.5);
          }
          50% {
            box-shadow: 0 10px 28px rgba(37, 211, 102, 0.45), 0 0 0 16px rgba(37, 211, 102, 0);
          }
        }
        .whatsapp-button {
          animation: pulse 2.6s infinite;
        }

        /* Desktop */
        @media (min-width: 769px) {
          .whatsapp-icon {
            width: 38px !important;
            height: 38px !important;
          }
        }

        /* Tablets y móviles */
        @media (max-width: 768px) {
          .whatsapp-text { display: none !important; }
          .whatsapp-button {
            width: 56px !important;
            height: 56px !important;
            min-width: 56px !important;
            padding: 0 !important;
            border-radius: 50% !important;
          }
          .whatsapp-icon {
            width: 42px !important;
            height: 42px !important;
          }
        }

        @media (max-width: 425px) {
          .whatsapp-button {
            width: 54px !important;
            height: 54px !important;
            min-width: 54px !important;
            bottom: 1.2rem !important;
            right: 1.2rem !important;
          }
          .whatsapp-icon {
            width: 40px !important;
            height: 40px !important;
          }
        }

        @media (max-width: 375px) {
          .whatsapp-button {
            width: 52px !important;
            height: 52px !important;
            min-width: 52px !important;
            bottom: 1rem !important;
            right: 1rem !important;
          }
          .whatsapp-icon {
            width: 38px !important;
            height: 38px !important;
          }
        }

        @media (max-width: 320px) {
          .whatsapp-button {
            width: 50px !important;
            height: 50px !important;
            min-width: 50px !important;
          }
          .whatsapp-icon {
            width: 36px !important;
            height: 36px !important;
          }
        }
      `}</style>
    </>
  );
}
