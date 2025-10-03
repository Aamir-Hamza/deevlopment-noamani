import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond 200 to prevent user enumeration
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, an email has been sent.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    const origin = req.headers.get('origin') || undefined;
    const host = req.headers.get('host');
    const protocolHeader = req.headers.get('x-forwarded-proto');
    const protocol = protocolHeader ? protocolHeader.split(',')[0] : 'http';
    const baseUrl = origin || (host ? `${protocol}://${host}` : 'http://localhost:3000');
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
    const smtpSecure = process.env.SMTP_SECURE === 'true';

    let emailSent = false;

    if (smtpUser && smtpPass) {
      try {
        const transporter = smtpHost && smtpPort
          ? nodemailer.createTransport({
              host: smtpHost,
              port: smtpPort,
              secure: smtpSecure,
              auth: { user: smtpUser, pass: smtpPass },
            })
          : nodemailer.createTransport({
              service: 'gmail',
              auth: { user: smtpUser, pass: smtpPass },
            });

        const mailOptions = {
          from: smtpUser,
          to: user.email,
          subject: 'Reset your Noamani password',
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>Reset your password</h2>
              <p>We received a request to reset the password for your account.</p>
              <p>Click the link below to set a new password. This link will expire in 30 minutes.</p>
              <p><a href="${resetUrl}" target="_blank" rel="noreferrer">Reset your password</a></p>
              <p>If you did not request a password reset, you can safely ignore this email.</p>
            </div>
          `,
        } as any;

        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (mailError) {
        console.warn('SMTP send failed; continuing without email. Reset URL:', resetUrl, mailError);
      }
    } else {
      console.warn('SMTP env vars missing; not sending email. Reset URL:', resetUrl);
    }

    // Always respond generically and do not expose reset URL
    return NextResponse.json({ message: 'Reset Link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Do not expose server errors to the user; avoid blocking UX
    return NextResponse.json({ message: 'Reset Link has been sent.' });
  }
}


