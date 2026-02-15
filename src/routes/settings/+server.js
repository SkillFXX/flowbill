import { getUserInfosbyId, updateUserById } from '$lib/api/user';

export async function GET({ locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const user = await getUserInfosbyId(locals.userId);
	return new Response(JSON.stringify({ user }), { status: 200 });
}

export async function PUT({ request, locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const { id, ...userInfos } = await request.json();
	await updateUserById(id, userInfos);
	return new Response(JSON.stringify({ success: true }), { status: 200 });
}
