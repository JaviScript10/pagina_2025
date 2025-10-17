"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { WA_PHONE } from "../config"; // desde /app/components -> ../config

export default function WhatsAppForm() {
    const PHONE = WA_PHONE;

    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("Landing Page");
    const [negocio, setNegocio] = useState("");
    const [presupuesto, setPresupuesto] = useState("");
    const [detalle, setDetalle] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // TOAST
    const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
    const toastTimer = useRef(null);
    const showToast = (msg, type = "success") => {
        setToast({ show: true, type, msg });
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => {
            setToast((t) => ({ ...t, show: false }));
        }, 3000);
    };

    // Validación de formulario
    const validateForm = () => {
        const newErrors = {};

        if (!nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio";
        }

        if (!tipo.trim()) {
            newErrors.tipo = "Selecciona un tipo de proyecto";
        }

        if (!negocio.trim()) {
            newErrors.negocio = "El rubro o negocio es obligatorio";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

        // Validar formulario antes de continuar
        if (!validateForm()) {
            showToast("Por favor, completa todos los campos obligatorios", "error");
            return;
        }

        // 1) Abrir WhatsApp altiro
        window.open(waLink, "_blank", "noopener,noreferrer");

        // 2) Intentar enviar correo
        try {
            setLoading(true);
            const res = await fetch("/api/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: "Nueva cotización desde el formulario",
                    name: nombre,
                    email: "",   // si luego agregas campo email, complétalo
                    phone: "",   // idem teléfono
                    message: `Proyecto: ${tipo}\nRubro/negocio: ${negocio}\nPresupuesto: ${presupuesto}\nDetalle: ${detalle}`,
                    meta: {
                        source: "WhatsAppForm",
                        url: typeof window !== "undefined" ? window.location.href : "",
                    },
                }),
            });

            if (!res.ok) throw new Error("Error al enviar");
            showToast("¡Enviado! Te contactaremos pronto ✅", "success");

            // Opcional: Limpiar formulario después del envío exitoso
            setNombre("");
            setTipo("Landing Page");
            setNegocio("");
            setPresupuesto("");
            setDetalle("");
            setErrors({});

        } catch {
            showToast("No pudimos enviar el correo. WhatsApp se abrió igual 🙌", "error");
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
                        <div className="wa-field">
                            <label htmlFor="nombre">Tu nombre *</label>
                            <input
                                id="nombre"
                                type="text"
                                placeholder="Ej: Andrea"
                                value={nombre}
                                onChange={(e) => {
                                    setNombre(e.target.value);
                                    // Limpiar error cuando el usuario empiece a escribir
                                    if (errors.nombre) {
                                        setErrors(prev => ({ ...prev, nombre: "" }));
                                    }
                                }}
                                required
                                className={errors.nombre ? "error" : ""}
                            />
                            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                        </div>

                        <div className="wa-field">
                            <label htmlFor="tipo">Tipo de proyecto *</label>
                            <select
                                id="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className={errors.tipo ? "error" : ""}
                            >
                                <option>Landing Page</option>
                                <option>Sitio Corporativo</option>
                                <option>Tienda Online (E-commerce)</option>
                                <option>App / Proyecto a medida</option>
                                <option>Otro</option>
                            </select>
                            {errors.tipo && <span className="error-message">{errors.tipo}</span>}
                        </div>

                        <div className="wa-field">
                            <label htmlFor="negocio">Rubro o negocio *</label>
                            <input
                                id="negocio"
                                type="text"
                                placeholder="Ej: Restaurante, tienda, etc…"
                                value={negocio}
                                onChange={(e) => {
                                    setNegocio(e.target.value);
                                    // Limpiar error cuando el usuario empiece a escribir
                                    if (errors.negocio) {
                                        setErrors(prev => ({ ...prev, negocio: "" }));
                                    }
                                }}
                                required
                                className={errors.negocio ? "error" : ""}
                            />
                            {errors.negocio && <span className="error-message">{errors.negocio}</span>}
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

            {/* TOAST */}
            <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Estilos para errores */
        .wa-field input.error,
        .wa-field select.error {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
          font-weight: 500;
        }
        
        .wa-field label:after {
          content: attr(data-required);
          color: #ef4444;
          margin-left: 0.25rem;
        }
        
        .wa-field label[for="nombre"]:after,
        .wa-field label[for="tipo"]:after,
        .wa-field label[for="negocio"]:after {
          content: " ";
          color: #ef4444;
        }
      `}</style>
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
        </section>
    );
}