"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { WA_PHONE } from "../config";

type Role = "assistant" | "user";
type Msg = { id: string; role: Role; text: string; chips?: string[] };
type WizardData = { tipo: string; negocio: string; presupuesto: string; plazo: string };
type WizardState = { active: boolean; step: 0 | 1 | 2 | 3 | 4; data: WizardData };

const TIPO_CHIPS = ["Landing", "Corporativa", "Tienda", "App / Medida"] as const;
const PRESUPUESTO_CHIPS = [
  "Hasta $300.000",
  "$300.000 – $700.000",
  "$700.000 – $1.500.000",
  "$1.500.000+",
  "A definir",
] as const;
const PLAZO_CHIPS = ["1–2 semanas", "3–4 semanas", "5+ semanas", "A definir"] as const;

const INITIAL_MAIN_CHIPS = [
  "Landing Page",
  "Aplicación Web",
  "Tienda Online",
  "Sitio Corporativo",
] as const;

const OTHERS_CHIPS = [
  "Soporte & Mantención",
  "SEO & Performance",
  "Cotizar (modo guiado)",
  "Ver precios",
] as const;

const isMobile = () =>
  typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function ChatDock() {
  const [mounted, setMounted] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const [wizard, setWizard] = useState<WizardState>({
    active: false,
    step: 0,
    data: { tipo: "", negocio: "", presupuesto: "", plazo: "" },
  });

  const listRef = useRef<HTMLDivElement | null>(null);

  /* Mount portal once */
  useEffect(() => {
    setMounted(true);
    let el = document.getElementById("vc-root") as HTMLElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = "vc-root";
      document.body.appendChild(el);
    }
    setPortalEl(el);
  }, []);

  /* Ajuste de viewport móvil para evitar saltos con el teclado */
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);
    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  /* Mensaje inicial */
  useEffect(() => {
    if (!mounted) return;
    if (messages.length === 0) {
      pushHello();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  /* Lock scroll al abrir y reset de badge */
  useEffect(() => {
    const prev = document.body.style.overflow;

    document.body.style.overflow = open ? "hidden" : (prev || "");
    if (open) setUnread(0);

    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  /* Autoscroll */
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  /* Helpers */
  function addAssistant(text: string, chips?: string[]) {
    setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", text, chips }]);
    if (!open) setUnread((n) => Math.min(9, n + 1));
  }

  function addUser(text: string) {
    setMessages((p) => [...p, { id: crypto.randomUUID(), role: "user", text }]);
  }

  function pushHello() {
    const oneLine = "Hola 👋 ¿Cómo te ayudo hoy? Elige una opción:";
    addAssistant(oneLine, [...INITIAL_MAIN_CHIPS, "Otros…"]);
  }

  function resetChat(scrollTop = false) {
    setWizard({ active: false, step: 0, data: { tipo: "", negocio: "", presupuesto: "", plazo: "" } });
    setMessages([]);
    setTimeout(() => pushHello(), 0);
    if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startWizard() {
    setWizard({
      active: true,
      step: 1,
      data: { tipo: "", negocio: "", presupuesto: "", plazo: "" },
    });
    addAssistant("**Paso 1/4:** ¿Qué tipo de proyecto necesitas?", [...TIPO_CHIPS]);
  }

  function showPricing() {
    addAssistant(
      [
        "**Guía referencial de precios:**",
        "• Landing Page: **$150.000 – $280.000**",
        "• Sitio Corporativo: **$350.000 – $650.000**",
        "• Tienda Online: **$600.000 – $1.200.000**",
        "• Aplicación Web: **$900.000 – $2.000.000**",
        "",
        "¿Seguimos con una cotización guiada?",
      ].join("\n"),
      ["Cotizar (modo guiado)", "Volver al inicio"]
    );
  }

  const waText = useMemo(
    () => buildWizardMessageOrSummary(wizard.data, messages),
    [wizard.data, messages]
  );
  const phone = WA_PHONE || "56912345678";
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;

  // Confirmación simple + “Volver al inicio”
  const openWhatsApp = () => {
    if (isMobile()) {
      window.location.href = waLink; // misma pestaña en móvil
    } else {
      window.open(waLink, "_blank", "noopener,noreferrer"); // nueva pestaña en desktop
    }
    addAssistant("✅ Mensaje enviado por WhatsApp.", ["Volver al inicio"]);
  };

  async function handleWizardInput(text: string) {
    const step = wizard.step;
    const lower = text.toLowerCase();

    if (lower.includes("whatsapp")) {
      openWhatsApp();
      return;
    }
    if (lower.includes("volver") || lower.includes("inicio") || lower === "menú" || lower === "menu") {
      resetChat(true);
      return;
    }

    if (step === 1) {
      let tipo = text;
      if (lower.includes("landing")) tipo = "Landing";
      else if (lower.includes("corpor")) tipo = "Corporativa";
      else if (lower.includes("tienda")) tipo = "Tienda";
      else if (lower.includes("app")) tipo = "App / Medida";
      setWizard((w) => ({ ...w, step: 2, data: { ...w.data, tipo } }));
      addAssistant("**Paso 2/4:** Cuéntame el **rubro o negocio** (ej: restaurante, tienda…).");
      return;
    }

    if (step === 2) {
      const negocio = text || "No especificado";
      setWizard((w) => ({ ...w, step: 3, data: { ...w.data, negocio } }));
      addAssistant("**Paso 3/4:** ¿Cuál es tu **presupuesto estimado**?", [...PRESUPUESTO_CHIPS]);
      return;
    }

    if (step === 3) {
      let presupuesto = text;
      if (lower.includes("hasta")) presupuesto = "Hasta $300.000";
      else if (lower.includes("700")) presupuesto = "$300.000 – $700.000";
      else if (lower.includes("1.500") || lower.includes("1500"))
        presupuesto = "$700.000 – $1.500.000";
      else if (lower.includes("+") || lower.includes("1.5") || lower.includes("más") || lower.includes("mas"))
        presupuesto = "$1.500.000+";
      else if (lower.includes("defin")) presupuesto = "A definir";
      setWizard((w) => ({ ...w, step: 4, data: { ...w.data, presupuesto } }));
      addAssistant("**Paso 4/4:** ¿Cuál es tu **plazo** objetivo?", [...PLAZO_CHIPS]);
      return;
    }

    if (step === 4) {
      let plazo = text;
      if (lower.includes("1") || lower.includes("2")) plazo = "1–2 semanas";
      else if (lower.includes("3") || lower.includes("4")) plazo = "3–4 semanas";
      else if (lower.includes("5") || lower.includes("+")) plazo = "5+ semanas";
      else if (lower.includes("defin")) plazo = "A definir";
      const data = { ...wizard.data, plazo };
      setWizard({ active: false, step: 0, data });
      const resumen = buildWizardSummary(data);
      // ⬇️ Aquí quitamos “Volver al inicio” para evitar duplicado antes de enviar
      addAssistant(["✅ **Cotización lista:**", resumen, "", "¿La enviamos por WhatsApp?"].join("\n"), [
        "Enviar por WhatsApp",
      ]);
      return;
    }
  }

  async function send(textRaw?: string) {
    const t = (textRaw ?? input).trim();
    if (!t) return;
    setInput("");
    addUser(t);

    const lower = t.toLowerCase();

    // Acciones globales
    if (lower.includes("volver") || lower.includes("inicio") || lower === "menú" || lower === "menu") {
      resetChat(true);
      return;
    }
    if (lower.includes("whatsapp")) {
      openWhatsApp();
      return;
    }

    // Wizard
    if (wizard.active) {
      await handleWizardInput(t);
      return;
    }

    // Rutas por chips principales
    if (lower === "otros…" || lower === "otros" || lower.includes("otros")) {
      addAssistant("¿Qué necesitas?", [...OTHERS_CHIPS, "Volver al inicio"]);
      return;
    }

    if (lower.includes("cotiz")) {
      startWizard();
      return;
    }

    if (lower.includes("ver precios") || lower.includes("precio")) {
      showPricing();
      return;
    }

    if (lower.includes("soporte")) {
      addAssistant(
        "Perfecto. **Soporte & Mantención** ⚙️: cuéntame el problema o abrimos contacto.",
        ["Enviar por WhatsApp", "Volver al inicio"]
      );
      return;
    }

    if (lower.includes("seo") || lower.includes("performance")) {
      addAssistant(
        "Podemos mejorar **SEO & Performance** (Core Web Vitals, auditoría técnica, contenido/Schema).",
        ["Cotizar (modo guiado)", "Volver al inicio"]
      );
      return;
    }

    if (lower.includes("landing")) {
      setWizard({ active: true, step: 2, data: { tipo: "Landing", negocio: "", presupuesto: "", plazo: "" } });
      addAssistant("Perfecto: **Landing Page**.\n**Paso 2/4:** ¿Cuál es tu **rubro o negocio**?");
      return;
    }

    if (lower.includes("aplicación") || lower.includes("aplicacion") || lower.includes("app")) {
      setWizard({ active: true, step: 2, data: { tipo: "App / Medida", negocio: "", presupuesto: "", plazo: "" } });
      addAssistant("Perfecto: **Aplicación Web**.\n**Paso 2/4:** ¿Cuál es tu **rubro o negocio**?");
      return;
    }

    if (lower.includes("tienda") || lower.includes("ecommerce")) {
      setWizard({ active: true, step: 2, data: { tipo: "Tienda", negocio: "", presupuesto: "", plazo: "" } });
      addAssistant("Perfecto: **Tienda Online**.\n**Paso 2/4:** ¿Cuál es tu **rubro o negocio**?");
      return;
    }

    if (lower.includes("corporativo") || lower.includes("corporativa") || lower.includes("sitio")) {
      setWizard({ active: true, step: 2, data: { tipo: "Corporativa", negocio: "", presupuesto: "", plazo: "" } });
      addAssistant("Perfecto: **Sitio Corporativo**.\n**Paso 2/4:** ¿Cuál es tu **rubro o negocio**?");
      return;
    }

    // Acciones directas por botón “Enviar por WhatsApp”
    if (lower.includes("enviar por whatsapp")) {
      openWhatsApp();
      return;
    }

    // Fallback: volver a menú
    addAssistant("Te dejo las opciones:", [...INITIAL_MAIN_CHIPS, "Otros…", "Volver al inicio"]);
  }

  const UI = (
    <div className="vc-root" aria-live="polite">
      {/* FAB */}
      {!open && (
        <button
          className="vc-fab"
          onClick={() => setOpen(true)}
          aria-label="Abrir chat"
          title="Chat"
        >
          <span className="vc-fab-icon">
            <RobotIcon />
          </span>
          {unread > 0 && <span className="vc-badge">{unread >= 9 ? "9+" : unread}</span>}
        </button>
      )}

      {/* Overlay */}
      <div className={`vc-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      {/* Dock */}
      <aside className={`vc-dock ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Chat Velocity">
        <header className="vc-head">
          <div className="vc-brand">
            <span className="vc-avatar"><RobotIcon /></span>
            <span>Velocity Chat</span>
          </div>
          <button className="vc-x" onClick={() => setOpen(false)} aria-label="Cerrar chat">✕</button>
        </header>

        <div className="vc-body" ref={listRef} role="log" aria-live="polite">
          {messages.map((m) => (
            <Bubble
              key={m.id}
              role={m.role}
              text={m.text}
              chips={m.chips}
              onChipClick={(c) => {
                const t = c.toLowerCase();
                if (t.includes("whatsapp")) openWhatsApp();
                else if (t.includes("volver")) resetChat(true);
                else send(c);
              }}
            />
          ))}
        </div>

        <form
          className="vc-inputbar"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            className="vc-input"
            placeholder={wizard.active ? placeholderByStep(wizard.step) : "Escribe tu mensaje..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Mensaje"
          />
          <button className="vc-send" type="submit" aria-label="Enviar">→</button>
        </form>
      </aside>

      {/* ESTILOS */}
      <style jsx global>{`
        .vc-root * { box-sizing: border-box !important; font-family: Inter, system-ui, -apple-system, Segoe UI, sans-serif !important; }
        :root { 
          --neo1: #8b5cf6;
          --neo2: #06b6d4;
          --glass: rgba(15, 23, 42, 0.95);
          --bg-primary: #0f172a;
          --text-primary: #f1f5f9;
          --text-secondary: #cbd5e1;
        }

        /* === FAB IZQUIERDA ABAJO === */
        .vc-fab{
          position: fixed !important;
          left: 20px !important;
          bottom: 20px !important;
          width: 60px !important;
          height: 60px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, var(--neo1), var(--neo2)) !important;
          border: 2px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2) !important;
          display: grid !important;
          place-items: center !important;
          cursor: pointer !important;
          z-index: 2147483000 !important;
          transition: all 0.25s ease !important;
        }
        .vc-fab:hover{ transform: translateY(-2px) scale(1.05) !important; }
        .vc-fab-icon svg{ width: 24px !important; height: 24px !important; filter: brightness(0) invert(1) !important; }

        .vc-badge{
          position: absolute !important;
          top: -4px !important;
          right: -4px !important;
          width: 20px !important;
          height: 20px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #ef4444, #dc2626) !important;
          color: #fff !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          display: grid !important;
          place-items: center !important;
          border: 2px solid var(--bg-primary) !important;
        }

        /* === OVERLAY (cursor visible) === */
        .vc-overlay{
          position: fixed !important;
          inset: 0 !important;
          backdrop-filter: blur(8px) !important;
          background: rgba(3,7,18,0.6) !important;
          opacity: 0 !important;
          pointer-events: none !important;
          transition: opacity .25s ease !important;
          z-index: 2147482998 !important;
          cursor: default !important;
        }
        .vc-overlay.show{ opacity: 1 !important; pointer-events: auto !important; }

        /* === DOCK (Desktop) pegado izquierda/abajo y 100% oculto al cerrar === */
        .vc-dock{
          position: fixed !important;
          left: 20px !important;
          bottom: 20px !important;
          top: auto !important;
          transform: translateX(-110%) !important; /* fuera de pantalla */
          width: min(380px, 85vw) !important;
          height: min(640px, 80dvh) !important; /* usa dvh moderno */
          background: var(--glass) !important;
          color: var(--text-primary) !important;
          backdrop-filter: blur(20px) saturate(180%) !important;
          border: 1px solid rgba(255,255,255,.1) !important;
          border-radius: 16px !important;
          box-shadow: 0 25px 50px rgba(0,0,0,.25) !important;
          z-index: 2147482999 !important;
          display: grid !important;
          grid-template-rows: auto 1fr auto !important;
          overflow: hidden !important;
          transition: transform .28s cubic-bezier(.4,0,.2,1) !important;
          cursor: default !important;
        }
        .vc-dock.open{ transform: translateX(0) !important; }

        .vc-head{
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 14px 16px !important;
          background: rgba(30,41,59,.5) !important;
          border-bottom: 1px solid rgba(255,255,255,.08) !important;
        }
        .vc-brand{ display: inline-flex !important; align-items: center !important; gap: 8px !important; font-weight: 800 !important; }
        .vc-avatar{ width: 24px !important; height: 24px !important; border-radius: 50% !important; display: grid !important; place-items: center !important; background: linear-gradient(135deg, var(--neo1), var(--neo2)) !important; }
        .vc-avatar svg{ width: 14px !important; height: 14px !important; filter: brightness(0) invert(1) !important; }
        .vc-x{ width: 30px !important; height: 30px !important; border-radius: 8px !important; background: rgba(255,255,255,.1) !important; color: var(--text-primary) !important; border: none !important; cursor: pointer !important; }
        .vc-x:hover{ background: rgba(255,255,255,.16) !important; }

        .vc-body{
          padding: 12px !important;
          overflow-y: auto !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }

        .vc-inputbar{
          display: flex !important; gap: 10px !important; padding: 12px !important;
          background: rgba(30,41,59,.5) !important; border-top: 1px solid rgba(255,255,255,.08) !important;
        }
        .vc-input{
          flex: 1 !important; height: 44px !important; border-radius: 12px !important; padding: 0 14px !important;
          background: rgba(255,255,255,.08) !important; border: 1px solid rgba(255,255,255,.15) !important;
          color: var(--text-primary) !important; font-size: .95rem !important;
        }
        .vc-input::placeholder{ color: var(--text-secondary) !important; }
        .vc-send{
          width: 44px !important; height: 44px !important; border-radius: 12px !important;
          background: linear-gradient(135deg, var(--neo1), var(--neo2)) !important; color: #fff !important;
          font-weight: 800 !important; border: none !important; cursor: pointer !important;
        }

        /* Burbujas */
        .vc-bubble{ display: flex !important; flex-direction: column !important; max-width: 85% !important; }
        .vc-assistant{ align-self: flex-start !important; }
        .vc-user{ align-self: flex-end !important; }
        .vc-inner{
          border-radius: 16px !important; padding: 12px 14px !important; line-height: 1.55 !important; font-size: .96rem !important; white-space: pre-wrap !important;
        }
        .vc-assistant .vc-inner{
          background: rgba(255,255,255,.98) !important; color: #0f172a !important; border: 1px solid rgba(15,23,42,.12) !important; border-bottom-left-radius: 4px !important;
        }
        .vc-user .vc-inner{
          background: linear-gradient(135deg, var(--neo1), var(--neo2)) !important; color: #fff !important;
          border: 1px solid rgba(255,255,255,.22) !important; border-bottom-right-radius: 4px !important;
        }

        /* Chips 2 por fila (premium oval) */
        .vc-chips{ display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px !important; margin-top: 8px !important; }
        .vc-chip{
          border: none !important; border-radius: 999px !important; padding: 10px 14px !important; font-size: .9rem !important; font-weight: 800 !important; cursor: pointer !important;
          background: linear-gradient(180deg, #ffffff, #f1f5f9) !important; color: #0b1220 !important; border: 1px solid rgba(15,23,42,.12) !important; text-align: center !important;
          transition: transform .15s ease, box-shadow .2s ease, filter .2s ease !important;
        }
        .vc-chip:hover{ transform: translateY(-1px) !important; box-shadow: 0 6px 20px rgba(6,182,212,.25) !important; filter: brightness(1.02) !important; }
        .vc-chip.whatsapp-chip{
          grid-column: 1 / -1 !important; background: linear-gradient(135deg, #22c55e, #16a34a) !important; color: #fff !important; border: 1px solid rgba(34,197,94,.35) !important;
        }

        /* Mobile: sheet abajo, usa --vh */
        @media (max-width: 768px) {
          .vc-dock{
            left: 50% !important;
            bottom: 0 !important;
            top: auto !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: calc(var(--vh, 1vh) * 90) !important;
            border-radius: 16px 16px 0 0 !important;
            transform: translate(-50%, 110%) !important; /* oculto por completo */
          }
          .vc-dock.open{ transform: translate(-50%, 0) !important; }
          .vc-fab{ left: 16px !important; bottom: 16px !important; width: 56px !important; height: 56px !important; }
          .vc-chips{ grid-template-columns: 1fr !important; }
          .vc-chip{ font-size: .88rem !important; padding: 9px 12px !important; }
        }

        /* Scrollbar */
        .vc-body::-webkit-scrollbar{ width: 6px !important; }
        .vc-body::-webkit-scrollbar-thumb{ background: rgba(255,255,255,.25) !important; border-radius: 3px !important; }
      `}</style>
    </div>
  );

  if (!mounted || !portalEl) return null;
  return createPortal(UI, portalEl);
}

/* ===== Subcomponentes ===== */
function Bubble({
  role,
  text,
  chips,
  onChipClick,
}: {
  role: Role;
  text: string;
  chips?: string[];
  onChipClick?: (c: string) => void;
}) {
  const isAssistant = role === "assistant";
  return (
    <div className={`vc-bubble ${isAssistant ? "vc-assistant" : "vc-user"}`}>
      <div className="vc-inner" dangerouslySetInnerHTML={{ __html: md(text) }} />
      {!!chips?.length && (
        <div className="vc-chips">
          {chips.map((c) => (
            <button
              key={c}
              className={`vc-chip ${c.toLowerCase().includes("whatsapp") ? "whatsapp-chip" : ""}`}
              onClick={() => onChipClick?.(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RobotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="2" fill="rgba(255,255,255,.1)" />
      <circle cx="9" cy="13" r="2" fill="currentColor" />
      <circle cx="15" cy="13" r="2" fill="currentColor" />
      <rect x="10.5" y="3" width="3" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

/* ===== Utils ===== */
function md(s: string) {
  return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
}
function placeholderByStep(step: number) {
  if (step === 1) return "Elige tipo de proyecto...";
  if (step === 2) return "Describe tu rubro o negocio...";
  if (step === 3) return "Selecciona presupuesto...";
  if (step === 4) return "Indica plazo estimado...";
  return "Escribe tu mensaje...";
}
function buildWizardSummary(d: WizardData) {
  return [
    `• Tipo: **${d.tipo || "—"}**`,
    `• Rubro/Negocio: **${d.negocio || "—"}**`,
    `• Presupuesto: **${d.presupuesto || "—"}**`,
    `• Plazo: **${d.plazo || "—"}**`,
  ].join("\n");
}
function buildWizardMessageOrSummary(d: WizardData, msgs: Msg[]) {
  const hasWizard = d.tipo || d.negocio || d.presupuesto || d.plazo;
  if (!hasWizard && msgs.length) {
    const MAX = 900;
    const lines = ["Hola, vengo desde el chat de la web. Resumen:"];
    msgs.forEach((m) => lines.push(`${m.role === "user" ? "Yo" : "Asistente"}: ${m.text}`));
    let txt = lines.join("\n");
    if (txt.length > MAX) txt = txt.slice(0, MAX) + "…";
    return txt;
  }
  return (
    "Hola, quiero cotizar un proyecto:\n" +
    `• Tipo: ${d.tipo || "—"}\n` +
    `• Rubro/Negocio: ${d.negocio || "—"}\n` +
    `• Presupuesto: ${d.presupuesto || "—"}\n` +
    `• Plazo: ${d.plazo || "—"}`
  );
}
