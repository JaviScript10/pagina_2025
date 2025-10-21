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

  // Control de “fase final” para no duplicar “Volver al inicio”
  const [finalMsgId, setFinalMsgId] = useState<string | null>(null);
  // Toast UI
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });
  const toastTimerRef = useRef<number | null>(null);

  // iOS scroll-restore al volver de WhatsApp
  const pendingScrollRestoreRef = useRef(false);
  const savedScrollYRef = useRef(0);

  // Evitar doble open de WhatsApp
  const waOpeningRef = useRef(false);

  const listRef = useRef<HTMLDivElement | null>(null);

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

  // Mensaje inicial
  useEffect(() => {
    if (!mounted) return;
    if (messages.length === 0) {
      addAssistant("Hola 👋 ¿Cómo te ayudo hoy? Elige una opción:", [
        "Landing Page",
        "Aplicación Web",
        "Tienda Online",
        "Sitio Corporativo",
        "Otros…",
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  /* Lock scroll al abrir y reset de badge (con cleanup correcto) */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev || "";
    if (open) setUnread(0);
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  // Autoscroll en cada cambio
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Restaurar scroll cuando regresamos visibles (después de abrir WhatsApp)
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible" && pendingScrollRestoreRef.current) {
        pendingScrollRestoreRef.current = false;
        // Evitar “salto” de layout
        window.scrollTo({ top: savedScrollYRef.current, left: 0, behavior: "instant" as ScrollBehavior });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  function showToast(msg: string, ms = 2600) {
    setToast({ show: true, msg });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast({ show: false, msg: "" }), ms);
  }

  function addAssistant(text: string, chips?: string[]) {
    const m: Msg = { id: crypto.randomUUID(), role: "assistant", text, chips };
    setMessages((p) => [...p, m]);
    if (!open) setUnread((n) => Math.min(9, n + 1));
    return m.id;
  }
  function addUser(text: string) {
    setMessages((p) => [...p, { id: crypto.randomUUID(), role: "user", text }]);
  }

  // WhatsApp text (wizard si existe, si no, resumen del chat)
  const waText = useMemo(() => buildWizardMessageOrSummary(wizard.data, messages), [wizard.data, messages]);
  const phone = WA_PHONE || "56912345678";
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;

  function resetChat(scrollTop = false) {
    setWizard({ active: false, step: 0, data: { tipo: "", negocio: "", presupuesto: "", plazo: "" } });
    setFinalMsgId(null);
    setMessages([]);
    setTimeout(() => {
      addAssistant("Hola 👋 ¿Cómo te ayudo hoy? Elige una opción:", [
        "Landing Page",
        "Aplicación Web",
        "Tienda Online",
        "Sitio Corporativo",
        "Otros…",
      ]);
    }, 0);
    if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startWizard() {
    setWizard({ active: true, step: 1, data: { tipo: "", negocio: "", presupuesto: "", plazo: "" } });
    addAssistant("**Paso 1/4:** ¿Qué tipo de proyecto necesitas?", [...TIPO_CHIPS]);
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

  // ====== Apertura de WhatsApp con FIX iOS & sin duplicar “Volver al inicio” ======
  function openWhatsAppOnce() {
    if (waOpeningRef.current) return; // evita doble open
    waOpeningRef.current = true;

    // Guardar scroll antes de abrir (para volver sin “salto” de layout)
    savedScrollYRef.current = window.scrollY;
    pendingScrollRestoreRef.current = true;

    // Abrir en nueva pestaña sin alterar la actual
    const newWin = window.open(waLink, "_blank", "noopener,noreferrer");
    // Si el navegador bloquea popups, newWin será null (no hacemos nada disruptivo)
    // De todos modos mostramos el toast de enviado:
    showToast("✅ Mensaje enviado por WhatsApp.");

    // Quitar chips de la tarjeta final (para no duplicar “Volver al inicio”)
    if (finalMsgId) {
      setMessages((prev) =>
        prev.map((m) => (m.id === finalMsgId ? { ...m, chips: undefined } : m))
      );
    }
    // Dejar SOLO un botón “Volver al inicio”
    addAssistant("", ["Volver al inicio"]);

    // Liberar el guard después de un breve tiempo (seguro)
    window.setTimeout(() => {
      waOpeningRef.current = false;
    }, 800);
  }

  async function send(textRaw?: string) {
    const t = (textRaw ?? input).trim();
    if (!t) return;
    setInput("");
    addUser(t);

    if (wizard.active) {
      await handleWizardInput(t);
      return;
    }

    const lower = t.toLowerCase();

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
    if (lower.includes("corporativo") || lower.includes("corporativa")) {
      setWizard({ active: true, step: 2, data: { tipo: "Corporativa", negocio: "", presupuesto: "", plazo: "" } });
      addAssistant("Perfecto: **Sitio Corporativo**.\n**Paso 2/4:** ¿Cuál es tu **rubro o negocio**?");
      return;
    }

    // Grupo "Otros…"
    if (lower.includes("otros")) {
      addAssistant("Elige una opción:", [
        "Soporte & Mantención",
        "SEO & Performance",
        "Cotizar (modo guiado)",
        "Ver precios",
        "Volver al inicio",
      ]);
      return;
    }

    if (lower.includes("soporte")) {
      addAssistant(
        "Para **Soporte & Mantención** ⚙️ cuéntame el problema (hosting/DNS/SSL, velocidad, checkout, contenido…).",
        ["Abrir WhatsApp", "Volver al inicio"]
      );
      return;
    }
    if (lower.includes("seo") || lower.includes("performance")) {
      addAssistant(
        "SEO & Performance 📈: auditoría técnica, Core Web Vitals, contenido, schema, analítica. ¿Quieres propuesta?",
        ["Cotizar (modo guiado)", "Volver al inicio"]
      );
      return;
    }

    if (lower.includes("cotiz")) {
      startWizard();
      return;
    }
    if (lower.includes("precio") || lower.includes("precios")) {
      showPricing();
      return;
    }
    if (lower.includes("volver") || lower.includes("inicio") || lower === "menú" || lower === "menu") {
      resetChat(true);
      return;
    }
    if (lower.includes("whatsapp") || lower.includes("abrir whatsapp")) {
      openWhatsAppOnce();
      return;
    }

    // Fallback
    addAssistant("Puedo ayudarte con:", [
      "Landing Page",
      "Aplicación Web",
      "Tienda Online",
      "Sitio Corporativo",
      "Otros…",
    ]);
  }

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
      addAssistant("**Paso 3/4:** ¿Cuál es tu **presupuesto estimado**?", [...PRESUPUESTO_CHIPS]);
      return;
    }

    if (step === 3) {
      let presupuesto = text;
      if (lower.includes("hasta")) presupuesto = "Hasta $300.000";
      else if (lower.includes("700")) presupuesto = "$300.000 – $700.000";
      else if (lower.includes("1.500") || lower.includes("1500")) presupuesto = "$700.000 – $1.500.000";
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
      // Guardamos el id de esta “tarjeta final” para limpiar chips al enviar WhatsApp
      const id = addAssistant(
        ["✅ **Cotización lista:**", resumen, "", "¿La enviamos por WhatsApp?"].join("\n"),
        ["Enviar por WhatsApp", "Volver al inicio"]
      );
      setFinalMsgId(id);
      return;
    }
  }

  const UI = (
    <div className="vc-root" aria-live="polite">
      {!open && (
        <button className="vc-fab" onClick={() => setOpen(true)} aria-label="Abrir chat" title="Chat">
          <span className="vc-fab-icon">
            <RobotIcon />
          </span>
          {unread > 0 && <span className="vc-badge">{unread >= 9 ? "9+" : unread}</span>}
        </button>
      )}

      <div className={`vc-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <aside className={`vc-dock ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Chat Velocity">
        <header className="vc-head">
          <div className="vc-brand">
            <span className="vc-avatar brand">
              <RobotIcon />
            </span>
            <span>Velocity Chat</span>
          </div>
          <button className="vc-x" onClick={() => setOpen(false)} aria-label="Cerrar chat">
            ✕
          </button>
        </header>

        <div className="vc-body" ref={listRef} role="log" aria-live="polite">
          {messages.map((m) => (
            <Bubble
              key={m.id}
              role={m.role}
              text={m.text}
              chips={m.chips}
              onChipClick={(c) => {
                const lc = c.toLowerCase();
                if (lc.includes("whatsapp")) {
                  openWhatsAppOnce();
                } else if (lc.includes("volver")) {
                  resetChat(true);
                } else {
                  send(c);
                }
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
          <button className="vc-send" type="submit">
            →
          </button>
        </form>
      </aside>

      {/* TOAST */}
      {toast.show && (
        <div className="vc-toast" role="status" aria-live="polite">
          {toast.msg}
        </div>
      )}

      <style jsx global>{`
        .vc-root * {
          box-sizing: border-box !important;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif !important;
        }
        :root {
          --neo1: #8b5cf6;
          --neo2: #06b6d4;
          --glass: rgba(15, 23, 42, 0.95);
          --bg-primary: #0f172a;
          --text-primary: #f1f5f9;
          --text-secondary: #cbd5e1;
        }

        /* FAB (izquierda, abajo pegado) */
        .vc-fab {
          position: fixed !important;
          left: 16px !important;
          bottom: 16px !important;
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .vc-fab:hover {
          transform: translateY(-2px) scale(1.05) !important;
          box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        .vc-fab-icon svg {
          width: 24px !important;
          height: 24px !important;
          filter: brightness(0) invert(1) !important;
        }
        .vc-badge {
          position: absolute !important;
          top: -4px !important;
          right: -4px !important;
          width: 20px !important;
          height: 20px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #ef4444, #dc2626) !important;
          color: white !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          display: grid !important;
          place-items: center !important;
          border: 2px solid var(--bg-primary) !important;
        }

        /* Overlay */
        .vc-overlay {
          position: fixed !important;
          inset: 0 !important;
          backdrop-filter: blur(8px) !important;
          background: rgba(3, 7, 18, 0.6) !important;
          opacity: 0 !important;
          pointer-events: none !important;
          transition: opacity 0.3s ease !important;
          z-index: 2147482998 !important;
          cursor: pointer !important;
        }
        .vc-overlay.show {
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        /* Dock compacto, pegado izquierda y abajo (pero no toda pantalla) */
        .vc-dock {
          position: fixed !important;
          left: 16px !important;
          bottom: 16px !important;
          transform: translateX(-110%) !important; /* completamente escondido */
          width: min(380px, 90vw) !important;
          height: min(640px, 88vh) !important;
          background: var(--glass) !important;
          backdrop-filter: blur(18px) saturate(180%) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 18px !important;
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.28) !important;
          z-index: 2147482999 !important;
          display: grid !important;
          grid-template-rows: auto 1fr auto !important;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          overflow: hidden !important;
        }
        .vc-dock.open {
          transform: translateX(0) !important;
        }
        .vc-dock::before {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          background: var(--bg-primary) !important;
          border-radius: 18px !important;
          z-index: -1 !important;
          opacity: 0.92 !important;
        }

        /* Header */
        .vc-head {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 14px 16px !important;
          background: rgba(30, 41, 59, 0.5) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: var(--text-primary) !important;
        }
        .vc-brand {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          font-weight: 800 !important;
        }
        .vc-avatar {
          width: 22px !important;
          height: 22px !important;
          border-radius: 50% !important;
          display: grid !important;
          place-items: center !important;
          background: linear-gradient(135deg, var(--neo1), var(--neo2)) !important;
        }
        .vc-avatar svg {
          width: 13px !important;
          height: 13px !important;
          filter: brightness(0) invert(1) !important;
        }
        .vc-x {
          width: 30px !important;
          height: 30px !important;
          border-radius: 8px !important;
          background: rgba(255, 255, 255, 0.1) !important;
          color: var(--text-primary) !important;
          cursor: pointer !important;
          display: grid !important;
          place-items: center !important;
          border: none !important;
        }

        /* Body */
        .vc-body {
          padding: 14px !important;
          overflow-y: auto !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
          flex: 1 !important;
        }

        /* Input */
        .vc-inputbar {
          display: flex !important;
          gap: 10px !important;
          padding: 12px 14px !important;
          background: rgba(30, 41, 59, 0.5) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .vc-input {
          flex: 1 !important;
          height: 42px !important;
          border-radius: 12px !important;
          padding: 0 14px !important;
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          color: var(--text-primary) !important;
          font-size: 0.95rem !important;
        }
        .vc-input::placeholder {
          color: var(--text-secondary) !important;
        }
        .vc-send {
          width: 42px !important;
          height: 42px !important;
          border-radius: 12px !important;
          background: linear-gradient(135deg, var(--neo1), var(--neo2)) !important;
          border: none !important;
          color: white !important;
          font-weight: 800 !important;
          cursor: pointer !important;
        }

        /* Burbujas */
        .vc-bubble {
          display: flex !important;
          flex-direction: column !important;
          max-width: 85% !important;
        }
        .vc-assistant {
          align-self: flex-start !important;
        }
        .vc-user {
          align-self: flex-end !important;
        }
        .vc-inner {
          border-radius: 16px !important;
          padding: 10px 14px !important;
          line-height: 1.5 !important;
          font-size: 0.95rem !important;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
        }
        .vc-assistant .vc-inner {
          background: rgba(255, 255, 255, 0.97) !important;
          color: #1e293b !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-bottom-left-radius: 4px !important;
        }
        .vc-user .vc-inner {
          background: linear-gradient(135deg, var(--neo1), var(--neo2)) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-bottom-right-radius: 4px !important;
        }

        /* Chips (2 por fila en desktop, 1 en móvil) */
        .vc-chips {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 8px !important;
          margin-top: 8px !important;
        }
        .vc-chip {
          border: none !important;
          border-radius: 20px !important;
          padding: 10px 14px !important;
          font-size: 0.86rem !important;
          font-weight: 700 !important;
          cursor: pointer !important;
          background: rgba(255, 255, 255, 0.1) !important;
          color: var(--text-primary) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          text-align: center !important;
          backdrop-filter: blur(10px) !important;
          transition: transform 0.15s ease, background 0.2s ease !important;
        }
        .vc-chip:hover {
          transform: translateY(-1px) !important;
          background: rgba(255, 255, 255, 0.16) !important;
        }
        .vc-chip.whatsapp-chip {
          background: linear-gradient(135deg, #22c55e, #16a34a) !important;
          color: white !important;
          border: 1px solid rgba(34, 197, 94, 0.3) !important;
          grid-column: 1 / -1 !important;
        }

        /* Toast */
        .vc-toast {
          position: fixed !important;
          left: 16px !important;
          bottom: calc(16px + 72px) !important; /* arriba del FAB */
          background: linear-gradient(135deg, #22c55e, #16a34a) !important;
          color: #fff !important;
          padding: 10px 14px !important;
          border-radius: 12px !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          font-weight: 800 !important;
          z-index: 2147483001 !important;
          box-shadow: 0 10px 26px rgba(34, 197, 94, 0.3) !important;
        }

        /* Móvil */
        @media (max-width: 768px) {
          .vc-dock {
            left: 50% !important;
            bottom: 0 !important;
            transform: translate(-50%, 110%) !important;
            width: 94vw !important;
            height: 88vh !important;
            border-radius: 16px 16px 0 0 !important;
          }
          .vc-dock.open {
            transform: translate(-50%, 0) !important;
          }
          .vc-chips {
            grid-template-columns: 1fr !important;
          }
          .vc-toast {
            left: 50% !important;
            bottom: 20px !important;
            transform: translateX(-50%) !important;
          }
        }

        /* Scrollbar */
        .vc-body::-webkit-scrollbar {
          width: 6px !important;
        }
        .vc-body::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .vc-body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 3px !important;
        }
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
      <rect
        x="3"
        y="7"
        width="18"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="rgba(255,255,255,.1)"
      />
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
