import { createRemoteJWKSet, jwtVerify } from 'jose';

const FIREBASE_PROJECT_ID = 'noamani-otp';

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

export interface VerifiedFirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
}

/**
 * Verifies a Firebase Auth ID token server-side against Google's public
 * keys. Never trust client-submitted email/name/uid fields for auth
 * decisions — always derive identity from a verified token like this.
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseUser | null> {
  if (typeof idToken !== 'string' || !idToken) return null;

  try {
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });

    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      return null;
    }

    return {
      uid: payload.sub,
      email: payload.email,
      emailVerified: Boolean((payload as any).email_verified),
      name: typeof payload.name === 'string' ? payload.name : undefined,
      picture: typeof payload.picture === 'string' ? payload.picture : undefined,
    };
  } catch {
    return null;
  }
}
