import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name, email, projectType, budget, message } = req.body ?? {};
    if (!name || !email || !projectType) return res.status(400).json({ error: "Missing required fields" });

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
      await transporter.sendMail({
        from: `"NovatraTech Website" <${user}>`,
        to: "novatratechsmcpvtltd@gmail.com",
        replyTo: email,
        subject: `New Inquiry: ${projectType} — ${name}`,
        text: [`Name: ${name}`, `Email: ${email}`, `Project Type: ${projectType}`, `Budget: ${budget || "Not specified"}`, ``, `Message:`, message || "(none)"].join("\n"),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (_err) {
    return res.status(500).json({ error: "Failed to send. Please try WhatsApp instead." });
  }
}
