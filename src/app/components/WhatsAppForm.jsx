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

  const [loading, setLoading] = useState(false);

  // Errores por campo
  const [errors, setErrors] = useState({
    nombre: "",
    tipo: "",
    negocio: "",
    detalle: "",
  });

  // TOAST (éxito/error)
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const toastTimerRef = useRef(null);

  const showToast = (msg, type = "success", ms = 3000) => {
    setToast({ show: true, type, msg });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, ms);
  };

  // Ocultar toast cuando el usuario empieza a escribir (cualquier campo)
  useEffect(() => {
    if (toast.show) {
      setToast((t) => ({ ...t, show: false }));
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombre, tipo, negocio, detalle]);

  // Construye el link de WhatsApp
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
    const newErr = {
      nombre: "",
      tipo: "",
      negocio: "",
      detalle: "",
    };
    let ok = true;

    if (!nombre.trim()) {
      newErr.nombre = "Campo obligatorio";
      ok = false;
    }
    if (!tipo || !tipo.trim()) {
      newErr.tipo = "Campo obligatorio";
      ok = false;
    }
    if (!negocio.trim()) {
      newErr.negocio = "Campo obligatorio";
      ok = false;
    }
    if (!detalle.trim()) {
      newErr.detalle = "Campo obligatorio";
      ok = false;
    }

    setErrors(newErr);
    return ok;
  };

  // Limpia error individual al escribir
  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validación previa
    if (!validate()) {
      showToast("Completa los campos obligatorios marcados en rojo.", "error", 3500);
      // no abrir WhatsApp si faltan datos
      return;
    }

    
    // Abrir WhatsApp sin pestaña vacía (modo móvil friendly)
const a = document.createElement("a");
a.href = waLink;
a.target = "_self"; // 🔥 así evita la ventana en blanco en móvil
a.rel = "noopener noreferrer";
document.body.appendChild(a);
a.click();
a.remove();


    // 2) Enviar correo (no bloquear UI si falla)
    try {
      setLoading(true);
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Nueva cotización desde el formulario",
          name: nombre,
          email: "", // si luego agregas campo email, complétalo
          phone: "", // si luego agregas teléfono, complétalo
          message: `Proyecto: ${tipo}\nRubro/negocio: ${negocio}\nPresupuesto: ${presupuesto}\nDetalle: ${detalle}`,
          meta: {
            source: "WhatsAppForm",
            url: typeof window !== "undefined" ? window.location.href : "",
          },
        }),
      });

      if (!res.ok) throw new Error("Error al enviar");
      showToast("¡Enviado! Te contactaremos pronto ✅", "success", 3000);
    } catch {
      // Solo informativo: WhatsApp ya se abrió
      showToast("No pudimos enviar el correo, pero WhatsApp se abrió ✅", "error", 3500);
    } finally {
      setLoading(false);
    }
  };

  // ==== Fondo animado Matrix Neón Mejorado ====
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
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
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
            {/* Nombre */}
            <div className="wa-field">
              <label htmlFor="nombre">Tu nombre <span className="req">*</span></label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Andrea"
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); clearError("nombre"); }}
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? "err-nombre" : undefined}
              />
              {errors.nombre && (
                <span id="err-nombre" className="err-msg">• {errors.nombre}</span>
              )}
            </div>

            {/* Tipo */}
            <div className="wa-field">
              <label htmlFor="tipo">Tipo de proyecto <span className="req">*</span></label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => { setTipo(e.target.value); clearError("tipo"); }}
                aria-invalid={!!errors.tipo}
                aria-describedby={errors.tipo ? "err-tipo" : undefined}
              >
                <option>Landing Page</option>
                <option>Sitio Corporativo</option>
                <option>Tienda Online (E-commerce)</option>
                <option>App / Proyecto a medida</option>
                <option>Otro</option>
              </select>
              {errors.tipo && (
                <span id="err-tipo" className="err-msg">• {errors.tipo}</span>
              )}
            </div>

            {/* Negocio */}
            <div className="wa-field">
              <label htmlFor="negocio">Rubro o negocio <span className="req">*</span></label>
              <input
                id="negocio"
                type="text"
                placeholder="Ej: Restaurante, tienda, etc…"
                value={negocio}
                onChange={(e) => { setNegocio(e.target.value); clearError("negocio"); }}
                aria-invalid={!!errors.negocio}
                aria-describedby={errors.negocio ? "err-negocio" : undefined}
              />
              {errors.negocio && (
                <span id="err-negocio" className="err-msg">• {errors.negocio}</span>
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
            <label htmlFor="detalle">Detalle <span className="req">*</span></label>
            <textarea
              id="detalle"
              rows={4}
              placeholder="Cuéntanos qué necesitas (páginas, referencias, plazos)…"
              value={detalle}
              onChange={(e) => { setDetalle(e.target.value); clearError("detalle"); }}
              aria-invalid={!!errors.detalle}
              aria-describedby={errors.detalle ? "err-detalle" : undefined}
            />
            {errors.detalle && (
              <span id="err-detalle" className="err-msg">• {errors.detalle}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary wa-btn"
            style={{ padding: "1.2rem 2rem", fontSize: "1.1rem", fontWeight: 800, minHeight: 55, cursor: "pointer" }}
            aria-label="Enviar por WhatsApp"
            disabled={loading}
          >
            {loading ? "Enviando…" : "Enviar por WhatsApp"}
          </button>
        </form>
      </div>

      {/* TOAST */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          right: "auto",
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

      {/* Estilos mínimos para errores y accesibilidad */}
      <style jsx global>{`
        .wa-field [aria-invalid="true"] {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
        }
        .wa-field .req {
          color: #ef4444;
          font-weight: 800;
          margin-left: 4px;
        }
        .wa-field .err-msg {
          display: inline-block;
          color: #ef4444;
          font-weight: 800;
          margin-top: 6px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: 8px;
          padding: 6px 10px;
        }
        /* Mejor legibilidad en móvil */
        @media (max-width: 768px) {
          .wa-field .err-msg {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </section>
  );
}
