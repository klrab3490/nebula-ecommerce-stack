import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Helper to read the current Clerk user on the server.
 * Returns null when no user is signed in.
 */
export async function getServerUser() {
	const user = await currentUser();
	if (!user) return null;

	const role = (user.publicMetadata as Record<string, unknown> | undefined)?.role as
		| string
		| undefined;

	return {
		id: user.id,
		email: user.primaryEmailAddress?.emailAddress ?? null,
		role: role ?? null,
		publicMetadata: user.publicMetadata ?? {},
	};
}

/**
 * Protect API handlers. Call from a route handler and if unauthorized returns a
 * NextResponse with 401/403 that you should return directly from your route.
 *
 * Usage:
 * const auth = await requireAuth(req, ['seller','admin']);
 * if (auth instanceof NextResponse) return auth; // unauthorized/forbidden
 */
export async function requireAuth(
	req: NextRequest | undefined,
	allowedRoles?: string[]
) {
	// Prefer Clerk's currentUser which reads server cookies and session
	const user = await currentUser();
	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const role = (user.publicMetadata as Record<string, unknown> | undefined)?.role as
		| string
		| undefined;

	if (allowedRoles && allowedRoles.length > 0) {
		if (!role || !allowedRoles.includes(role)) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}
	}

	return {
		id: user.id,
		email: user.primaryEmailAddress?.emailAddress ?? null,
		role: role ?? null,
		publicMetadata: user.publicMetadata ?? {},
	};
}

/**
 * Lightweight server check that validates the Clerk session matches the provided user id.
 * Returns true when valid, false otherwise.
 */
export async function validateSessionMatchesUserId(expectedClerkId?: string) {
	try {
		const user = await currentUser();
		if (!user) return false;
		if (!expectedClerkId) return true;
		return user.id === expectedClerkId;
	} catch {
		return false;
	}
}

