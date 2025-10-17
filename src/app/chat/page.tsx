"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { WA_PHONE } from "../config"; // ← ruta relativa correcta

// —————— Tipos ——————
type Role = "assistant" | "user";
type Msg = { id: string; role: Role; text: string; chips?: string[] };

type WizardData = {
  tipo: string;
  negocio: string;
  presupuesto: string;
  plazo: string;
};
type WizardState = {
  active: boolean;
  step: number; // 0=idle, 1..4 pasos
  data: WizardData;
};

// —————— Constantes ——————
const STORAGE_KEY = "velocity_chat_history_v1";
const WIZARD_KEY = "velocity_chat_wizard_v1";
const WIZARD_LAST_KEY = "velocity_chat_wizard_last_result_v1";

const QUICK_CHIPS = [
  "Quiero cotizar una web",
  "Quiero soporte",
  "Evaluación rápida Audición",
  "Ver precios",
];

const TIPO_CHIPS = ["Landing", "Corporativa", "Tienda", "App / Medida"];
const PRESUPUESTO_CHIPS = [
  "Hasta $300.000",
  "$300.000 – $700.000",
  "$300.000 – $1.500.000",
  "$1.500.000+",
  "A definir",
];
const PLAZO_CHIPS = ["1–2 semanas", "3–4 semanas", "5+ semanas", "A definir"];

