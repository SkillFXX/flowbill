import { redirect } from '@sveltejs/kit';

export function requireAuth(locals) {
	if (!locals.userId) throw redirect(302, '/auth/login');
	return locals.userId;
}
