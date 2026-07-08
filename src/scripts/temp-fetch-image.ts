const { Pool } = require('pg');
require('dotenv').config();

async function check() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const client = await pool.connect();
        const res = await client.query('SELECT * FROM "references" ORDER BY "id" DESC');
        client.release();
        
        console.log(`Checking ${res.rows.length} references...`);
        
        for (const ref of res.rows) {
            const imageUrl = `https://aquachems.com${ref.image}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const start = Date.now();
            
            try {
                const imgRes = await fetch(imageUrl, { signal: controller.signal });
                clearTimeout(timeoutId);
                console.log(`[ID ${ref.id}] ${ref.title}: Status ${imgRes.status} (${Date.now() - start}ms)`);
            } catch (e: any) {
                clearTimeout(timeoutId);
                if (e.name === 'AbortError') {
                    console.error(`🔴 [ID ${ref.id}] ${ref.title}: TIMED OUT! URL: ${imageUrl}`);
                } else {
                    console.error(`🔴 [ID ${ref.id}] ${ref.title}: FAILED (${e.message})`);
                }
            }
        }
    } catch (e) {
        console.error("DB query failed:", e);
    }
    await pool.end();
}

check();
