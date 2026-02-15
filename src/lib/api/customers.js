import { db } from '$lib/db/mysql';

export async function getCustomersByUserId(userId) {
	const [rows] = await db.query('SELECT * FROM customers WHERE id_user = ?', [userId]);
	return rows;
}

export async function getCustomerById(clientId) {
	const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [clientId]);
	return rows[0];
}

export async function deleteCustomerById(clientId) {
	await db.query('DELETE FROM customers WHERE id = ?', [clientId]);
	return true;
}

export async function createCustomer(userId, clientData) {
	const [result] = await db.query(
		`INSERT INTO customers (
			id_user, is_company, first_name, last_name, company_name, legal_form,
			siret, vat_number, billing_address, billing_postal_code, billing_city,
			billing_country, shipping_address, shipping_postal_code, shipping_city,
			shipping_country, email, phone
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			userId,
			clientData.isCompany ? 1 : 0,
			clientData.firstName || null,
			clientData.lastName || null,
			clientData.companyName || null,
			clientData.legalForm || null,
			clientData.siret || null,
			clientData.vatNumber || null,
			clientData.billingAddress || null,
			clientData.billingPostalCode || null,
			clientData.billingCity || null,
			clientData.billingCountry || null,
			clientData.shippingAddress || null,
			clientData.shippingPostalCode || null,
			clientData.shippingCity || null,
			clientData.shippingCountry || null,
			clientData.email || null,
			clientData.phone || null
		]
	);

	return result.insertId;
}

export async function updateCustomerById(clientId, clientData) {
	await db.query(
		`UPDATE customers SET 
			is_company = ?,
			first_name = ?,
			last_name = ?,
			company_name = ?,
			legal_form = ?,
			siret = ?,
			vat_number = ?,
			billing_address = ?,
			billing_postal_code = ?,
			billing_city = ?,
			billing_country = ?,
			shipping_address = ?,
			shipping_postal_code = ?,
			shipping_city = ?,
			shipping_country = ?,
			email = ?,
			phone = ?
		WHERE id = ?`,
		[
			clientData.isCompany ? 1 : 0,
			clientData.firstName || null,
			clientData.lastName || null,
			clientData.companyName || null,
			clientData.legalForm || null,
			clientData.siret || null,
			clientData.vatNumber || null,
			clientData.billingAddress || null,
			clientData.billingPostalCode || null,
			clientData.billingCity || null,
			clientData.billingCountry || null,
			clientData.shippingAddress || null,
			clientData.shippingPostalCode || null,
			clientData.shippingCity || null,
			clientData.shippingCountry || null,
			clientData.email || null,
			clientData.phone || null,
			clientId
		]
	);

	return true;
}
