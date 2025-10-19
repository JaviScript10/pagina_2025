// src/app/components/WhatsAppForm.jsx
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { WA_PHONE } from "../config"; // ← ruta relativa desde /components

export default function WhatsAppForm() {
  const PHONE = WA_PHONE;

  // Campos
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState(""); // requerido (antes tenía default, ahora forzamos elección)
  const [negocio, setNegocio] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [detalle, setDetalle] = useState("");

  // Estados UI
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const [errors, setErrors] = useState({
    nombre: false,
    tipo: false,
    negocio: false,
    detalle: false,
  });

  // Mostrar toast (abajo izquierda)
  const showToast = (msg, type = "success", ms = 3000) => {
    setToast({ show: true, type, msg });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, ms);
  };

  // Al volver desde WhatsApp, mostrar "Enviado" si quedó marcado
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = localStorage.getItem("wa_last_submit");
    if (ok === "ok") {
      localStorage.removeItem("wa_last_submit");
      showToast("¡Enviado! Te contactaremos pronto ✅", "success", 3500);
    }
  }, []);

  // Link de WhatsApp
  const waLink = useMemo(() => {
    const lineas = [
      "Hola, quiero una cotización",
      nombre ? `• Nombre: ${nombre}` : null,
      tipo ? `• Proyecto: ${tipo}` : null,
      negocio ? `• Rubro/negocio: ${negocio}` : null,
      presupuesto ? `• Presupuesto: ${presupuesto}` : null,
      detalle ? `• Detalle: ${detalle}` : null,
    ].filter(Boolean);

    const text = lineas.join("\n");
    const params = new URLSearchParams({ text });
    return `https://wa.me/${PHONE}?${params.toString()}`;
  }, [PHONE, nombre, tipo, negocio, presupuesto, detalle]);

  // Helpers
  const isMobile = () => {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  };

  const validate = () => {
    const next = {
      nombre: !nombre.trim(),
      tipo: !tipo.trim(),
      negocio: !negocio.trim(),
      detalle: !detalle.trim(),
    };
    setErrors(next);
    const any = Object.values(next).some(Boolean);
    if (any) {
      showToast("Completa los campos marcados en rojo ✍️", "error", 3800);
    }
    return !any;
  };

  // Enviar
  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validación requerida
    if (!validate()) return;

    // Construir payload correo
    const payload = {
      subject: "Nueva cotización desde el formulario",
      name: nombre,
      email: "", // si más adelante agregas email/phone en el formulario, completa aquí
      phone: "",
      message: `Proyecto: ${tipo}\nRubro/negocio: ${negocio}\nPresupuesto: ${presupuesto || "A definir"}\nDetalle: ${detalle}`,
      meta: {
        source: "WhatsAppForm",
        url: typeof window !== "undefined" ? window.location.href : "",
      },
    };

    const mobile = isMobile();

    try {
      setLoading(true);

      // 1) Enviar correo (en móvil usar sendBeacon si existe para no bloquear la navegación)
      if (mobile && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon("/api/send", blob);
      } else {
        // PC o móvil sin sendBeacon → fetch normal (no bloqueante)
        fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }

      // 2) Abrir WhatsApp según dispositivo
      if (mobile) {
        // Evita la pestaña en blanco: navegar en la misma pestaña
        localStorage.setItem("wa_last_submit", "ok");
        window.location.href = waLink;
      } else {
        // PC: pestaña nueva
        window.open(waLink, "_blank", "noopener,noreferrer");
        // Mostrar OK aquí mismo
        showToast("¡Enviado! Te contactaremos pronto ✅", "success", 3500);
      }
    } catch {
      // Si hubo falla de red en PC, informar (en móvil probablemente ya se fue a WhatsApp)
      if (!mobile) {
        showToast("No pudimos enviar el correo, pero WhatsApp se abrió igual 🙌", "error", 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==== Fondo animado Matrix Neón ==== (igual al tuyo, con mejoras de rendimiento)
  const canvasRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const { clientWidth, clientHeight } = canvas.parentElement;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      canvas.style.width = clientWidth + "px";
      canvas.style.height = clientHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * (canvas.width / dpr),
      y: Math.random() * (canvas.height / dpr),
      s: 1 + Math.random() * 2.5,
      o: 0.45 + Math.random() * 0.4,
      glow: Math.random() * 6 + 6,
    }));

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(2, 6, 23, 0.6)";
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p) => {
        ctx.save();
        ctx.shadowColor = `rgba(0,255,240,${p.o})`;
        ctx.shadowBlur = p.glow;
        ctx.strokeStyle = `rgba(0,255,240,${p.o})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 140, p.y + 140);
        ctx.stroke();
        ctx.restore();

        p.y += p.s * 1.5;
        p.x += p.s * 1.2;

        if (p.y > h + 120) {
          p.y = -80;
          p.x = Math.random() * w;
        }
        if (p.x > w + 120) {
          p.x = -80;
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Handlers para limpiar error de cada campo al escribir
  const onNombre = (v) => {
    setNombre(v);
    if (errors.nombre && v.trim()) setErrors((e) => ({ ...e, nombre: false }));
  };
  const onTipo = (v) => {
    setTipo(v);
    if (errors.tipo && v.trim()) setErrors((e) => ({ ...e, tipo: false }));
  };
  const onNegocio = (v) => {
    setNegocio(v);
    if (errors.negocio && v.trim()) setErrors((e) => ({ ...e, negocio: false }));
  };
  const onDetalle = (v) => {
    setDetalle(v);
    if (errors.detalle && v.trim()) setErrors((e) => ({ ...e, detalle: false }));
  };

  return (
    <section id="cotizar" className="wa-section" aria-labelledby="cotizar-title">
      {/* Fondo animado */}
      <div className="wa-bg" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>

      {/* Contenido */}
      <div className="wa-container">
        <h2 id="cotizar-title" className="wa-title">Cotiza tu proyecto</h2>
        <p className="wa-sub">Responde rápido estas preguntas y te contactamos por WhatsApp.</p>

        <form onSubmit={onSubmit} className="wa-form" noValidate>
          <div className="wa-grid">
            {/* Nombre */}
            <div className="wa-field">
              <label htmlFor="nombre">Tu nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Andrea"
                value={nombre}
                onChange={(e) => onNombre(e.target.value)}
                className={errors.nombre ? "error" : ""}
                aria-invalid={errors.nombre}
                aria-describedby={errors.nombre ? "err-nombre" : undefined}
              />
              {errors.nombre && (
                <span id="err-nombre" className="field-error">Campo obligatorio</span>
              )}
            </div>

            {/* Tipo de proyecto */}
            <div className="wa-field">
              <label htmlFor="tipo">Tipo de proyecto</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => onTipo(e.target.value)}
                className={errors.tipo ? "error" : ""}
                aria-invalid={errors.tipo}
                aria-describedby={errors.tipo ? "err-tipo" : undefined}
              >
                <option value="">Selecciona una opción…</option>
                <option>Landing Page</option>
                <option>Sitio Corporativo</option>
                <option>Tienda Online (E-commerce)</option>
                <option>App / Proyecto a medida</option>
                <option>Otro</option>
              </select>
              {errors.tipo && (
                <span id="err-tipo" className="field-error">Campo obligatorio</span>
              )}
            </div>

            {/* Rubro / negocio */}
            <div className="wa-field">
              <label htmlFor="negocio">Rubro o negocio</label>
              <input
                id="negocio"
                type="text"
                placeholder="Ej: Restaurante, tienda, etc…"
                value={negocio}
                onChange={(e) => onNegocio(e.target.value)}
                className={errors.negocio ? "error" : ""}
                aria-invalid={errors.negocio}
                aria-describedby={errors.negocio ? "err-negocio" : undefined}
              />
              {errors.negocio && (
                <span id="err-negocio" className="field-error">Campo obligatorio</span>
              )}
            </div>

            {/* Presupuesto (opcional) */}
            <div className="wa-field">
              <label htmlFor="presupuesto">Presupuesto (opcional)</label>
              <select
                id="presupuesto"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
              >
                <option value="">A definir</option>
                <option>Hasta $300.000</option>
                <option>$300.000 – $700.000</option>
                <option>$700.000 – $1.500.000</option>
                <option>$1.500.000+</option>
              </select>
            </div>
          </div>

          {/* Detalle */}
          <div className="wa-field">
            <label htmlFor="detalle">Detalle</label>
            <textarea
              id="detalle"
              rows={4}
              placeholder="Cuéntanos qué necesitas (páginas, referencias, plazos)…"
              value={detalle}
              onChange={(e) => onDetalle(e.target.value)}
              className={errors.detalle ? "error" : ""}
              aria-invalid={errors.detalle}
              aria-describedby={errors.detalle ? "err-detalle" : undefined}
            />
            {errors.detalle && (
              <span id="err-detalle" className="field-error">Campo obligatorio</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary wa-btn"
            style={{
              padding: "1.2rem 2rem",
              fontSize: "1.1rem",
              fontWeight: 700,
              minHeight: 55,
              cursor: "pointer",
            }}
            aria-label="Enviar por WhatsApp"
            disabled={loading}
          >
            {loading ? "Enviando…" : "Enviar por WhatsApp"}
          </button>
        </form>
      </div>

      {/* TOAST (abajo izquierda) */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 9999,
        }}
      >
        {toast.show && (
          <div
            style={{
              background:
                toast.type === "success"
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "white",
              padding: "12px 16px",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              minWidth: "280px",
              fontWeight: 800,
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            role="status"
          >
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "white",
                opacity: 0.9,
              }}
            />
            <span>{toast.msg}</span>
          </div>
        )}
      </div>

      {/* Estilos del borde rojo animado y accesibilidad */}
      <style jsx global>{`
        @keyframes neonPulseRed {
          0%, 100% { box-shadow: 0 0 0px rgba(239, 68, 68, 0.0); }
          50%      { box-shadow: 0 0 18px rgba(239, 68, 68, 0.55); }
        }
        .wa-field .error {
          border-color: #ef4444 !important;
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.22) !important;
          animation: neonPulseRed 1.6s ease-in-out infinite;
        }
        .field-error {
          display: inline-block;
          margin-top: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #fecaca; /* rojo claro para contraste */
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.45);
        }
      `}</style>
    </section>
  );
}
