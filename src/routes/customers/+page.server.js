import { requireAuth } from '$lib/api/auth';

export function load({ locals }) {
	const userId = requireAuth(locals);
	return { userId };
}
