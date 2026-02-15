import { db } from '$lib/db/mysql';

export async function createInvoice(userId, invoiceData) {
	// 1. Generate Invoice Number
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const prefix = `${year}-${month}`;

	const [rows] = await db.query(
		'SELECT number FROM invoices WHERE user_id = ? AND number LIKE ? ORDER BY id DESC LIMIT 1',
		[userId, `${prefix}-%`]
	);

	let sequence = 1;
	if (rows.length > 0) {
		const lastNumber = rows[0].number;
		const lastSequence = parseInt(lastNumber.split('-').pop());
		if (!isNaN(lastSequence)) {
			sequence = lastSequence + 1;
		}
	}

	const number = `${prefix}-${String(sequence).padStart(3, '0')}`;

	// 2. Prepare Data
	const { client, items, settings, totals } = invoiceData;

	// Snapshot of the invoice content (client info + products at this moment)
	const content = JSON.stringify({
		client,
		items,
		settings // Settings at the time of invoice (e.g. auto_entrepreneur status)
	});

	const status = 'final'; // Immutable by default as requested

	// 3. Insert into DB
	const [result] = await db.query(
		`INSERT INTO invoices (
            user_id, client_id, number, date, due_date, status, 
            total_ht, total_tax, total_ttc, content
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			userId,
			client.id,
			number,
			new Date(), // Current date
			new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Due date +30 days (default)
			status,
			totals.ht,
			totals.tax,
			totals.ttc,
			content
		]
	);

	return result.insertId;
}

export async function getInvoicesByUserId(userId) {
	const [rows] = await db.query(
		'SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC',
		[userId]
	);
	return rows;
}

export async function getInvoiceById(invoiceId) {
	const [rows] = await db.query('SELECT * FROM invoices WHERE id = ?', [invoiceId]);
	if (rows.length === 0) return null;

	const invoice = rows[0];
	if (typeof invoice.content === 'string') {
		invoice.content = JSON.parse(invoice.content);
	}
	return invoice;
}
