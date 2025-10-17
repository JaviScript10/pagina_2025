/* eslint-disable @typescript-eslint/no-explicit-any */

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";


/**
 * Crea un transporter. Si hay SMTP_USER/PASS => usa SMTP real.
 * Si NO hay y estás en dev => crea una cuenta Ethereal de pruebas.
 * En producción sin credenciales => lanza error controlado.
 */
async function buildTransporter() {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
        // SMTP real
        return nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // true para 465
            auth: { user, pass },
        });
    }

    // Sin credenciales:
    if (process.env.NODE_ENV !== "production") {
        // DEV: usar Ethereal (correos falsos para prueba)
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    // Producción sin credenciales -> error
    throw new Error(
        "Faltan credenciales SMTP. Define SMTP_USER y SMTP_PASS en variables de entorno."
    );
}

function buildHtml({ subject, name, email, phone, message, meta }: any) {
    return `
    <div style="font-family:Inter,system-ui,-apple-system;max-width:620px;margin:auto">
      <h2 style="margin:0 0 12px">📩 ${subject || "Nuevo mensaje"}</h2>
      <p><strong>Nombre:</strong> ${name || "—"}</p>
      <p><strong>Email:</strong> ${email || "—"}</p>
      <p><strong>Teléfono:</strong> ${phone || "—"}</p>
      <p style="white-space:pre-wrap"><strong>Mensaje:</strong><br/>${(message || "").replace(/\n/g, "<br/>")}</p>
      <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb"/>
      <p style="color:#64748b;font-size:12px">
        Fuente: ${meta?.source || "web"}<br/>
        URL: ${meta?.url || "—"}<br/>
        Fecha: ${new Date().toLocaleString()}
      </p>
    </div>
  `;
}

function buildText({ subject, name, email, phone, message, meta }: any) {
    return [
        `📩 ${subject || "Nuevo mensaje"}`,
        `Nombre: ${name || "—"}`,
        `Email: ${email || "—"}`,
        `Teléfono: ${phone || "—"}`,
        ``,
        `Mensaje:`,
        `${message || "—"}`,
        ``,
        `Fuente: ${meta?.source || "web"}`,
        `URL: ${meta?.url || "—"}`,
        `Fecha: ${new Date().toLocaleString()}`,
    ].join("\n");
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const transporter = await buildTransporter();

        const to =
            process.env.SMTP_TO ||
            process.env.SMTP_USER ||
            "jera.bkr@gmail.com";

        const from =
            process.env.SMTP_FROM ||
            `Velocity Web <no-reply@${process.env.VERCEL_URL || "localhost"
            }>`;

        const mailOptions = {
            from,
            to,
            subject: body.subject || "Nuevo mensaje",
            text: buildText(body),
            html: buildHtml(body),
        };

        const info = await transporter.sendMail(mailOptions);

        // Si estamos usando Ethereal, devuelve la URL de preview (súper útil en dev)
        const previewUrl = nodemailer.getTestMessageUrl(info);

        return NextResponse.json(
            { ok: true, id: info.messageId, previewUrl },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("[/api/send] ERROR:", err);
        return NextResponse.json(
            { ok: false, error: err?.message || "Error enviando correo" },
            { status: 500 }
        );
    }
}
