import jwt from 'jsonwebtoken';
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

export { getJwtSecret };
