import { db } from './src/lib/db/mysql.js';

async function runMigrations() {
	try {
		console.log('Updating users table...');

		try {
			await db.query('ALTER TABLE users ADD COLUMN auto_entrepreneur TINYINT(1) DEFAULT 0');
			console.log('Added auto_entrepreneur column');
		} catch (e) {
			if (e.code === 'ER_DUP_FIELDNAME') {
				console.log('auto_entrepreneur column already exists');
			} else {
				console.log('Error adding auto_entrepreneur:', e.message);
			}
		}

		try {
			await db.query("ALTER TABLE users ADD COLUMN invoice_template VARCHAR(50) DEFAULT 'default'");
			console.log('Added invoice_template column');
		} catch (e) {
			if (e.code === 'ER_DUP_FIELDNAME') {
				console.log('invoice_template column already exists');
			} else {
				console.log('Error adding invoice_template:', e.message);
			}
		}

		console.log('Creating invoices table...');
		try {
			await db.query(`
                CREATE TABLE IF NOT EXISTS invoices (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    client_id INT NOT NULL,
                    number VARCHAR(50) NOT NULL,
                    date DATE NOT NULL,
                    due_date DATE,
                    status VARCHAR(20) DEFAULT 'final',
                    total_ht DECIMAL(10, 2) NOT NULL,
                    total_tax DECIMAL(10, 2) NOT NULL,
                    total_ttc DECIMAL(10, 2) NOT NULL,
                    content TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
			console.log('Invoices table created or already exists');

			// Add indexes separately
			await db.query('CREATE INDEX idx_user_id ON invoices(user_id)').catch(() => {});
			await db.query('CREATE INDEX idx_client_id ON invoices(client_id)').catch(() => {});
		} catch (e) {
			console.error('Error creating invoices table:', e);
			throw e;
		}

		console.log('Migration completed successfully.');
		process.exit(0);
	} catch (err) {
		console.error('Migration failed:', err);
		process.exit(1);
	}
}

runMigrations();
