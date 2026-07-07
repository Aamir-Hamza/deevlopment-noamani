import twilio from 'twilio';

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error('Twilio credentials are not configured');
  }
  return twilio(sid, token);
}

export async function sendSmsOtp(to: string, otp: string) {
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!from) {
    throw new Error('TWILIO_PHONE_NUMBER is not configured');
  }
  const client = getTwilioClient();
  const brand = process.env.APP_NAME || 'Noamani';
  await client.messages.create({
    to,
    from,
    body: `Your ${brand} admin verification code is ${otp}. It expires in 10 minutes.`,
  });
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return '****';
  return `${'*'.repeat(phone.length - 4)}${phone.slice(-4)}`;
}
