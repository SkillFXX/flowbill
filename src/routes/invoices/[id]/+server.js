import { getInvoiceById } from '$lib/api/invoices';
import { getUserInfosbyId } from '$lib/api/user';

export async function GET({ params, locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const invoice = await getInvoiceById(params.id);

	if (!invoice) {
		return new Response(JSON.stringify({ error: 'Invoice not found' }), { status: 404 });
	}

	// Fetch user info (issuer) to embed in the invoice object for the template
	const user = await getUserInfosbyId(locals.userId);
	invoice.user = user;

	return new Response(JSON.stringify({ invoice }), { status: 200 });
}
