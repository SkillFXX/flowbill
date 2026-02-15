import {
	getCustomersByUserId,
	createCustomer,
	deleteCustomerById,
	updateCustomerById
} from '$lib/api/customers';

export async function GET({ locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const clients = await getCustomersByUserId(locals.userId);
	return new Response(JSON.stringify({ clients }), { status: 200 });
}

export async function POST({ request, locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const data = await request.json();
	const clientId = await createCustomer(locals.userId, data);
	return new Response(JSON.stringify({ success: true, clientId }), { status: 201 });
}

export async function DELETE({ request, locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const { id } = await request.json();
	await deleteCustomerById(id);
	return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function PUT({ request, locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const { id, ...clientInfos } = await request.json();
	await updateCustomerById(id, clientInfos);
	return new Response(JSON.stringify({ success: true }), { status: 200 });
}
