import { useEffect, useMemo, useRef, useState } from "react";

// Constantes
const WA_PHONE = "56912345678"; // Cambia por tu número real
const STORAGE_KEY = "velocity_chat_history_v1";
const WIZARD_KEY = "velocity_chat_wizard_v1";
const WIZARD_LAST_KEY = "velocity_chat_wizard_last_result_v1";

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
  step: number;
  data: WizardData;
};

// Chips de servicios principales
const SERVICE_CHIPS = [
  "Landing Page",
  "Aplicación Web",
  "Tienda Online",
  "Sitio Corporativo",
  "Soporte & Mantención",
  "SEO & Performance",
];

const TIPO_CHIPS = ["Landing", "Corporativa", "Tienda", "App / Medida"];
const PRESUPUESTO_CHIPS = [
  "Hasta $300.000",
  "$300.000 – $700.000",
  "$700.000 – $1.500.000",
  "$1.500.000+",
  "A definir",
];
const PLAZO_CHIPS = ["1–2 semanas", "3–4 semanas", "5+ semanas", "A definir"];

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
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; msg: string }>({
    show: false,
    type: "success",
    msg: "",
  });

  const toastTimerRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, type, msg });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 3000);
  };

  // Cargar historial al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed);
          return;
        }
      }
    } catch { }

    // Saludo inicial
    initHello();

    // Cargar wizard si existe
    try {
      const wraw = localStorage.getItem(WIZARD_KEY);
      if (wraw) {
        const w = JSON.parse(wraw) as WizardState;
        if (w && typeof w === "object") setWizard(w);
      }
    } catch { }

    try {
      const lraw = localStorage.getItem(WIZARD_LAST_KEY);
      if (lraw) {
        const lw = JSON.parse(lraw) as WizardData | null;
        if (lw) setWizardLast(lw);
      }
    } catch { }
  }, []);

  function initHello() {
    addAssistant("Hola 👋 ¿Cómo te ayudo hoy?");
    addAssistant("¿Qué necesitas? Elige un servicio:", SERVICE_CHIPS);
    addAssistant("También puedo:", ["Cotizar (modo guiado)", "Soporte técnico", "Ver precios"]);
  }

  // Guardar historial
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch { }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(WIZARD_KEY, JSON.stringify(wizard));
    } catch { }
  }, [wizard]);

  // Auto-scroll
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const think = async (ms = 800) => new Promise((r) => setTimeout(r, ms));

  function addAssistant(text: string, chips?: string[]) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text, chips }]);
  }

  function addUser(text: string) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);
  }

  function startWizard() {
    setWizard({
      active: true,
      step: 1,
      data: { tipo: "", negocio: "", presupuesto: "", plazo: "" },
    });
    addAssistant("**Paso 1/4:** ¿Qué tipo de proyecto necesitas?", TIPO_CHIPS);
  }

  async function handleWizardInput(userText: string) {
    const step = wizard.step;
    const text = userText.trim();
    const lower = text.toLowerCase();

    if (step === 1) {
      let tipo = text;
      if (lower.includes("landing")) tipo = "Landing";
      else if (lower.includes("corpor")) tipo = "Corporativa";
      else if (lower.includes("tienda")) tipo = "Tienda";
      else if (lower.includes("app")) tipo = "App / Medida";

      const next = { ...wizard, step: 2, data: { ...wizard.data, tipo } };
      setWizard(next);
      setTyping(true);
      await think(300);
      setTyping(false);
      addAssistant("**Paso 2/4:** Cuéntame el **rubro o negocio** (ej: restaurante, tienda…).");
      return;
    }

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

    if (step === 3) {
      let presupuesto = text;
      if (lower.includes("hasta")) presupuesto = "Hasta $300.000";
      else if (lower.includes("700")) presupuesto = "$300.000 – $700.000";
      else if (lower.includes("1.500") || lower.includes("1500"))
        presupuesto = "$700.000 – $1.500.000";
      else if (lower.includes("+") || lower.includes("1.5")) presupuesto = "$1.500.000+";
      else if (lower.includes("defin")) presupuesto = "A definir";

      const next = { ...wizard, step: 4, data: { ...wizard.data, presupuesto } };
      setWizard(next);
      setTyping(true);
      await think(300);
      setTyping(false);
      addAssistant("**Paso 4/4:** ¿Cuál es tu **plazo** objetivo?", PLAZO_CHIPS);
      return;
    }

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
      try {
        localStorage.setItem(WIZARD_LAST_KEY, JSON.stringify(done.data));
      } catch { }

      setTyping(true);
      await think(400);
      setTyping(false);

      const resumen = buildWizardSummary(done.data);
      addAssistant(
        ["✅ **Resumen de tu cotización:**", resumen, "", "¿Quieres enviarlo por WhatsApp?"].join("\n"),
        ["Enviar por WhatsApp", "Volver al inicio"]
      );
    }
  }

  async function replyTo(userText: string) {
    if (wizard.active) {
      await handleWizardInput(userText);
      return;
    }

    setTyping(true);
    await think(400);
    const t = userText.toLowerCase();

    // Detectar servicios principales
    if (t.includes("landing")) {
      setTyping(false);
      addUser(userText);
      addAssistant("Perfecto, una **Landing Page** enfocada en conversión. ¿Quieres cotizar?", [
        "Cotizar (modo guiado)",
        "Ver precios",
        "Volver al inicio",
      ]);
      return;
    }

    if (t.includes("corporativo") || t.includes("corporativa")) {
      setTyping(false);
      addUser(userText);
      addAssistant("Genial, un **Sitio Corporativo** con páginas internas. ¿Cotizamos?", [
        "Cotizar (modo guiado)",
        "Ver precios",
        "Volver al inicio",
      ]);
      return;
    }

    if (t.includes("tienda") || t.includes("ecommerce")) {
      setTyping(false);
      addUser(userText);
      addAssistant("Excelente, una **Tienda Online** con pagos. ¿Arrancamos cotización?", [
        "Cotizar (modo guiado)",
        "Ver precios",
        "Volver al inicio",
      ]);
      return;
    }

    if (t.includes("app") || t.includes("aplicación") || t.includes("aplicacion")) {
      setTyping(false);
      addUser(userText);
      addAssistant("Vamos con una **Aplicación Web** a medida. ¿Cotizamos?", [
        "Cotizar (modo guiado)",
        "Ver precios",
        "Volver al inicio",
      ]);
      return;
    }

    if (t.includes("cotiz")) {
      setTyping(false);
      addUser(userText);
      startWizard();
      return;
    }

    if (t.includes("soporte")) {
      setTyping(false);
      addUser(userText);
      addAssistant("Claro, soporte técnico ⚙️. Cuéntame el problema o abre WhatsApp.", [
        "Abrir WhatsApp",
        "Volver al inicio",
      ]);
      return;
    }

    if (t.includes("precio")) {
      setTyping(false);
      addUser(userText);
      addAssistant(
        [
          "Guía referencial:",
          "• Landing: desde $300.000",
          "• Corporativa: desde $700.000",
          "• Tienda: desde $1.200.000",
          "• App/Medida: a evaluar",
        ].join("\n"),
        ["Cotizar (modo guiado)", "Volver al inicio"]
      );
      return;
    }

    if (t.includes("volver") || t.includes("inicio")) {
      setTyping(false);
      addUser(userText);
      addAssistant("¿Qué necesitas ahora?", SERVICE_CHIPS);
      return;
    }

    if (t.includes("whatsapp")) {
      setTyping(false);
      addUser(userText);
      const waLink = wizardLast ? buildWhatsAppLink(wizardLast) : buildWhatsAppLink(null);
      window.open(waLink, "_blank");
      showToast("¡WhatsApp abierto! 🚀", "success");
      return;
    }

    setTyping(false);
    addUser(userText);
    addAssistant("Puedo ayudarte con estos servicios:", SERVICE_CHIPS);
    addAssistant("O también:", ["Cotizar (modo guiado)", "Soporte técnico", "Ver precios"]);
  }

  function send(textRaw?: string) {
    const text = (textRaw ?? input).trim();
    if (!text) return;
    setInput("");
    replyTo(text);
  }

  function buildWhatsAppLink(data: WizardData | null) {
    const text = data ? buildWizardMessage(data) : buildChatSummary(messages);
    return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
  }

  async function sendWhatsAppAndEmail() {
    if (isSending) return;
    const link = buildWhatsAppLink(wizardLast);

    // Detectar si es móvil
    const ua = navigator.userAgent || "";
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

    if (isMobile) {
      // En móvil: navegar en misma pestaña (evita pestaña vacía)
      window.location.href = link;
    } else {
      // En desktop: SOLO abrir nueva pestaña, NO navegar la actual
      const newWin = window.open(link, "_blank", "noopener,noreferrer");
      if (newWin) newWin.opener = null; // Seguridad extra
    }

    showToast("¡WhatsApp abierto! 🚀", "success");
  }

  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(WIZARD_KEY);
      localStorage.removeItem(WIZARD_LAST_KEY);
    } catch { }

    setWizard({ active: false, step: 0, data: { tipo: "", negocio: "", presupuesto: "", plazo: "" } });
    setWizardLast(null);
    setMessages([]);
    initHello();
  };

  return (
    <main style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      overflow: "hidden",
      background: "#020617",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Topbar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.5rem",
        background: "rgba(6, 12, 24, 0.95)",
        borderBottom: "1px solid rgba(173, 216, 255, 0.15)",
        backdropFilter: "blur(12px)",
        zIndex: 10,
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          ← Volver
        </button>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          color: "#eaf6ff",
          fontWeight: 900,
          fontSize: "1.1rem",
          letterSpacing: "0.3px",
        }}>
          <span style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "0 0 12px rgba(34, 197, 94, 0.6)",
          }} />
          Asistente Velocity
        </div>

        <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <button
            onClick={sendWhatsAppAndEmail}
            disabled={isSending}
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              padding: "0.65rem 1.2rem",
              borderRadius: "999px",
              fontWeight: 800,
              border: "1px solid rgba(255, 255, 255, 0.25)",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            {isSending ? "Enviando…" : "WhatsApp"}
          </button>

          <button
            onClick={clearHistory}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              padding: "0.65rem 1rem",
              borderRadius: "999px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            Borrar
          </button>
        </div>
      </div>

      {/* Fondo animado */}
      <NeonGridBackground />

      {/* Lista de mensajes */}
      <div
        ref={listRef}
        style={{
          position: "relative",
          zIndex: 5,
          overflowY: "auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} text={m.text} chips={m.chips} onChipClick={send} />
        ))}
        {typing && <Typing />}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "0.75rem",
          padding: "1rem 1.5rem",
          background: "rgba(6, 12, 24, 0.95)",
          borderTop: "1px solid rgba(173, 216, 255, 0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={wizard.active ? wizardPrompt(wizard.step) : "Escribe aquí…"}
          style={{
            height: "48px",
            borderRadius: "12px",
            padding: "0 1rem",
            color: "#eaf6ff",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(173, 216, 255, 0.28)",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          style={{
            height: "48px",
            padding: "0 1.5rem",
            borderRadius: "12px",
            border: "none",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
            background: "linear-gradient(135deg, #06b6d4, #a855f7)",
            fontSize: "1rem",
          }}
        >
          Enviar
        </button>
      </form>

      {/* Toast */}
      {toast.show && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: toast.type === "success" ? "#22c55e" : "#ef4444",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            fontWeight: 800,
            zIndex: 9999,
          }}
        >
          {toast.msg}
        </div>
      )}
    </main>
  );
}

