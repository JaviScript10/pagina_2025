"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { WA_PHONE } from "../config";

type Role = "assistant" | "user";
type Msg = { id: string; role: Role; text: string; chips?: string[] };
type WizardData = { tipo: string; negocio: string; presupuesto: string; plazo: string };
type WizardState = { active: boolean; step: 0 | 1 | 2 | 3 | 4; data: WizardData };

/* ===== Opciones de UI ===== */
const SERVICE_CHIPS = [
  "Landing Page",
  "Aplicación Web",
  "Tienda Online",
  "Sitio Corporativo",
  "Otros",
];

const EXTRA_CHIPS = [
  "Soporte & Mantención",
  "SEO & Performance",
  "Cotizar (modo guiado)",
  "Ver precios",
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

export default function ChatDock() {
  const [mounted, setMounted] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(0);
  const [wizard, setWizard] = useState<WizardState>({
    active: false,
    step: 0,
    data: { tipo: "", negocio: "", presupuesto: "", plazo: "" },
  });

  const listRef = useRef<HTMLDivElement | null>(null);

  /* ===== Montaje y portal ===== */
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

  /* ===== Mensaje inicial ===== */
  useEffect(() => {
    if (!mounted) return;
    if (messages.length === 0) {
      addAssistant("Hola 👋 ¿Cómo te ayudo hoy? Elige una opción:", SERVICE_CHIPS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  /* ===== Lock scroll al abrir y reset de badge ===== */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : (prev || "");
    if (open) setUnread(0);
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  /* ===== Autoscroll ===== */
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  /* ===== Helpers ===== */
  function addAssistant(text: string, chips?: string[]) {
    setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", text, chips }]);
    if (!open) setUnread((n) => Math.min(9, n + 1));
  }
  function addUser(text: string) {
    setMessages((p) => [...p, { id: crypto.randomUUID(), role: "user", text }]);
  }

  const waText = useMemo(
    () => buildWizardMessageOrSummary(wizard.data, messages),
    [wizard.data, messages]
  );
  const phone = WA_PHONE || "56912345678";
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;

  /* ✅ FIX WHATSAPP: abrir en pestaña nueva sin cambiar esta */
  function openWhatsAppSafe(waUrl: string, e?: React.MouseEvent | Event) {
    try {
      if (e) {
        // @ts-ignore
        if (e.preventDefault) e.preventDefault();
        // @ts-ignore
        if (e.stopPropagation) e.stopPropagation();
      }
      const win = window.open(waUrl, "_blank", "noopener,noreferrer");
      if (win) win.opener = null;
    } catch {
      // fallback menor: copiar URL
      // @ts-ignore
      navigator.clipboard?.writeText(waUrl).catch(() => { });
    }
  }

  function resetChat(scrollTop = false) {
    setWizard({ active: false, step: 0, data: { tipo: "", negocio: "", presupuesto: "", plazo: "" } });
    setMessages([]);
    setTimeout(() => {
      addAssistant("Hola 👋 ¿Cómo te ayudo hoy? Elige una opción:", SERVICE_CHIPS);
    }, 0);
    if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startWizard() {
    setWizard({ active: true, step: 1, data: { tipo: "", negocio: "", presupuesto: "", plazo: "" } });
    addAssistant("**Paso 1/4:** ¿Qué tipo de proyecto necesitas?", TIPO_CHIPS);
  }

  function showExtras() {
    addAssistant("Selecciona una opción adicional:", EXTRA_CHIPS);
  }

  function showPricing() {
    addAssistant(
      [
        "**Guía de precios referencial:**",
        "• Landing Page: **$150.000 – $280.000**",
        "• Sitio Corporativo: **$350.000 – $650.000**",
        "• Tienda Online: **$600.000 – $1.200.000**",
        "• Aplicación Web: **$900.000 – $2.000.000**",
        "",
        "¿Te interesa alguna opción?",
      ].join("\n"),
      ["Cotizar (modo guiado)", "Landing Page", "Tienda Online", "Volver al inicio"]
    );
  }

  /* ===== Envío ===== */
  async function send(textRaw?: string) {
    const t = (textRaw ?? input).trim();
    if (!t) return;
    setInput("");
    addUser(t);

    const lower = t.toLowerCase();

    // botón global "Enviar por WhatsApp"
    if (lower.includes("enviar por whatsapp")) {
      openWhatsAppSafe(waLink);
      addAssistant("✅ Mensaje enviado por WhatsApp.", ["Volver al inicio"]);
      return;
    }

    // volver al menú
    if (lower.includes("volver")) {
      resetChat(true);
      return;
    }

    // flujo wizard
    if (wizard.active) {
      await handleWizardInput(t);
      return;
    }

    // servicios
    if (lower.includes("landing")) {
      setWizard({ active: true, step: 2, data: { tipo: "Landing", negocio: "", presupuesto: "", plazo: "" } });
      addAssistant("Perfecto: **Landing Page**.\n**Paso 2/4:** ¿Cuál es tu **rubro o negocio**?");
      return;
    }
    if (lower.includes("aplicación") || lower.includes("aplicacion") || lower.includes("app")) {
      setWizard({ active: true, step: 2, data: { tipo: "Aplicación Web", negocio: "", presupuesto: "", plazo: "" } });
      addAssistant("Perfecto: **Aplicación Web**.\n**Paso 2/4:** ¿Cuál es tu **rubro o negocio**?");
      return;
    }
    if (lower.includes("tienda")) {
      setWizard({ active: true, step: 2, data: { tipo: "Tienda Online", negocio: "", presupuesto: "", plazo: "" } });
      addAssistant("Perfecto: **Tienda Online**.\n**Paso 2/4:** ¿Cuál es tu **rubro o negocio**?");
      return;
    }
    if (lower.includes("corporativo") || lower.includes("corporativa")) {
      setWizard({ active: true, step: 2, data: { tipo: "Sitio Corporativo", negocio: "", presupuesto: "", plazo: "" } });
      addAssistant("Perfecto: **Sitio Corporativo**.\n**Paso 2/4:** ¿Cuál es tu **rubro o negocio**?");
      return;
    }
    if (lower.includes("otros")) {
      showExtras();
      return;
    }

    // extras
    if (lower.includes("soporte")) {
      addAssistant(
        "Para **Soporte & Mantención**, cuéntame el problema o abre contacto directo:",
        ["Abrir WhatsApp", "Volver al inicio"]
      );
      return;
    }
    if (lower.includes("seo")) {
      addAssistant("Ofrecemos **SEO & Performance**. ¿Quieres cotizar?", [
        "Cotizar (modo guiado)",
        "Volver al inicio",
      ]);
      return;
    }
    if (lower.includes("precio")) {
      showPricing();
      return;
    }
    if (lower.includes("cotiz")) {
      startWizard();
      return;
    }
    if (lower.includes("whatsapp") || lower.includes("abrir whatsapp")) {
      openWhatsAppSafe(waLink);
      return;
    }

    addAssistant("Puedo ayudarte con:", SERVICE_CHIPS);
  }

  /* ===== Wizard ===== */
  async function handleWizardInput(text: string) {
    const step = wizard.step;
    const lower = text.toLowerCase();

    if (step === 1) {
      let tipo = text;
      if (lower.includes("landing")) tipo = "Landing";
      else if (lower.includes("corpor")) tipo = "Corporativa";
      else if (lower.includes("tienda")) tipo = "Tienda";
      else if (lower.includes("app")) tipo = "App / Medida";
      setWizard((w) => ({ ...w, step: 2, data: { ...w.data, tipo } }));
      addAssistant("**Paso 2/4:** Cuéntame el **rubro o negocio** (ej: restaurante, tienda, consultora…).");
      return;
    }
    if (step === 2) {
      const negocio = text || "No especificado";
      setWizard((w) => ({ ...w, step: 3, data: { ...w.data, negocio } }));
      addAssistant("**Paso 3/4:** ¿Cuál es tu **presupuesto estimado**?", PRESUPUESTO_CHIPS);
      return;
    }
    if (step === 3) {
      let presupuesto = text;
      if (lower.includes("hasta")) presupuesto = "Hasta $300.000";
      else if (lower.includes("700")) presupuesto = "$300.000 – $700.000";
      else if (lower.includes("1.500") || lower.includes("1500")) presupuesto = "$700.000 – $1.500.000";
      else if (lower.includes("+") || lower.includes("mas") || lower.includes("más")) presupuesto = "$1.500.000+";
      else if (lower.includes("defin")) presupuesto = "A definir";
      setWizard((w) => ({ ...w, step: 4, data: { ...w.data, presupuesto } }));
      addAssistant("**Paso 4/4:** ¿Cuál es tu **plazo** objetivo?", PLAZO_CHIPS);
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

      // Al terminar, SOLO mostrar “Enviar por WhatsApp”
      addAssistant(
        ["✅ **Cotización lista:**", resumen, "", "¿Deseas enviarla por WhatsApp?"].join("\n"),
        ["Enviar por WhatsApp"]
      );
      return;
    }
  }

  /* ===== UI ===== */
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
          <span className="vc-fab-icon"><RobotIcon /></span>
          {unread > 0 && <span className="vc-badge">{unread >= 9 ? "9+" : unread}</span>}
        </button>
      )}

      {/* Overlay */}
      <div className={`vc-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      {/* Dock */}
      <aside className={`vc-dock ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Chat Velocity">
        <header className="vc-head">
          <div className="vc-brand">
            <span className="vc-avatar brand"><RobotIcon /></span>
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
                if (c === "Abrir WhatsApp" || c === "Enviar por WhatsApp") {
                  openWhatsAppSafe(waLink);
                  if (c === "Enviar por WhatsApp") {
                    addAssistant("✅ Mensaje enviado por WhatsApp.", ["Volver al inicio"]);
                  }
                } else if (c === "Volver al inicio") {
                  resetChat(true);
                } else if (c === "Otros") {
                  showExtras();
                } else {
                  send(c);
                }
              }}
            />
          ))}
        </div>

        <form
          className="vc-inputbar"
          onSubmit={(e) => { e.preventDefault(); send(); }}
        >
          <input
            className="vc-input"
            placeholder={wizard.active ? placeholderByStep(wizard.step) : "Escribe tu mensaje..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Mensaje"
          />
          <button className="vc-send" type="submit">→</button>
        </form>
      </aside>

      {/* ==== ESTILOS (GLOBAL EN EL COMPONENTE) ==== */}
      <style jsx global>{`
        .vc-root * { box-sizing: border-box !important; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif !important; }
        :root{
          --neo1:#8b5cf6; --neo2:#06b6d4;
          --glass:rgba(15,23,42,.95);
          --bg:#0b1324; --text:#f1f5f9; --text-2:#cbd5e1;
        }

        /* FAB a la IZQUIERDA/ABAJO */
        .vc-fab{
          position:fixed; left:18px; bottom:18px;
          width:60px; height:60px; border-radius:999px;
          display:grid; place-items:center; cursor:pointer;
          background:linear-gradient(135deg,var(--neo1),var(--neo2));
          border:2px solid rgba(255,255,255,.2);
          box-shadow:0 10px 30px rgba(139,92,246,.35), 0 4px 12px rgba(0,0,0,.3);
          z-index:2147483000; transition:transform .25s ease, box-shadow .25s ease;
        }
        .vc-fab:hover{ transform:translateY(-2px) scale(1.05); box-shadow:0 14px 40px rgba(139,92,246,.45), 0 6px 16px rgba(0,0,0,.35); }
        .vc-fab-icon svg{ width:24px; height:24px; filter:brightness(0) invert(1); }
        .vc-badge{ position:absolute; top:-4px; right:-4px; width:20px; height:20px; border-radius:999px; background:linear-gradient(135deg,#ef4444,#dc2626); color:#fff; font-size:10px; font-weight:900; display:grid; place-items:center; border:2px solid var(--bg); }

        /* Overlay con cursor visible */
        .vc-overlay{ position:fixed; inset:0; background:rgba(3,7,18,.55); backdrop-filter:blur(6px); opacity:0; pointer-events:none; transition:opacity .25s ease; z-index:2147482998; cursor:pointer; }
        .vc-overlay.show{ opacity:1; pointer-events:auto; }

        /* Dock COMPACTO pegado izquierda/abajo (desktop) */
        .vc-dock{
          position:fixed;
          left:18px; bottom:18px;
          width:min(380px,86vw);
          height:min(620px,78vh);
          transform:translateX(-110%); /* totalmente oculto sin “asomar” */
          background:var(--glass); backdrop-filter:blur(18px) saturate(160%);
          border:1px solid rgba(255,255,255,.12);
          border-radius:18px;
          box-shadow:0 24px 60px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.06) inset;
          z-index:2147482999;
          display:grid; grid-template-rows:auto 1fr auto;
          transition:transform .32s cubic-bezier(.4,.0,.2,1);
          overflow:hidden;
        }
        .vc-dock.open{ transform:translateX(0); }

        /* Mobile: bottom-sheet */
        @media (max-width: 768px){
          .vc-dock{
            left:50%; bottom:0; width:100vw; height:88vh;
            transform:translate(-50%,100%);
            border-radius:16px 16px 0 0;
          }
          .vc-dock.open{ transform:translate(-50%,0); }
          .vc-fab{ left:16px; bottom:16px; width:56px; height:56px; }
        }

        .vc-head{
          display:flex; align-items:center; justify-content:space-between;
          padding:14px 16px; background:rgba(30,41,59,.5);
          border-bottom:1px solid rgba(255,255,255,.1);
          color:var(--text);
        }
        .vc-brand{ display:flex; align-items:center; gap:10px; font-weight:800; font-size:1.05rem; letter-spacing:.2px; }
        .vc-avatar{ width:24px; height:24px; border-radius:999px; display:grid; place-items:center; background:linear-gradient(135deg,var(--neo1),var(--neo2)); }
        .vc-avatar svg{ width:14px; height:14px; filter:brightness(0) invert(1); }
        .vc-x{ width:32px; height:32px; border-radius:10px; background:rgba(255,255,255,.12); color:#fff; border:0; cursor:pointer; display:grid; place-items:center; }
        .vc-x:hover{ background:rgba(255,255,255,.18); }

        .vc-body{ padding:14px; overflow:auto; display:flex; flex-direction:column; gap:10px; }

        .vc-inputbar{ display:flex; gap:10px; padding:14px 16px; background:rgba(30,41,59,.5); border-top:1px solid rgba(255,255,255,.1); }
        .vc-input{
          flex:1; height:44px; border-radius:12px; padding:0 14px;
          background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.18);
          color:var(--text); font-size:.95rem;
        }
        .vc-input::placeholder{ color:var(--text-2); }
        .vc-send{
          width:44px; height:44px; border-radius:12px;
          background:linear-gradient(135deg,var(--neo1),var(--neo2));
          color:#fff; border:0; font-weight:800; cursor:pointer;
        }
        .vc-send:hover{ box-shadow:0 6px 18px rgba(139,92,246,.35); }

        /* Burbujas */
        .vc-bubble{ display:flex; flex-direction:column; max-width:86%; }
        .vc-assistant{ align-self:flex-start; }
        .vc-user{ align-self:flex-end; }
        .vc-inner{
          border-radius:18px; padding:10px 14px; line-height:1.5; font-size:.95rem; white-space:pre-wrap; word-break:break-word;
        }
        .vc-assistant .vc-inner{
          background:rgba(255,255,255,.96); color:#1e293b;
          border:1px solid rgba(255,255,255,.22);
          border-bottom-left-radius:6px;
        }
        .vc-user .vc-inner{
          background:linear-gradient(135deg,var(--neo1),var(--neo2));
          color:#fff; border:1px solid rgba(255,255,255,.2);
          border-bottom-right-radius:6px;
        }

        /* Chips: 2 por fila en desktop, 1 en móvil */
        .vc-chips{ display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; }
        @media (max-width:768px){ .vc-chips{ grid-template-columns:1fr; } }
        .vc-chip{
          border:0; border-radius:999px; padding:10px 14px;
          background:rgba(255,255,255,.1); color:var(--text);
          border:1px solid rgba(255,255,255,.2);
          font-weight:700; font-size:.9rem; text-align:center; cursor:pointer;
          backdrop-filter:blur(10px);
        }
        .vc-chip:hover{ background:rgba(255,255,255,.16); transform:translateY(-1px); }

        .vc-chip.whatsapp-chip{
          background:linear-gradient(135deg,#22c55e,#16a34a);
          color:#fff; border:1px solid rgba(34,197,94,.32);
          grid-column:1 / -1;
        }
        .vc-chip.whatsapp-chip:hover{
          background:linear-gradient(135deg,#16a34a,#15803d);
          box-shadow:0 6px 18px rgba(34,197,94,.32);
        }

        /* Scrollbar */
        .vc-body::-webkit-scrollbar{ width:6px; }
        .vc-body::-webkit-scrollbar-thumb{ background:rgba(255,255,255,.22); border-radius:3px; }
        .vc-body::-webkit-scrollbar-track{ background:rgba(255,255,255,.06); border-radius:3px; }
      `}</style>
    </div>
  );

  if (!mounted || !portalEl) return null;
  return createPortal(UI, portalEl);
}

/* ===== Subcomponentes ===== */
function Bubble({
  role, text, chips, onChipClick,
}: { role: Role; text: string; chips?: string[]; onChipClick?: (c: string) => void }) {
  const isAssistant = role === "assistant";
  return (
    <div className={`vc-bubble ${isAssistant ? "vc-assistant" : "vc-user"}`}>
      <div className="vc-inner" dangerouslySetInnerHTML={{ __html: md(text) }} />
      {!!chips?.length && (
        <div className="vc-chips">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              className={`vc-chip ${c.includes("WhatsApp") ? "whatsapp-chip" : ""}`}
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
      <rect x="3" y="7" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
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
    `• Tipo: ${d.tipo || "—"}`,
    `• Rubro/Negocio: ${d.negocio || "—"}`,
    `• Presupuesto: ${d.presupuesto || "—"}`,
    `• Plazo: ${d.plazo || "—"}`,
  ].join("\n");
}
function buildWizardMessageOrSummary(d: WizardData, msgs: Msg[]) {
  const hasWizard = d.tipo || d.negocio || d.presupuesto || d.plazo;
  if (!hasWizard && msgs.length) {
    const MAX = 900;
    const lines = ["Hola, vengo desde el chat de Velocity. Resumen:"];
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
