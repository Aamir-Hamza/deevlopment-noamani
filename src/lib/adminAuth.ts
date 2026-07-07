import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '@/models/Admin';
import connectDB from '@/lib/db';

export interface AdminTokenPayload {
  id: string;
  email: string;
  role: string;
  sessionId: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Fail closed: never fall back to a guessable default. If this fires,
    // JWT_SECRET is missing from the environment and must be set before
    // any admin-authenticated route can be trusted.
    throw new Error('JWT_SECRET is not configured');
  }
  return secret;
}

/**
 * Verifies the `admin_token` cookie on an incoming request.
 * Returns the decoded payload if valid, or null if missing/invalid/expired.
 * Also enforces single-session login: the token's sessionId must match the
 * admin's current activeSessionId in the DB, so logging in elsewhere
 * invalidates this token immediately rather than waiting for expiry.
 * Route handlers must check for null and return 401 — this function does
 * not throw for auth failures, only for server misconfiguration.
 */
export async function verifyAdminRequest(request: Request): Promise<AdminTokenPayload | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
  if (!match) return null;

  try {
    const decoded = jwt.verify(decodeURIComponent(match[1]), getJwtSecret());
    if (typeof decoded === 'string') return null;
    if (!decoded.id || !decoded.email || !decoded.role || !decoded.sessionId) return null;

    await connectDB();
    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.activeSessionId !== decoded.sessionId) return null;

    return { id: decoded.id, email: decoded.email, role: decoded.role, sessionId: decoded.sessionId };
  } catch {
    return null;
  }
}

const TWO_FACTOR_PENDING_COOKIE = 'admin_2fa_pending';

/**
 * Signs a short-lived token proving the admin passed the password step,
 * used to gate the second (2FA code) step of login without granting any
 * real session access yet.
 */
export function signTwoFactorPendingToken(adminId: string): string {
  return jwt.sign({ id: adminId, purpose: 'admin_2fa' }, getJwtSecret(), { expiresIn: '10m' });
}

/**
 * Verifies the `admin_2fa_pending` cookie set after the password step.
 * Returns the admin id if valid, or null if missing/invalid/expired.
 */
export function verifyTwoFactorPendingToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${TWO_FACTOR_PENDING_COOKIE}=([^;]+)`));
  if (!match) return null;

  try {
    const decoded = jwt.verify(decodeURIComponent(match[1]), getJwtSecret());
    if (typeof decoded === 'string') return null;
    if (decoded.purpose !== 'admin_2fa' || !decoded.id) return null;
    return decoded.id;
  } catch {
    return null;
  }
}

/**
 * Issues a fresh session for an admin who has fully authenticated (password,
 * and 2FA code if enabled). Invalidates any previously active session and
 * returns the signed `admin_token` JWT for the route to set as a cookie.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function issueAdminSession(admin: any): Promise<string> {
  const sessionId = crypto.randomUUID();
  admin.activeSessionId = sessionId;
  await admin.save();

  return jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role, sessionId },
    getJwtSecret(),
    { expiresIn: '1d' }
  );
}

export { getJwtSecret, TWO_FACTOR_PENDING_COOKIE };
