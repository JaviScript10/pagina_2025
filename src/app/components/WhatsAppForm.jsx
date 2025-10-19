"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { WA_PHONE } from "../config";

export default function WhatsAppForm() {
  const PHONE = WA_PHONE;

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Landing Page");
  const [negocio, setNegocio] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [detalle, setDetalle] = useState("");
  const [loading, setLoading] = useState(false);

  // Aviso inline dentro del formulario
  const [inlineMsg, setInlineMsg] = useState({ show: false, type: "success", text: "" });

  // TOAST (si lo quieres además del inline)
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const showToast = (msg, type = "success") => {
    setToast({ show: true, type, msg });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 2500);
  };

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Limpia aviso inline
    setInlineMsg({ show: false, type: "success", text: "" });

    // 1) Abre WhatsApp (nueva pestaña) — puede verse como “blanca” por un segundo, es normal
    window.open(waLink, "_blank", "noopener,noreferrer");

    // 2) Intentar enviar correo (no fallará si no hay SMTP por la API resiliente)
    try {
      setLoading(true);
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Nueva cotización desde el formulario",
          name: nombre,
          email: "",  // si agregas campo email
          phone: "",  // si agregas campo teléfono
          message: `Proyecto: ${tipo}\nRubro/negocio: ${negocio}\nPresupuesto: ${presupuesto}\nDetalle: ${detalle}`,
          meta: { source: "WhatsAppForm", url: typeof window !== "undefined" ? window.location.href : "" },
        }),
      });

      // Pase lo que pase, mostramos éxito para no confundir
      setInlineMsg({ show: true, type: "success", text: "¡Enviado! Te contactaremos pronto ✅" });
      showToast("¡Enviado! Te contactaremos pronto ✅", "success");

      // Opcional: limpia los campos
      setNombre("");
      setTipo("Landing Page");
      setNegocio("");
      setPresupuesto("");
      setDetalle("");
    } catch {
      // Igual mostramos éxito (la API ya no devuelve 500 por SMTP faltante)
      setInlineMsg({ show: true, type: "success", text: "¡Enviado! Te contactaremos pronto ✅" });
      showToast("¡Enviado! Te contactaremos pronto ✅", "success");
    } finally {
      setLoading(false);
    }
  };

  // ==== Fondo animado Matrix Neón (igual que tenías) ====
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

        <form onSubmit={onSubmit} className="wa-form">
          <div className="wa-grid">
            <div className="wa-field">
              <label htmlFor="nombre">Tu nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: Andrea"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              {/* Mensaje de campos obligatorios (si quieres mostrarlo siempre en mobile) */}
              <small className="field-hint">* Campo obligatorio</small>
            </div>

            <div className="wa-field">
              <label htmlFor="tipo">Tipo de proyecto</label>
              <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Landing Page</option>
                <option>Sitio Corporativo</option>
                <option>Tienda Online (E-commerce)</option>
                <option>App / Proyecto a medida</option>
                <option>Otro</option>
              </select>
            </div>

            <div className="wa-field">
              <label htmlFor="negocio">Rubro o negocio</label>
              <input
                id="negocio"
                type="text"
                placeholder="Ej: Restaurante, tienda, etc…"
                value={negocio}
                onChange={(e) => setNegocio(e.target.value)}
              />
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
            <label htmlFor="detalle">Detalle (opcional)</label>
            <textarea
              id="detalle"
              rows={4}
              placeholder="Cuéntanos qué necesitas (páginas, referencias, plazos)…"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
            />
          </div>

          {/* Aviso inline (queda dentro del form) */}
          {inlineMsg.show && (
            <div
              className="inline-alert"
              role="status"
              aria-live="polite"
              style={{
                background:
                  inlineMsg.type === "success"
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : "linear-gradient(135deg, #ef4444, #dc2626)",
              }}
            >
              {inlineMsg.text}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary wa-btn"
            style={{ padding: "1.2rem 2rem", fontSize: "1.1rem", fontWeight: 700, minHeight: 55 }}
            aria-label="Enviar por WhatsApp"
            disabled={loading}
          >
            {loading ? "Enviando…" : "Enviar por WhatsApp"}
          </button>
        </form>
      </div>

      {/* TOAST (arriba-centro y por encima de todo) */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          top: "14px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 99999, // ⬅️ por encima de todo
          pointerEvents: "none",
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
              padding: "10px 14px",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              minWidth: "260px",
              fontWeight: 800,
              border: "1px solid rgba(255,255,255,0.25)",
              textAlign: "center",
            }}
            role="status"
          >
            {toast.msg}
          </div>
        )}
      </div>

      {/* AUX CSS */}
      <style jsx>{`
        .inline-alert {
          margin: 10px 0 6px;
          color: #fff;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 800;
          border: 1px solid rgba(255,255,255,.25);
          box-shadow: 0 8px 24px rgba(0,0,0,.25);
        }
        .field-hint {
          display: none;
          color: #e2e8f0;
          opacity: .9;
          font-size: 12px;
          margin-top: 6px;
        }
        @media (max-width: 640px) {
          .field-hint { display: inline-block; }
        }
      `}</style>
    </section>
  );
}
