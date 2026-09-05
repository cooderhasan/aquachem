const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    await client.connect();
    console.log('Connected to DB');

    console.log('Adding google_analytics_id column to settings table if not exists...');
    await client.query(`
        ALTER TABLE settings 
        ADD COLUMN IF NOT EXISTS google_analytics_id TEXT;
    `);
    console.log('Column added.');

    console.log('Updating settings with Google tag G-4LRD88KMRC...');
    await client.query(`
        UPDATE settings 
        SET google_analytics_id = 'G-4LRD88KMRC'
        WHERE google_analytics_id IS NULL OR google_analytics_id = '';
    `);

    const res = await client.query('SELECT id, google_analytics_id FROM settings LIMIT 1');
    console.log('Current settings record:', res.rows[0]);

    await client.end();
    console.log('Migration finished successfully!');
}

main().catch(err => {
    console.error('Error running migration:', err);
    process.exit(1);
});
