import { createInvoice } from '$lib/api/invoices';

export async function POST({ request, locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	try {
		const data = await request.json();
		const invoiceId = await createInvoice(locals.userId, data);
		return new Response(JSON.stringify({ success: true, invoiceId }), { status: 201 });
	} catch (err) {
		console.error(err);
		return new Response(JSON.stringify({ error: 'Failed to create invoice' }), { status: 500 });
	}
}
