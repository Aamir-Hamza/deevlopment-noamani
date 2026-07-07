import { authenticator } from 'otplib';
import QRCode from 'qrcode';

authenticator.options = { window: 1 };

export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function verifyTotpToken(secret: string, token: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

export async function generateTotpQrCode(email: string, secret: string): Promise<string> {
  const issuer = process.env.APP_NAME || 'Noamani Admin';
  const otpauthUrl = authenticator.keyuri(email, issuer, secret);
  return QRCode.toDataURL(otpauthUrl);
}
