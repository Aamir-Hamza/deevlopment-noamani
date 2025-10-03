import nodemailer from 'nodemailer';

export function createSmtpTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env as Record<string, string | undefined>;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP env vars missing');
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendOtpEmail(to: string, otp: string) {
  const transporter = createSmtpTransport();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const brand = process.env.APP_NAME || 'Noamani';
  await transporter.sendMail({
    from,
    to,
    subject: `Your ${brand} password reset code`,
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial,sans-serif"><h2>${brand} password reset</h2><p>Your one-time code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px">${otp}</p><p>This code expires in <b>10 minutes</b>.</p></div>`,
  });
}

export async function sendResetSuccessEmail(to: string) {
  const transporter = createSmtpTransport();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const brand = process.env.APP_NAME || 'Noamani';
  await transporter.sendMail({
    from,
    to,
    subject: `${brand} password reset successful`,
    text: `Your password was reset successfully. If this wasn't you, contact support immediately.`,
  });
}


