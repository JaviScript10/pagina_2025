"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { WA_PHONE } from "../config"; // ruta relativa desde /components

export default function WhatsAppForm() {
  const PHONE = WA_PHONE;

  // Campos
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Landing Page");
  const [negocio, setNegocio] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [detalle, setDetalle] = useState("");

  // Estado UI
  const [loading, setLoading] = useState(false);

  // Errores (neón rojo animado)
  const [errors, setErrors] = useState({
    nombre: false,
    tipo: false,
    negocio: false,
    detalle: false,
  });

  // TOAST
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const showToast = (msg, type = "success") => {
    setToast({ show: true, type, msg });
    window.clearTimeout((showToast)._t);
    (showToast)._t = window.setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 2600);
  };

  // Link de WhatsApp
  const waLink = useMemo(() => {
    const lineas = [
      "Hola, quiero una cotización",
      nombre ? `• Nombre: ${nombre}` : null,
      `• Proyecto: ${tipo}`,
      negocio ? `• Rubro/negocio: ${negocio}` : null,
      presupuesto ? `• Presupuesto: ${presupuesto}` : null,
      detalle ? `• Detalle: ${detalle}` : null,
    ].filter(Boolean);

    const text = lineas.join("\n");
    const params = new URLSearchParams({ text });
    return `https://wa.me/${PHONE}?${params.toString()}`;
  }, [PHONE, nombre, tipo, negocio, presupuesto, detalle]);

  // Validación
  const validate = () => {
    const next = {
      nombre: !nombre.trim(),
      tipo: !tipo.trim(),
      negocio: !negocio.trim(),
      detalle: !detalle.trim(),
    };
    setErrors(next);
    // Si hay alguno true => inválido
    return !Object.values(next).some(Boolean);
  };

  // “limpiar” error de un campo al escribir
  useEffect(() => {
    if (nombre.trim() && errors.nombre) setErrors((e) => ({ ...e, nombre: false }));
  }, [nombre]);
  useEffect(() => {
    if (tipo.trim() && errors.tipo) setErrors((e) => ({ ...e, tipo: false }));
  }, [tipo]);
  useEffect(() => {
    if (negocio.trim() && errors.negocio) setErrors((e) => ({ ...e, negocio: false }));
  }, [negocio]);
  useEffect(() => {
    if (detalle.trim() && errors.detalle) setErrors((e) => ({ ...e, detalle: false }));
  }, [detalle]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validación previa
    if (!validate()) {
      showToast("Faltan campos obligatorios", "error");
      return;
    }

    // 1) Abrir WhatsApp SIEMPRE en nueva pestaña
    window.open(waLink, "_blank", "noopener,noreferrer");

    // 2) Intentar enviar correo (no bloquea)
    try {
      setLoading(true);
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Nueva cotización desde el formulario",
          name: nombre,
          email: "", // si luego agregas campo email
          phone: "", // si agregas teléfono
          message: `Proyecto: ${tipo}\nRubro/negocio: ${negocio}\nPresupuesto: ${presupuesto || "A definir"}\nDetalle: ${detalle}`,
          meta: {
            source: "WhatsAppForm",
            url: typeof window !== "undefined" ? window.location.href : "",
          },
        }),
      });

      // Muestra toast de éxito (PC y móvil)
      if (res.ok) {
        showToast("¡Enviado! Te contactaremos pronto ✅", "success");
      } else {
        showToast("No pudimos enviar el correo, pero WhatsApp se abrió ✅", "error");
      }
    } catch {
      showToast("No pudimos enviar el correo, pero WhatsApp se abrió ✅", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fondo animado (tu matrix neon)
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
            {/* NOMBRE */}
            <div className={`wa-field ${errors.nombre ? "has-error" : ""}`}>
              <label htmlFor="nombre">Tu nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Andrea"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                aria-invalid={errors.nombre || undefined}
                aria-describedby={errors.nombre ? "err-nombre" : undefined}
              />
              {errors.nombre && (
                <span id="err-nombre" className="err-msg">⚠ Este campo es obligatorio</span>
              )}
            </div>

            {/* TIPO */}
            <div className={`wa-field ${errors.tipo ? "has-error" : ""}`}>
              <label htmlFor="tipo">Tipo de proyecto</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                aria-invalid={errors.tipo || undefined}
                aria-describedby={errors.tipo ? "err-tipo" : undefined}
              >
                <option>Landing Page</option>
                <option>Sitio Corporativo</option>
                <option>Tienda Online (E-commerce)</option>
                <option>App / Proyecto a medida</option>
                <option>Otro</option>
              </select>
              {errors.tipo && (
                <span id="err-tipo" className="err-msg">⚠ Este campo es obligatorio</span>
              )}
            </div>

            {/* NEGOCIO */}
            <div className={`wa-field ${errors.negocio ? "has-error" : ""}`}>
              <label htmlFor="negocio">Rubro o negocio</label>
              <input
                id="negocio"
                type="text"
                placeholder="Ej: Restaurante, tienda, etc…"
                value={negocio}
                onChange={(e) => setNegocio(e.target.value)}
                aria-invalid={errors.negocio || undefined}
                aria-describedby={errors.negocio ? "err-negocio" : undefined}
              />
              {errors.negocio && (
                <span id="err-negocio" className="err-msg">⚠ Este campo es obligatorio</span>
              )}
            </div>

            {/* PRESUPUESTO (opcional) */}
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

          {/* DETALLE */}
          <div className={`wa-field ${errors.detalle ? "has-error" : ""}`}>
            <label htmlFor="detalle">Detalle</label>
            <textarea
              id="detalle"
              rows={4}
              placeholder="Cuéntanos qué necesitas (páginas, referencias, plazos)…"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              aria-invalid={errors.detalle || undefined}
              aria-describedby={errors.detalle ? "err-detalle" : undefined}
            />
            {errors.detalle && (
              <span id="err-detalle" className="err-msg">⚠ Este campo es obligatorio</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary wa-btn"
            style={{ padding: "1.15rem 2rem", fontSize: "1.1rem", fontWeight: 800, minHeight: 55, cursor: "pointer" }}
            aria-label="Enviar por WhatsApp"
            disabled={loading}
          >
            {loading ? "Enviando…" : "Enviar por WhatsApp"}
          </button>
        </form>
      </div>

      {/* Toast */}
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

      {/* Estilos de error neón y accesibilidad */}
      <style jsx global>{`
        @keyframes neonPulseRed {
          0% { box-shadow: 0 0 0 rgba(239, 68, 68, 0.0); }
          50% { box-shadow: 0 0 18px rgba(239, 68, 68, 0.65); }
          100% { box-shadow: 0 0 0 rgba(239, 68, 68, 0.0); }
        }
        .wa-field.has-error input,
        .wa-field.has-error select,
        .wa-field.has-error textarea {
          border-color: #ef4444 !important;
          outline: none !important;
          animation: neonPulseRed 1.6s ease-in-out infinite;
        }
        .wa-field.has-error label {
          color: #fecaca !important; /* rojo claro */
          font-weight: 700;
        }
        .err-msg {
          display: block;
          margin-top: 6px;
          color: #fecaca; /* rojo claro legible */
          font-size: 0.9rem;
          font-weight: 700;
          text-shadow: 0 0 8px rgba(239,68,68,0.35);
        }
        /* Mejora foco accesible */
        .wa-field input:focus,
        .wa-field select:focus,
        .wa-field textarea:focus {
          outline: none;
        }
      `}</style>
    </section>
  );
}