// —————— Componente principal ——————
export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [wizard, setWizard] = useState<WizardState>({
    active: false,
    step: 0,
    data: { tipo: "", negocio: "", presupuesto: "", plazo: "" },
  });
  const [wizardLast, setWizardLast] = useState<WizardData | null>(null);

  // UI: envío + toast
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; msg: string }>({
    show: false,
    type: "success",
    msg: "",
  });
  const toastTimerRef = useRef<number | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, type, msg });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 3000);
  };

  const listRef = useRef<HTMLDivElement | null>(null);

  // Cargar historial y wizard al montar
  useEffect(() => {
    // Historial
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed);
        } else {
          initHello();
        }
      } catch {
        initHello();
      }
    } else {
      initHello();
    }
    // Wizard
    const wraw = typeof window !== "undefined" ? localStorage.getItem(WIZARD_KEY) : null;
    if (wraw) {
      try {
        const w = JSON.parse(wraw) as WizardState;
        if (w && typeof w === "object") setWizard(w);
      } catch { }
    }
    const lraw = typeof window !== "undefined" ? localStorage.getItem(WIZARD_LAST_KEY) : null;
    if (lraw) {
      try {
        const lw = JSON.parse(lraw) as WizardData | null;
        if (lw) setWizardLast(lw);
      } catch { }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initHello() {
    const hello: Msg = {
      id: crypto.randomUUID(),
      role: "assistant",
      text:
        "Hola 👋 Soy tu asistente. Puedo ayudarte a **cotizar tu sitio** (modo guiado), resolver **soporte técnico** o hacer un **tamizaje orientativo** de audición (Audición Fono). ¿Por dónde partimos?",
      chips: QUICK_CHIPS,
    };
    setMessages([hello]);
  }

  // Guardar historial y wizard
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(WIZARD_KEY, JSON.stringify(wizard));
    }
  }, [wizard]);

  // Auto-scroll
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // “Pensar”
  const think = async (ms = 800) => new Promise((r) => setTimeout(r, ms));

  // —— Enrutamiento principal de mensajes ——
  async function replyTo(userText: string) {
    // Si el wizard está activo, procesamos paso a paso y retornamos
    if (wizard.active) {
      await handleWizardInput(userText);
      return;
    }

    setTyping(true);
    await think(400);
    const t = userText.toLowerCase();

    // ——— Activar Cotización (wizard) ———
    if (t.includes("cotiz") || t.includes("web")) {
      setTyping(false);
      startWizard();
      return;
    }

    // ——— Soporte ———
    if (t.includes("soporte") || t.includes("error") || t.includes("bug")) {
      setTyping(false);
      addAssistant(
        "Claro. Cuéntame el problema (si puedes: pasos y captura). También puedo abrir WhatsApp técnico.",
        ["Abrir WhatsApp", "Volver al inicio"]
      );
      return;
    }

    // ——— Ver precios ———
    if (t.includes("precio") || t.includes("precios")) {
      setTyping(false);
      addAssistant(
        [
          "Guía referencial:",
          "• Landing: desde $300.000",
          "• Corporativa: desde $700.000",
          "• Tienda: desde $1.200.000",
          "• App/Medida: a evaluar",
          "",
          "El valor exacto depende de secciones, integraciones y tiempos.",
        ].join("\n"),
        ["Cotizar (modo guiado)", "Volver al inicio"]
      );
      return;
    }

    // ——— Audición Fono ———
    if (t.includes("audición") || t.includes("audicion") || t.includes("fono") || t.includes("evaluación")) {
      setTyping(false);
      addAssistant(
        [
          "🩺 **Tamizaje orientativo** (no reemplaza evaluación clínica).",
          "Responde: ¿Has notado…?",
          "1) Dificultad para entender con ruido",
          "2) Subir mucho el volumen de TV",
          "3) Zumbidos/tinnitus frecuentes",
          "4) Pedir repetir “¿ah?” seguido",
          "",
          "Escríbeme el **número de síntomas** que aplican (0–4), o `ayuda`.",
        ].join("\n"),
        ["0", "1", "2", "3", "4", "Volver al inicio"]
      );
      return;
    }

    // ——— Audición: respuesta numérica ———
    const asNumber = Number(t.trim());
    if (!Number.isNaN(asNumber) && asNumber >= 0 && asNumber <= 4) {
      setTyping(false);
      if (asNumber <= 1) {
        addAssistant(
          "Resultado orientativo: **Bajo riesgo**. Sugerencia: higiene auditiva y control si aparece algún síntoma.",
          ["Abrir WhatsApp", "Volver al inicio"]
        );
      } else if (asNumber === 2 || asNumber === 3) {
        addAssistant(
          "Resultado orientativo: **Riesgo moderado**. Te sugiero una evaluación audiológica formal. Puedo agendar contacto por WhatsApp.",
          ["Abrir WhatsApp", "Volver al inicio"]
        );
      } else {
        addAssistant(
          "Resultado orientativo: **Riesgo alto**. Recomendación: evaluación fonoaudiológica/audiometría con un profesional. Te dejo contacto por WhatsApp.",
          ["Abrir WhatsApp", "Volver al inicio"]
        );
      }
      return;
    }

    // ——— Volver / Ayuda ———
    if (t.includes("volver") || t.includes("inicio") || t === "menu" || t === "menú" || t.includes("ayuda")) {
      setTyping(false);
      addAssistant("¿Qué necesitas ahora?", QUICK_CHIPS);
      return;
    }

    // ——— WhatsApp ———
    if (t.includes("whatsapp")) {
      setTyping(false);
      addAssistant("Usa el botón **Enviar por WhatsApp** arriba para abrir la conversación.", [
        "Volver al inicio",
      ]);
      return;
    }

    // ——— Fallback ———
    setTyping(false);
    addAssistant(
      "Puedo ayudarte con **cotizaciones (modo guiado)**, **soporte técnico** o **tamizaje de audición**. Elige una opción:",
      QUICK_CHIPS
    );
  }

  // —— Wizard: inicio y flujo ——
  function startWizard() {
    setWizard({
      active: true,
      step: 1,
      data: { tipo: "", negocio: "", presupuesto: "", plazo: "" },
    });
    addAssistant("Genial, hagamos tu cotización paso a paso.\n**Paso 1/4:** ¿Qué tipo de proyecto necesitas?", TIPO_CHIPS);
  }

  async function handleWizardInput(userText: string) {
    const step = wizard.step;
    const text = userText.trim();
    const lower = text.toLowerCase();

    // Paso 1: Tipo
    if (step === 1) {
      let tipo = text;
      if (lower.includes("landing")) tipo = "Landing";
      else if (lower.includes("corpor")) tipo = "Corporativa";
      else if (lower.includes("tienda")) tipo = "Tienda";
      else if (lower.includes("app")) tipo = "App / Medida";

      if (!tipo) return;

      const next = { ...wizard, step: 2, data: { ...wizard.data, tipo } };
      setWizard(next);
      setTyping(true);
      await think(300);
      setTyping(false);
      addAssistant("**Paso 2/4:** Cuéntame el **rubro o negocio** (ej: restaurante, tienda de ropa…).");
      return;
    }

    // Paso 2: Rubro/negocio
    if (step === 2) {
      const negocio = text || "No especificado";
      const next = { ...wizard, step: 3, data: { ...wizard.data, negocio } };
      setWizard(next);
      setTyping(true);
      await think(300);
      setTyping(false);
      addAssistant("**Paso 3/4:** ¿Cuál es tu **presupuesto estimado**?", PRESUPUESTO_CHIPS);
      return;
    }

    // Paso 3: Presupuesto
    if (step === 3) {
      let presupuesto = text;
      if (lower.includes("hasta")) presupuesto = "Hasta $300.000";
      else if (lower.includes("700")) presupuesto = "$300.000 – $700.000";
      else if (lower.includes("1.500") || lower.includes("1500")) presupuesto = "$700.000 – $1.500.000";
      else if (lower.includes("+") || lower.includes("1.5") || lower.includes("mas") || lower.includes("más"))
        presupuesto = "$1.500.000+";
      else if (lower.includes("defin")) presupuesto = "A definir";

      const next = { ...wizard, step: 4, data: { ...wizard.data, presupuesto } };
      setWizard(next);
      setTyping(true);
      await think(300);
      setTyping(false);
      addAssistant("**Paso 4/4:** ¿Cuál es tu **plazo** objetivo?", PLAZO_CHIPS);
      return;
    }

    // Paso 4: Plazo
    if (step === 4) {
      let plazo = text;
      if (lower.includes("1") || lower.includes("2")) plazo = "1–2 semanas";
      else if (lower.includes("3") || lower.includes("4")) plazo = "3–4 semanas";
      else if (lower.includes("5") || lower.includes("+")) plazo = "5+ semanas";
      else if (lower.includes("defin")) plazo = "A definir";

      const done: WizardState = {
        active: false,
        step: 0,
        data: { ...wizard.data, plazo },
      };
      setWizard(done);
      setWizardLast(done.data);
      if (typeof window !== "undefined") {
        localStorage.setItem(WIZARD_LAST_KEY, JSON.stringify(done.data));
      }

      setTyping(true);
      await think(400);
      setTyping(false);

      const resumen = buildWizardSummary(done.data);
      addAssistant(
        ["✅ **Resumen de tu cotización:**", resumen, "", "¿Quieres enviarlo por WhatsApp?"].join("\n"),
        ["Enviar por WhatsApp", "Volver al inicio"]
      );
      return;
    }
  }

  // —— Helpers para enviar/añadir mensajes ——
  function addAssistant(text: string, chips?: string[]) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text, chips }]);
  }

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (wizard.active) {
      handleWizardInput(text.trim());
    } else {
      replyTo(text.trim());
    }
  }

  // ——— WhatsApp preset (preferir wizard completo) ———
  const waLink = useMemo(() => {
    if (wizardLast) {
      const preset = encodeURIComponent(buildWizardMessage(wizardLast));
      return `https://wa.me/${WA_PHONE}?text=${preset}`;
    }
    const preset = encodeURIComponent(buildChatSummary(messages));
    return `https://wa.me/${WA_PHONE}?text=${preset}`;
  }, [messages, wizardLast]);

  // ——— Acción del botón “Enviar por WhatsApp + Email” ———
  async function sendWhatsAppAndEmail() {
    if (isSending) return;

    const text = wizardLast ? buildWizardMessage(wizardLast) : buildChatSummary(messages);

    // 1) Abre WhatsApp
    window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");

    // 2) Envía correo (no bloquea UX)
    try {
      setIsSending(true);
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: wizardLast ? "Nueva cotización (Chat - Wizard)" : "Nuevo contacto (Chat - Resumen)",
          name: "(desde chat)",
          email: "",
          phone: "",
          message: text,
          meta: {
            source: wizardLast ? "ChatWizard" : "ChatFree",
            url: typeof window !== "undefined" ? window.location.href : "",
          },
        }),
      });
      if (!res.ok) throw new Error("send failed");
      showToast("¡Enviado! Te contactaremos por WhatsApp y correo ✅", "success");
    } catch {
      showToast("No pudimos enviar el correo. WhatsApp se abrió igual 🙌", "error");
    } finally {
      setIsSending(false);
    }
  }

  const clearHistory = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WIZARD_KEY);
    setWizard({
      active: false,
      step: 0,
      data: { tipo: "", negocio: "", presupuesto: "", plazo: "" },
    });
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          "Historial borrado ✅. ¿Cómo te ayudo ahora? (Cotización guiada / Soporte / Audición Fono)",
        chips: QUICK_CHIPS,
      },
    ]);
  };

  return (
    <main className="chat-shell">
      {/* Topbar */}
      <div className="chat-topbar">
        <Link href="/" className="chat-back">← Volver</Link>
        <div className="chat-title">
          <span className="dot" />
          Asistente Velocity
        </div>

        <div style={{ display: "flex", gap: ".5rem", justifySelf: "end", alignItems: "center" }}>
          {/* Botón moderno WhatsApp + Email */}
          <button
            onClick={sendWhatsAppAndEmail}
            disabled={isSending}
            className="chat-wa"
            aria-label="Enviar por WhatsApp y Email"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              padding: "0.65rem 1rem",
              borderRadius: "999px",
              fontWeight: 800,
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: "0 8px 28px rgba(34,197,94,0.35)",
              cursor: isSending ? "not-allowed" : "pointer",
              opacity: isSending ? 0.8 : 1,
              transition: "transform .15s ease",
            }}
          >
            {/* Icono WhatsApp */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>

            {isSending ? (
              <>
                <span>Enviando…</span>
                <span
                  className="spinner"
                  aria-hidden="true"
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.6)",
                    borderTopColor: "transparent",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </>
            ) : (
              <span>Enviar por WhatsApp + Email</span>
            )}
          </button>

          <button onClick={clearHistory} className="chat-clear" aria-label="Borrar historial">
            Borrar
          </button>
        </div>
      </div>

      {/* Fondo animado */}
      <NeonGridBackground />

      {/* Mensajes */}
      <div className="chat-list" ref={listRef} role="log" aria-live="polite">
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} text={m.text} chips={m.chips} onChipClick={send} />
        ))}
        {typing && <Typing />}
      </div>

      {/* Input */}
      <form
        className="chat-inputbar"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          className="chat-input"
          placeholder={
            wizard.active
              ? wizardPromptPlaceholder(wizard.step)
              : "Escribe aquí… (ej: Quiero cotizar una web)"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="chat-send" aria-label="Enviar">Enviar</button>
      </form>

      {/* TOAST */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
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
    </main>
  );
}

