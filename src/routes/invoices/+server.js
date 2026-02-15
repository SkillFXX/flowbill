import { getInvoicesByUserId } from '$lib/api/invoices';

export async function GET({ locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const invoices = await getInvoicesByUserId(locals.userId);
	return new Response(JSON.stringify({ invoices }), { status: 200 });
}
