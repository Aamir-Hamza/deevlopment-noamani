import crypto from 'crypto';

export function generateSixDigitOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOtpWithSecret(otp: string, email: string): string {
  const secret = process.env.OTP_SECRET || 'change-this-secret';
  return crypto.createHmac('sha256', secret).update(`${email.toLowerCase()}.${otp}`).digest('hex');
}

export function constantTimeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}


