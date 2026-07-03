import { NextResponse } from 'next/server';

// Disabled: this endpoint previously decoded the `id_token` payload without
// verifying its signature, and accepted a client-submitted `appleUser`
// object with no verification at all — either path let anyone log in or
// create an account as any email with a single unauthenticated request.
// There is no "Sign in with Apple" button wired up anywhere in the UI, so
// disabling this outright removes the exposure. Re-enable only once this
// verifies the ID token against Apple's JWKS (https://appleid.apple.com/auth/keys)
// with the correct `aud`/`iss` checks, the same way /api/auth/google now
// verifies Firebase ID tokens.
export async function POST() {
  return NextResponse.json({ error: 'Apple sign-in is not available' }, { status: 501 });
}
