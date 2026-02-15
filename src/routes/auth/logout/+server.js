import { serialize } from 'cookie';

export function POST() {
	const cookie = serialize('session', '', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: false,
		maxAge: 0
	});

	return new Response(null, {
		status: 200,
		headers: { 'Set-Cookie': cookie }
	});
}
