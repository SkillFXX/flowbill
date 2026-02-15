import { db } from '$lib/db/mysql';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';

export async function POST({ request }) {
	const { email, password } = await request.json();
	const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
	const user = rows[0];

	if (!user)
		return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), { status: 404 });

	const match = await bcrypt.compare(password, user.password);
	if (!match)
		return new Response(JSON.stringify({ error: 'Mot de passe incorrect' }), { status: 401 });

	// création cookie
	const cookie = serialize('session', user.id, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: false, // mettre true si HTTPS
		maxAge: 60 * 60 * 24
	});

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 'Set-Cookie': cookie }
	});
}
