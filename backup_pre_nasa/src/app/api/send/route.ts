// app/api/send/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function hasSMTP() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function buildTransporter() {
  // Si faltan credenciales: modo "noop" (no fallar, sólo logear)
  if (!hasSMTP()) return null;

  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function POST(req: Request) {
  try {
    const { subject, name, email, phone, message, meta } = await req.json();

    // Si no hay SMTP, no fallamos (para que en la UI salga "enviado OK")
    const transporter = buildTransporter();
    if (!transporter) {
      console.warn("[/api/send] SMTP no configurado. Se omite envío real.");
      return NextResponse.json({ ok: true, skippedEmail: true });
    }

    const to = process.env.SMTP_TO || "jera.bkr@gmail.com";
    const from = process.env.SMTP_FROM || `Velocity Web <${process.env.SMTP_USER}>`;

    const html = `
      <h2>Nueva cotización desde el sitio</h2>
      <p><b>Nombre:</b> ${name || "—"}</p>
      <p><b>Email:</b> ${email || "—"}</p>
      <p><b>Teléfono:</b> ${phone || "—"}</p>
      <pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:8px">${message || "—"}</pre>
      <hr/>
      <small>Origen: ${meta?.source || "—"} | URL: ${meta?.url || "—"}</small>
    `;

    await transporter.sendMail({
      to,
      from,
      subject: subject || "Nueva cotización",
      text: message || "",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/send] ERROR:", err);
    // Igual devolvemos 200 para no romper la UX (si lo prefieres, pon 500)
    return NextResponse.json({ ok: true, softError: true });
  }
}