function Bubble({ role, text, chips, onChipClick }: { role: Role; text: string; chips?: string[]; onChipClick?: (s: string) => void }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        maxWidth: "85%",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        alignSelf: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: mdToHtml(text) }}
        style={{
          borderRadius: "14px",
          padding: "1rem 1.25rem",
          lineHeight: 1.65,
          fontSize: "1rem",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
          background: isUser ? "rgba(6, 182, 212, 0.2)" : "rgba(255, 255, 255, 0.98)",
          color: isUser ? "#eaf6ff" : "#0f172a",
          border: isUser ? "1px solid rgba(6, 182, 212, 0.45)" : "1px solid rgba(15, 23, 42, 0.12)",
          borderLeft: isUser ? undefined : "3px solid #06b6d4",
        }}
      />
      {!!chips?.length && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => onChipClick?.(c)}
              style={{
                border: "1px solid rgba(15, 23, 42, 0.15)",
                borderRadius: "999px",
                padding: "0.75rem 1.25rem",
                fontWeight: 800,
                fontSize: "0.95rem",
                cursor: "pointer",
                color: "#0b1220",
                background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
                boxShadow: "0 4px 14px rgba(6, 182, 212, 0.2)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(6, 182, 212, 0.35)";
                e.currentTarget.style.background = "linear-gradient(135deg, #22d3ee, #06b6d4)";
                e.currentTarget.style.color = "#001219";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(6, 182, 212, 0.2)";
                e.currentTarget.style.background = "linear-gradient(135deg, #ffffff, #f1f5f9)";
                e.currentTarget.style.color = "#0b1220";
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Typing() {
  return (
    <div style={{
      display: "flex",
      gap: "6px",
      padding: "1rem",
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "14px",
      width: "fit-content",
    }}>
      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#06b6d4", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "-0.32s" }} />
      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#06b6d4", animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "-0.16s" }} />
      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#06b6d4", animation: "bounce 1.4s infinite ease-in-out both" }} />
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
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
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const lines = Array.from({ length: 32 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      v: 0.4 + Math.random() * 0.8,
      o: 0.08 + Math.random() * 0.15,
    }));

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(2,6,23,0.98)";
      ctx.fillRect(0, 0, w, h);

      lines.forEach((p) => {
        ctx.save();
        ctx.strokeStyle = `rgba(6, 182, 212, ${p.o})`;
        ctx.shadowColor = "rgba(6,182,212,0.2)";
        ctx.shadowBlur = 3;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 100, p.y + 100);
        ctx.stroke();
        ctx.restore();

        p.x += p.v * 0.9;
        p.y += p.v * 1;
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

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

function mdToHtml(s: string) {
  return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
}

function wizardPrompt(step: number) {
  if (step === 1) return "Ej: Landing / Corporativa / Tienda / App";
  if (step === 2) return "Ej: Restaurante, tienda…";
  if (step === 3) return "Ej: $500.000 / A definir";
  if (step === 4) return "Ej: 2 semanas / A definir";
  return "Escribe aquí…";
}

function buildChatSummary(msgs: Msg[]) {
  const lines: string[] = ["Hola, vengo desde el chat:"];
  msgs.forEach((m) => {
    const plain = m.text.replace(/<[^>]+>/g, "");
    lines.push(`${m.role === "user" ? "Yo" : "Bot"}: ${plain}`);
  });
  let text = lines.join("\n");
  if (text.length > 900) text = text.slice(0, 900) + "…";
  return text;
}

function buildWizardMessage(d: WizardData) {
  return (
    "Hola, quiero cotizar un proyecto:\n" +
    `• Tipo: ${d.tipo || "—"}\n` +
    `• Rubro/Negocio: ${d.negocio || "—"}\n` +
    `• Presupuesto: ${d.presupuesto || "—"}\n` +
    `• Plazo: ${d.plazo || "—"}`
  );
}

function buildWizardSummary(d: WizardData) {
  return [
    `• Tipo: **${d.tipo || "—"}**`,
    `• Rubro/Negocio: **${d.negocio || "—"}**`,
    `• Presupuesto: **${d.presupuesto || "—"}**`,
    `• Plazo: **${d.plazo || "—"}**`,
  ].join("\n");
}