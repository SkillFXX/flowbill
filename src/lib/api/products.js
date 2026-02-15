import { db } from '$lib/db/mysql';

export async function getProductsByUserId(userId) {
	const [rows] = await db.query('SELECT * FROM products WHERE id_user = ?', [userId]);
	return rows;
}

export async function getProductById(productId) {
	const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
	return rows[0];
}

export async function deleteProductById(productId) {
	await db.query('DELETE FROM products WHERE id = ?', [productId]);
	return true;
}

export async function createProduct(userId, productData) {
	const [result] = await db.query(
		`INSERT INTO products (
			id_user, name, description, price, vat_rate
		) VALUES (?, ?, ?, ?, ?)`,
		[
			userId,
			productData.name,
			productData.description || null,
			productData.price,
			productData.vatRate
		]
	);

	return result.insertId;
}

export async function updateProductById(productId, productData) {
	await db.query(
		`UPDATE products SET 
			name = ?,
			description = ?,
			price = ?,
			vat_rate = ?
		WHERE id = ?`,
		[
			productData.name,
			productData.description || null,
			productData.price,
			productData.vatRate,
			productId
		]
	);

	return true;
}
