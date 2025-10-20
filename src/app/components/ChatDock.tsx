"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { WA_PHONE } from "../config";

type Role = "assistant" | "user";
type Msg = { id: string; role: Role; text: string; chips?: string[] };

const SERVICE_CHIPS = [
  { key: "landing", label: "Landing Page" },
  { key: "app", label: "Aplicación Web" },
  { key: "ecommerce", label: "Tienda Online" },
  { key: "corporativo", label: "Sitio Corporativo" },
  { key: "soporte", label: "Soporte & Mantención" },
  { key: "seo", label: "SEO & Performance" },
];

export default function ChatDock() {
  const [mounted, setMounted] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const [open, setOpen] = useState(false);
  const [canCloseOverlay, setCanCloseOverlay] = useState(false);
  const [unread, setUnread] = useState(0);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [wizard, setWizard] = useState<{
    active: boolean;
    step: 0 | 1 | 2 | 3 | 4;
    data: { tipo: string; negocio: string; presupuesto: string; plazo: string };
  }>({ active: false, step: 0, data: { tipo: "", negocio: "", presupuesto: "", plazo: "" } });

  const listRef = useRef<HTMLDivElement | null>(null);

  /* ========== Mount portal ========== */
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

  /* ========== Load / greet ========== */
  useEffect(() => {
    if (!mounted) return;
    try {
      const saved = sessionStorage.getItem("vc-messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed);
          return;
        }
      }
    } catch { }
    greet(); // saludo + chips de servicios + accesos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  function greet() {
    addAssistant("Hola 👋 ¿Cómo te ayudo hoy?");
    addAssistant("¿Qué necesitas? Elige un servicio:", SERVICE_CHIPS.map(s => s.label));
    addAssistant("También puedo:", ["Cotizar (modo guiado)", "Soporte técnico", "Ver precios"]);
  }

  /* ========== Persistance ========== */
  useEffect(() => {
    try { sessionStorage.setItem("vc-messages", JSON.stringify(messages)); } catch { }
  }, [messages]);

  /* ========== Body lock / overlay ========== */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev || "";
    return () => (document.body.style.overflow = prev || "");
  }, [open]);

  useEffect(() => {
    if (open) {
      setCanCloseOverlay(false);
      setUnread(0);
      const t = setTimeout(() => setCanCloseOverlay(true), 250);
      return () => clearTimeout(t);
    } else setCanCloseOverlay(false);
  }, [open]);

  /* ========== Autoscroll ========== */
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  /* ========== Helpers ========== */
  function addAssistant(text: string, chips?: string[]) {
    setMessages(p => [...p, { id: crypto.randomUUID(), role: "assistant", text, chips }]);
    if (!open) setUnread(n => n + 1);
  }
  function addUser(text: string) {
    setMessages(p => [...p, { id: crypto.randomUUID(), role: "user", text }]);
  }

  /* ========== Flows ========== */
  function startWizard() {
    setWizard({ active: true, step: 1, data: { tipo: "", negocio: "", presupuesto: "", plazo: "" } });
    addAssistant("**Paso 1/4:** ¿Qué tipo de proyecto necesitas?", [
      "Landing", "Corporativa", "Tienda", "App / Medida",
    ]);
  }

  function startWizardWith(tipo: string) {
    setWizard({ active: true, step: 2, data: { tipo, negocio: "", presupuesto: "", plazo: "" } });
    addAssistant("**Paso 2/4:** ¿Cuál es tu **rubro o negocio**? (ej: restaurante, tienda de ropa…)");
  }

  function supportKickoff() {
    addAssistant(
      [
        "Perfecto, soporte técnico ⚙️. Dime el área:",
        "• Carga/Velocidad (Lighthouse, Core Web Vitals)",
        "• Dominio/Hosting/SSL",
        "• Correo/SMTP",
        "• Contenido/Actualizaciones",
        "• Pago/Checkout (tienda)",
        "• Otro",
      ].join("\n"),
      ["Velocidad", "Dominio/SSL", "Correo", "Contenido", "Checkout", "Otro"]
    );
  }

  function showPricing() {
    addAssistant(
      [
        "Guía referencial:",
        "• Landing Page: **$150.000 – $280.000**",
        "• Sitio Corporativo: **$350.000 – $650.000**",
        "• Tienda Online: **$600.000 – $1.200.000**",
        "• Aplicación Web: **$900.000 – $2.000.000**",
        "",
        "¿Quieres una cotización precisa?",
      ].join("\n"),
      ["Cotizar (modo guiado)", "Volver al inicio"]
    );
  }

  /* ========== Messaging ========== */
  function send(textRaw?: string) {
    const t = (textRaw ?? input).trim();
    if (!t) return;
    addUser(t);
    setInput("");

    if (wizard.active) { handleWizardInput(t); return; }

    const lower = t.toLowerCase();
    if (lower.includes("cotiz")) { startWizard(); return; }
    if (lower.includes("soporte")) { supportKickoff(); return; }
    if (lower.includes("precio")) { showPricing(); return; }

    if (["velocidad", "dominio", "ssl", "correo", "contenido", "checkout", "otro"].some(k => lower.includes(k))) {
      const map: Record<string, string> = {
        velocidad: "Velocidad ⚡️: optimizamos imágenes, JS/CSS, lazy-loading, caching y Core Web Vitals. ¿Tienes hosting propio o en nuestro stack?",
        dominio: "Dominio/SSL 🌐: renovaciones, DNS, propagación, certificados Let's Encrypt/Cloudflare. ¿Cuál es tu dominio?",
        ssl: "SSL 🔐: renovación, cadena intermedia, redirecciones HTTPS. ¿El sitio está en hosting propio o nuestro?",
        correo: "Correo/SMTP ✉️: envío/recepción, DKIM/SPF, puertos (587/465), registros DNS. ¿Proveedor actual?",
        contenido: "Contenido ✍️: actualizaciones de texto, imágenes, secciones y páginas nuevas. ¿Qué quieres modificar?",
        checkout: "Checkout 💳: Webpay/Paypal/Flow, stock, cálculo de envío. ¿Cuál es el flujo exacto del error?",
        otro: "Cuéntame el detalle y, si puedes, adjunta capturas. Te doy prioridad hoy mismo.",
      };
      const key =
        lower.includes("velocidad") ? "velocidad" :
          (lower.includes("dominio") || lower.includes("ssl")) ? "dominio" :
            lower.includes("correo") ? "correo" :
              lower.includes("contenido") ? "contenido" :
                lower.includes("checkout") ? "checkout" : "otro";
      addAssistant(map[key], ["Volver al inicio", "Cotizar (modo guiado)"]);
      return;
    }

    if (lower.includes("volver")) { resetChat(true); return; }

    addAssistant(
      "Puedo ayudarte con **Cotizar (modo guiado)**, **Soporte técnico** o **Ver precios**.",
      ["Cotizar (modo guiado)", "Soporte técnico", "Ver precios", "Volver al inicio"]
    );
  }

  function resetChat(scrollTop = false) {
    setWizard({ active: false, step: 0, data: { tipo: "", negocio: "", presupuesto: "", plazo: "" } });
    setMessages([]);
    sessionStorage.removeItem("vc-messages");
    setTimeout(() => greet(), 0);
    if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleWizardInput(text: string) {
    const step = wizard.step;
    const lower = text.toLowerCase();

    if (step === 1) {
      let tipo = text;
      if (lower.includes("landing")) tipo = "Landing";
      else if (lower.includes("corpor")) tipo = "Corporativa";
      else if (lower.includes("tienda")) tipo = "Tienda";
      else if (lower.includes("app")) tipo = "App / Medida";
      setWizard(w => ({ ...w, step: 2, data: { ...w.data, tipo } }));
      addAssistant("**Paso 2/4:** ¿Cuál es tu **rubro o negocio**? (ej: restaurante, tienda de ropa…)");
      return;
    }
    if (step === 2) {
      const negocio = text || "No especificado";
      setWizard(w => ({ ...w, step: 3, data: { ...w.data, negocio } }));
      addAssistant("**Paso 3/4:** ¿Cuál es tu **presupuesto**?", [
        "Hasta $300.000", "$300.000 – $700.000", "$700.000 – $1.500.000", "$1.500.000+", "A definir",
      ]);
      return;
    }
    if (step === 3) {
      let presupuesto = text;
      if (lower.includes("hasta")) presupuesto = "Hasta $300.000";
      else if (lower.includes("700")) presupuesto = "$300.000 – $700.000";
      else if (lower.includes("1.500") || lower.includes("1500")) presupuesto = "$700.000 – $1.500.000";
      else if (lower.includes("+") || lower.includes("1.5") || lower.includes("más") || lower.includes("mas")) presupuesto = "$1.500.000+";
      else if (lower.includes("defin")) presupuesto = "A definir";
      setWizard(w => ({ ...w, step: 4, data: { ...w.data, presupuesto } }));
      addAssistant("**Paso 4/4:** ¿Cuál es tu **plazo** objetivo?", ["1–2 semanas", "3–4 semanas", "5+ semanas", "A definir"]);
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
      addAssistant(["✅ **Resumen de tu cotización:**", resumen, "", "¿La enviamos por WhatsApp?"].join("\n"), ["Enviar por WhatsApp", "Volver al inicio"]);
    }
  }

  /* ========== WhatsApp ========== */
  const waText = useMemo(() => buildWizardMessage(wizard.data, messages), [wizard.data, messages]);
  const waLink = `https://wa.me/${WA_PHONE || "56912345678"}?text=${encodeURIComponent(waText)}`;

  function handleChipClick(c: string) {
    const lower = c.toLowerCase();

    // Botones de servicio (directo)
    const svc = SERVICE_CHIPS.find(s => s.label.toLowerCase() === lower);
    if (svc) {
      // emular que el usuario eligió
      addUser(svc.label);
      // respuestas rápidas dependiendo del servicio
      if (svc.key === "soporte") { supportKickoff(); return; }
      if (svc.key === "seo") { showPricing(); return; }

      // landing/corporativo/ecommerce/app → arrancar wizard en paso 2
      const map: Record<string, string> = {
        landing: "Landing",
        corporativo: "Corporativa",
        ecommerce: "Tienda",
        app: "App / Medida",
      };
      const tipo = map[svc.key] || "Landing";
      setWizard({ active: true, step: 2, data: { tipo, negocio: "", presupuesto: "", plazo: "" } });

      const intro =
        tipo === "Landing" ? "Perfecto, una **Landing Page** enfocada en conversión." :
          tipo === "Corporativa" ? "Genial, un **Sitio Corporativo** con páginas internas." :
            tipo === "Tienda" ? "Excelente, una **Tienda Online** con pagos y despacho." :
              "Vamos con una **Aplicación Web** a medida.";

      addAssistant(
        [
          `${intro}`,
          "**Paso 2/4:** ¿Cuál es tu **rubro o negocio**? (ej: restaurante, tienda de ropa…)",
        ].join("\n"),
        ["Volver al inicio", "Enviar por WhatsApp", "Cotizar (modo guiado)"]
      );
      return;
    }

    if (lower.includes("whatsapp")) {
      window.open(waLink, "_blank", "noopener,noreferrer");
      return;
    }

    // accesos clásicos
    send(c);
  }

  /* ========== UI ========== */
  const UI = (
    <div className="vc-shell" aria-live="polite">
      {/* FAB robot izquierda */}
      {!open && (
        <button className="vc-fab" onClick={() => setOpen(true)} aria-label="Abrir chat" type="button">
          <span className="vc-avatar" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <defs><linearGradient id="gFab" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
              <circle cx="24" cy="24" r="22" fill="url(#gFab)" opacity="0.95" />
              <rect x="12" y="18" width="24" height="16" rx="8" fill="rgba(255,255,255,.98)" />
              <circle cx="19" cy="26" r="3" fill="#0f172a" />
              <circle cx="29" cy="26" r="3" fill="#0f172a" />
              <rect x="22" y="10" width="4" height="6" rx="2" fill="#e2e8f0" />
            </svg>
          </span>
          {unread > 0 && <span className="vc-badge">{unread > 9 ? "9+" : unread}</span>}
        </button>
      )}

      {/* Overlay */}
      <div className={`vc-overlay ${open ? "show" : ""}`} onClick={() => { if (canCloseOverlay) setOpen(false); }} />

      {/* Ventana ayuda compacta */}
      <aside className={`vc-dock ${open ? "open" : ""}`} aria-label="Chat Velocity" role="dialog" aria-modal="true">
        <header className="vc-head">
          <div className="vc-brand">
            <span className="vc-avatar" aria-hidden="true">
              <svg viewBox="0 0 48 48">
                <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
                <circle cx="24" cy="24" r="22" fill="url(#g1)" opacity="0.9" />
                <rect x="12" y="18" width="24" height="16" rx="8" fill="rgba(255,255,255,.98)" />
                <circle cx="19" cy="26" r="2.8" fill="#0f172a" />
                <circle cx="29" cy="26" r="2.8" fill="#0f172a" />
                <rect x="22" y="10" width="4" height="6" rx="2" fill="#e2e8f0" />
              </svg>
            </span>
            Asistente Velocity
          </div>
          <button className="vc-x" onClick={() => setOpen(false)} aria-label="Cerrar" type="button">✕</button>
        </header>

        <div className="vc-body" ref={listRef}>
          {messages.map((m) => (
            <Bubble key={m.id} role={m.role} text={m.text} chips={m.chips} onChipClick={handleChipClick} />
          ))}
        </div>

        <form className="vc-inputbar" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input className="vc-input" placeholder={wizard.active ? placeholderByStep(wizard.step) : "Escribe aquí…"} value={input} onChange={(e) => setInput(e.target.value)} />
          <button className="vc-send" type="submit">Enviar</button>
        </form>

        <div className="vc-cta">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="vc-wa">Enviar por WhatsApp</a>
          <button className="vc-reset" onClick={() => resetChat(true)} type="button">Volver al inicio</button>
        </div>
      </aside>

      <style jsx>{`
        :root { --neo1:#a855f7; --neo2:#06b6d4; --glass:rgba(12,18,32,0.86); }

        /* FAB */
        .vc-fab{
          position:fixed; left:18px; bottom:30px; width:62px; height:62px;
          display:grid; place-items:center; border-radius:999px; cursor:pointer;
          background: radial-gradient(80% 80% at 30% 30%, var(--neo2), var(--neo1));
          border:1px solid rgba(255,255,255,.25);
          box-shadow: 0 0 28px rgba(168,85,247,.45), 0 0 40px rgba(6,182,212,.32);
          z-index:2147483000; transition: transform .25s ease, filter .3s ease;
        }
        .vc-fab:hover{ transform: translateY(-2px) scale(1.03); filter: brightness(1.08); }
        .vc-avatar{ width:28px; height:28px; display:block; }
        .vc-badge{
          position:absolute; top:-4px; right:-4px; width:20px; height:20px; border-radius:999px;
          background:linear-gradient(135deg,#ef4444,#dc2626); color:#fff; font-weight:900; font-size:10px;
          display:grid; place-items:center; border:2px solid rgba(12,16,26,.95);
        }

        /* Overlay */
        .vc-overlay{ position:fixed; inset:0; background:rgba(2,6,23,.55); backdrop-filter: blur(4px); opacity:0; pointer-events:none; transition: opacity .35s ease; z-index:2147482998; }
        .vc-overlay.show{ opacity:1; pointer-events:auto; }

        /* Dock compacto */
        .vc-dock{
          position:fixed; left:18px; bottom:18px; width:min(420px,92vw); height:min(70vh,560px);
          transform: translateY(10px) scale(.98); opacity:0; overflow:hidden;
          display:grid; grid-template-rows:auto 1fr auto auto; z-index:2147482999;
          background:var(--glass); border:1px solid rgba(173,216,255,.18);
          border-radius:16px; box-shadow:0 30px 80px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.04);
          transition: transform .4s cubic-bezier(.22,.61,.36,1), opacity .35s ease;
        }
        .vc-dock.open{ transform: translateY(0) scale(1); opacity:1; }
        @media (max-width:520px){
          .vc-dock{ left:10px; right:10px; width:auto; height: calc(86vh - env(safe-area-inset-bottom)); bottom: calc(10px + env(safe-area-inset-bottom)); }
        }

        .vc-head{ display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:rgba(6,12,24,.72); border-bottom:1px solid rgba(173,216,255,.15); }
        .vc-brand{ color:#0f172a; font-weight:900; letter-spacing:.2px; display:inline-flex; gap:10px; align-items:center; }
        .vc-brand{ color:#EAF6FF; text-shadow:0 1px 8px rgba(6,182,212,.25); }
        .vc-x{ width:30px; height:30px; border-radius:10px; background:rgba(255,255,255,.12); color:#fff; border:none; cursor:pointer; }
        .vc-x:hover{ background:rgba(255,255,255,.18); }

        .vc-body{ overflow:auto; padding:12px; display:grid; gap:10px; }

        .vc-inputbar{ display:grid; grid-template-columns:1fr auto; gap:8px; padding:10px 12px; border-top:1px solid rgba(173,216,255,.15); background:rgba(6,12,24,.72); }
        .vc-input{ height:40px; border-radius:12px; padding:10px 12px; color:#EAF6FF; background: rgba(255,255,255,.08); border:1px solid rgba(173,216,255,.28); }
        .vc-input::placeholder{ color:#B6D6E8; }
        .vc-send{ height:40px; padding:0 12px; border-radius:12px; border:none; color:#fff; font-weight:800; cursor:pointer; background:linear-gradient(135deg,var(--neo2),var(--neo1)); }

        .vc-cta{ display:flex; gap:8px; padding:10px 12px; border-top:1px solid rgba(173,216,255,.15); background:rgba(6,12,24,.72); }
        .vc-wa{ flex:1; text-align:center; text-decoration:none; border-radius:12px; padding:10px 12px; color:#fff; font-weight:900; background:linear-gradient(135deg,#22c55e,#16a34a); border:1px solid rgba(255,255,255,.2); }
        .vc-reset{ border:none; border-radius:12px; padding:10px 12px; color:#fff; font-weight:800; background:rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.2); cursor:pointer; }

        /* Burbujas con contraste alto (ASISTENTE claro) */
        .vc-bubble{ max-width:92%; display:grid; }
        .vc-inner{
          border-radius:12px; padding:10px 12px; line-height:1.6; font-size:.96rem;
          color:#0f172a; 
          background: rgba(255,255,255,.96);    /* <-- BLANCO VIDRIO para leer perfecto */
          border:1px solid rgba(15,23,42,.12);
          box-shadow: 0 1px 0 rgba(255,255,255,.6) inset;
        }
        .vc-assistant .vc-inner{ border-left:3px solid var(--neo2); }
        .vc-user{ justify-self:end; }
        .vc-user .vc-inner{
          background: rgba(6,182,212,.18);
          border:1px solid rgba(6,182,212,.45);
          color:#06202a;
        }

        /* Chips ovalados premium (servicios) */
        .vc-chips{ display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
        .vc-chip{
          border:none; border-radius:999px; padding:8px 14px; font-weight:900; font-size:.92rem; cursor:pointer;
          color:#0b1220; background:#fff; border:1px solid rgba(15,23,42,.12);
          box-shadow:0 6px 18px rgba(6,182,212,.18);
        }
        .vc-chip--landing{ background: linear-gradient(135deg,#22d3ee,#06b6d4); color:#001219; }
        .vc-chip--app{ background: linear-gradient(135deg,#34d399,#22c55e); color:#06210c; }
        .vc-chip--ecommerce{ background: linear-gradient(135deg,#f59e0b,#fb7185); color:#2a0a00; }
        .vc-chip--corporativo{ background: linear-gradient(135deg,#a78bfa,#22d3ee); color:#001219; }
        .vc-chip--soporte{ background: linear-gradient(135deg,#60a5fa,#22d3ee); color:#001228; }
        .vc-chip--seo{ background: linear-gradient(135deg,#f43f5e,#f59e0b); color:#2a0a00; }

        .vc-shell, .vc-dock, .vc-overlay, .vc-fab { isolation:isolate; }
      `}</style>
    </div>
  );

  if (!mounted || !portalEl) return null;
  return createPortal(UI, portalEl);
}

