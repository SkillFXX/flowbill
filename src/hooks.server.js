import { parse } from 'cookie';

export async function handle({ event, resolve }) {
	const cookies = parse(event.request.headers.get('cookie') || '');
	event.locals.userId = cookies.session || null;

	return resolve(event);
}
