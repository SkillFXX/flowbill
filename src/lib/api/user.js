import { db } from '$lib/db/mysql';

export async function getUserInfosbyId(userId) {
	const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
	return rows[0];
}

export async function updateUserById(userId, userInfos) {
	const {
		first_name,
		last_name,
		phone,
		email,
		address,
		postal_code,
		city,
		country,
		legal_form,
		siret,
		vat_number,
		iban,
		bic,
		self_employed,
		invoice_template,
		company_name
	} = userInfos;
	await db.query(
		`UPDATE users SET 
            first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, postal_code = ?, city = ?, country = ?, legal_form = ?, siret = ?, vat_number = ?, iban = ?, bic = ?, self_employed = ?, invoice_template = ?, company_name = ?
        WHERE id = ?`,
		[
			first_name,
			last_name,
			phone,
			email,
			address,
			postal_code,
			city,
			country,
			legal_form,
			siret,
			vat_number,
			iban,
			bic,
			self_employed,
			invoice_template,
			company_name,
			userId
		]
	);
	return true;
}
