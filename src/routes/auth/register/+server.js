import { db } from '$lib/db/mysql';
import bcrypt from 'bcrypt';

export async function POST({ request }) {
	const { email, password } = await request.json();

	const hashed = await bcrypt.hash(password, 10);

	try {
		await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);
		return new Response(JSON.stringify({ success: true }), { status: 201 });
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Email déjà utilisé' }), { status: 400 });
	}
}