/* ---------- Bubble ---------- */
function Bubble({
  role, text, chips, onChipClick,
}: { role: Role; text: string; chips?: string[]; onChipClick?: (c: string) => void; }) {
  return (
    <div className={`vc-bubble ${role === "assistant" ? "vc-assistant" : "vc-user"}`}>
      <div className="vc-inner" dangerouslySetInnerHTML={{ __html: md(text) }} />
      {!!chips?.length && (
        <div className="vc-chips">
          {chips.map((c) => {
            const svc = mapChipClass(c);
            return (
              <button
                key={c}
                className={`vc-chip ${svc ? `vc-chip--${svc}` : ""}`}
                onClick={() => onChipClick?.(c)}
                type="button"
              >
                {c}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Utils ---------- */
function md(s: string) {
  return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
}
function buildWizardSummary(d: { tipo: string; negocio: string; presupuesto: string; plazo: string }) {
  return [
    `• Tipo: **${d.tipo || "—"}**`,
    `• Rubro/Negocio: **${d.negocio || "—"}**`,
    `• Presupuesto: **${d.presupuesto || "—"}**`,
    `• Plazo: **${d.plazo || "—"}**`,
  ].join("\n");
}
function buildWizardMessage(
  d: { tipo: string; negocio: string; presupuesto: string; plazo: string },
  msgs: { role: Role; text: string }[]
) {
  const hasWizard = d.tipo || d.negocio || d.presupuesto || d.plazo;
  if (!hasWizard && Array.isArray(msgs) && msgs.length) {
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
function placeholderByStep(step: number) {
  if (step === 1) return "Ej: Landing / Corporativa / Tienda / App";
  if (step === 2) return "Ej: Restaurante, tienda, emprendimiento…";
  if (step === 3) return "Ej: $500.000 / $300.000 – $700.000 / A definir";
  if (step === 4) return "Ej: 2 semanas / 3–4 semanas / A definir";
  return "Escribe aquí…";
}
function mapChipClass(label: string) {
  const t = label.toLowerCase();
  if (t.includes("landing")) return "landing";
  if (t.includes("aplicación") || t.includes("aplicacion") || t.includes("app")) return "app";
  if (t.includes("tienda")) return "ecommerce";
  if (t.includes("corporativo")) return "corporativo";
  if (t.includes("soporte")) return "soporte";
  if (t.includes("seo")) return "seo";
  return "";
}