// —————— Components ——————
function Bubble({
  role,
  text,
  chips,
  onChipClick,
}: {
  role: Role;
  text: string;
  chips?: string[];
  onChipClick?: (s: string) => void;
}) {
  const isUser = role === "user";
  return (
    <div className={`bubble ${isUser ? "user" : "assistant"}`}>
      <div className="bubble-inner" dangerouslySetInnerHTML={{ __html: mdToHtml(text) }} />
      {!!chips?.length && (
        <div className="chips">
          {chips.map((c) => (
            <button key={c} className="chip" onClick={() => onChipClick?.(c)}>{c}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function Typing() {
  return (
    <div className="bubble assistant">
      <div className="typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function NeonGridBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const lines = Array.from({ length: 48 }, () => ({
      x: Math.random() * (canvas.width / dpr),
      y: Math.random() * (canvas.height / dpr),
      v: 0.6 + Math.random() * 1.2,
      o: 0.15 + Math.random() * 0.35,
    }));

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(2,6,23,0.85)";
      ctx.fillRect(0, 0, w, h);

      lines.forEach((p) => {
        ctx.save();
        ctx.strokeStyle = `rgba(0, 255, 240, ${p.o})`;
        ctx.shadowColor = "rgba(0,255,240,0.6)";
        ctx.shadowBlur = 6;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 120, p.y + 120);
        ctx.stroke();
        ctx.restore();

        p.x += p.v * 1.1;
        p.y += p.v * 1.2;
        if (p.x > w + 80) p.x = -80;
        if (p.y > h + 80) p.y = -80;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="chat-bg" aria-hidden="true" />;
}

// —————— Utils ——————
function mdToHtml(s: string) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

function wizardPromptPlaceholder(step: number) {
  if (step === 1) return "Ej: Landing / Corporativa / Tienda / App";
  if (step === 2) return "Ej: Restaurante, tienda, emprendimiento…";
  if (step === 3) return "Ej: $500.000 / $300.000 – $700.000 / A definir";
  if (step === 4) return "Ej: 2 semanas / 3–4 semanas / A definir";
  return "Escribe aquí…";
}

// Resumen de chat (fallback)
function buildChatSummary(msgs: Msg[]) {
  const MAX = 900; // para no exceder la URL
  const lines: string[] = [];
  lines.push("Hola, vengo desde el chat de la web.");
  lines.push("Resumen (general):");

  msgs.forEach((m) => {
    const prefix = m.role === "user" ? "Yo:" : "Asistente:";
    const plain = m.text.replace(/<[^>]+>/g, "");
    lines.push(`${prefix} ${plain}`);
  });

  let text = lines.join("\n");
  if (text.length > MAX) text = text.slice(0, MAX) + "…";
  return text;
}

// Texto final para WhatsApp cuando hay wizard completo
function buildWizardMessage(d: WizardData) {
  return (
    "Hola, quiero cotizar un proyecto:\n" +
    `• Tipo: ${d.tipo || "—"}\n` +
    `• Rubro/Negocio: ${d.negocio || "—"}\n` +
    `• Presupuesto: ${d.presupuesto || "—"}\n` +
    `• Plazo: ${d.plazo || "—"}`
  );
}

// Resumen amigable mostrado en el chat cuando termina el wizard
function buildWizardSummary(d: WizardData) {
  return [
    `• Tipo: **${d.tipo || "—"}**`,
    `• Rubro/Negocio: **${d.negocio || "—"}**`,
    `• Presupuesto: **${d.presupuesto || "—"}**`,
    `• Plazo: **${d.plazo || "—"}**`,
  ].join("\n");
}
