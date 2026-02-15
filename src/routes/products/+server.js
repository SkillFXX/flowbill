import {
	getProductsByUserId,
	createProduct,
	deleteProductById,
	updateProductById
} from '$lib/api/products';

export async function GET({ locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const products = await getProductsByUserId(locals.userId);
	return new Response(JSON.stringify({ products }), { status: 200 });
}

export async function POST({ request, locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const data = await request.json();
	const productId = await createProduct(locals.userId, data);
	return new Response(JSON.stringify({ success: true, productId }), { status: 201 });
}

export async function DELETE({ request, locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const { id } = await request.json();
	await deleteProductById(id);
	return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function PUT({ request, locals }) {
	if (!locals.userId) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const { id, ...productInfos } = await request.json();
	await updateProductById(id, productInfos);
	return new Response(JSON.stringify({ success: true }), { status: 200 });
}
