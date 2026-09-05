const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const DEFAULT_AI_PROMPT = `Aquachems endüstriyel kimyasal ürünleri için açıklama yazıyorsun. Şu kurallara uy:

1. SEO ODAKLI YAZ: Ürün adını ve sektör anahtar kelimelerini ilk cümlede kullan. Google'da üst sıralarda çıkacak şekilde doğal keyword yerleştir.
2. TEKNİK BİLGİYİ KORU: Mevcut metindeki teknik bilgileri, kullanım oranlarını ve güvenlik detaylarını koru, uydurma bilgi ekleme.
3. VURGULAMA VE FORMAT: Önemli ürün avantajlarını, etki mekanizmasını ve teknik özellikleri **kalın** yazarak vurgula.
4. ENDÜSTRİYEL KİMYA DİLİ: Su şartlandırma, kazan ve soğutma suyu, ters ozmoz (RO), membran kimyasalları, dezenfektan ve endüstriyel temizlik alanlarındaki uzmanlığı yansıt.
5. İKİ DİL UYUMU: Türkçe ve İngilizce açıklamaların birbiriyle birebir uyumlu, profesyonel B2B ihracat standartlarında olmasını sağla.`;

async function main() {
    await client.connect();
    console.log('Connected to DB');

    // 1. Add columns if not exist
    console.log('Adding ai_prompt and ai_model columns to settings if not exists...');
    await client.query(`
        ALTER TABLE settings 
        ADD COLUMN IF NOT EXISTS ai_prompt TEXT,
        ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'openai/gpt-4o-mini';
    `);
    console.log('Columns added successfully.');

    // 2. Set default prompt if currently null or empty
    const checkRes = await client.query('SELECT id, ai_prompt, ai_model FROM settings LIMIT 1');
    if (checkRes.rows.length > 0) {
        const row = checkRes.rows[0];
        if (!row.ai_prompt) {
            console.log('Setting default SEO prompt in settings table...');
            await client.query('UPDATE settings SET ai_prompt = $1, ai_model = COALESCE(ai_model, $2) WHERE id = $3', [
                DEFAULT_AI_PROMPT,
                'openai/gpt-4o-mini',
                row.id
            ]);
            console.log('Default AI prompt saved to settings.');
        } else {
            console.log('Existing ai_prompt found:', row.ai_prompt.substring(0, 50) + '...');
        }
    } else {
        console.log('No settings row found, inserting initial row...');
        await client.query('INSERT INTO settings (ai_prompt, ai_model) VALUES ($1, $2)', [
            DEFAULT_AI_PROMPT,
            'openai/gpt-4o-mini'
        ]);
        console.log('Settings row created.');
    }

    await client.end();
    console.log('Migration completed successfully.');
}

main().catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
});
