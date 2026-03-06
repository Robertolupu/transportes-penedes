const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = Number(process.env.PORT || 3000);

const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_FROM', 'CONTACT_TO'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(', ')}`);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  const ok = missing.length === 0;
  return res.status(ok ? 200 : 500).json({ ok, missing });
});

app.get('/api/health', (_req, res) => {
  const ok = missing.length === 0;
  return res.status(ok ? 200 : 500).json({ ok, missing });
});

app.post('/api/contact', async (req, res) => {
  try {
    if (missing.length > 0) {
      return res.status(500).json({ message: `Config missing: ${missing.join(', ')}` });
    }

    const { empresa, contacto, email, mensaje } = req.body || {};

    if (!contacto || !email || !mensaje) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const subjectPrefix = process.env.CONTACT_SUBJECT_PREFIX || '[Transportes Penedes]';
    const subject = `${subjectPrefix} Nueva solicitud web`;

    const text = [
      `Empresa: ${empresa || '-'}`,
      `Contacto: ${contacto}`,
      `Email: ${email}`,
      '',
      'Mensaje:',
      String(mensaje),
    ].join('\n');

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject,
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact email failed:', error);
    return res.status(500).json({ message: 'Email delivery failed' });
  }
});

app.listen(port, () => {
  console.log(`Contact API listening on ${port}`);
});
