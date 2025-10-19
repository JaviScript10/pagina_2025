// src/app/components/WhatsAppForm.jsx
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { WA_PHONE } from "../config";

export default function WhatsAppForm() {
  const PHONE = WA_PHONE;

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [negocio, setNegocio] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [detalle, setDetalle] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const [errors, setErrors] = useState({
    nombre: false,
    tipo: false,
    negocio: false,
    detalle: false,
  });

  const showToast = (msg, type = "success", ms = 3000) => {
    setToast({ show: true, type, msg });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, ms);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = sessionStorage.getItem("wa_last_submit");
    if (ok === "ok") {
      sessionStorage.removeItem("wa_last_submit");
      showToast("¡Cotización enviada! Te contactaremos pronto 🚀", "success", 5000);
    }
  }, []);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) return;

    const payload = {
      subject: "Nueva cotización desde el formulario",
      name: nombre,
      email: "",
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

      if (mobile && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon("/api/send", blob);
      } else {
        fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }

      if (mobile) {
        showToast("Abriendo WhatsApp… 📱", "success", 1500);
        sessionStorage.setItem("wa_last_submit", "ok");
        setTimeout(() => {
          window.location.href = waLink;
        }, 300);
      } else {
        window.open(waLink, "_blank", "noopener,noreferrer");
        showToast("¡Cotización enviada! Te contactaremos pronto 🚀", "success", 4000);
      }
    } catch {
      if (!mobile) {
        showToast("No pudimos enviar el correo, pero WhatsApp se abrió 🙌", "error", 4000);
      }
    } finally {
      setLoading(false);
    }
  };

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
      <div className="wa-bg" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>

      <div className="wa-container">
        <h2 id="cotizar-title" className="wa-title">Cotiza tu proyecto</h2>
        <p className="wa-sub">Responde rápido estas preguntas y te contactamos por WhatsApp.</p>

        <form onSubmit={onSubmit} className="wa-form" noValidate>
          <div className="wa-grid">
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

      {/* TOAST ARREGLADO - Ahora SÍ se ve encima */}
      <div
        className="toast-wrapper"
        aria-live="polite"
        aria-atomic="true"
      >
        {toast.show && (
          <div
            className={`toast toast-${toast.type}`}
            role="status"
          >
            <span className="toast-dot" />
            <span className="toast-msg">{toast.msg}</span>
          </div>
        )}
      </div>

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
          position: absolute;
          left: 8px;
          bottom: -20px;
          z-index: 10;
          display: inline-block;
          padding: 2px 8px;
          background: rgba(239, 68, 68, 0.95);
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .wa-bg { z-index: 0; pointer-events: none; }
        .wa-container { position: relative; z-index: 1; }
        .wa-form { position: relative; z-index: 2; overflow: visible; }
        .wa-field { position: relative; margin-bottom: 30px; }

        /* ===== TOAST ARREGLADO ===== */
        .toast-wrapper {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999999 !important;
          pointer-events: none;
          width: 100%;
          max-width: 500px;
          padding: 0 16px;
        }

        .toast {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          padding: 16px 20px;
          border-radius: 16px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          font-size: 1rem;
          animation: toastSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: auto;
        }

        .toast-error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .toast-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          opacity: 0.95;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
          animation: toastPulse 1.5s ease-in-out infinite;
        }

        .toast-msg {
          flex: 1;
        }

        @keyframes toastSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes toastPulse {
          0%, 100% { opacity: 0.95; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .toast-wrapper {
            bottom: 90px;
            max-width: calc(100% - 32px);
          }
          
          .toast {
            padding: 14px 18px;
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .toast-wrapper {
            bottom: 80px;
          }
          
          .toast {
            padding: 12px 16px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}