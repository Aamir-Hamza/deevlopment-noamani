import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { generateTotpSecret, generateTotpQrCode } from '@/lib/totp';

export async function POST(request: Request) {
  const payload = await verifyAdminRequest(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const admin = await Admin.findById(payload.id);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Generate (or regenerate) a secret; it only takes effect once confirmed
  // via /api/admin/2fa/totp/verify, so this alone doesn't enable 2FA.
  const secret = generateTotpSecret();
  admin.totpSecret = secret;
  await admin.save();

  const qrCode = await generateTotpQrCode(admin.email, secret);
  return NextResponse.json({ secret, qrCode });
}
