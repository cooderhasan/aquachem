
import { db } from '../lib/db';
import { posts } from '../db/schema';

async function check() {
    console.log('Checking posts table...');
    try {
        const data = await db.select().from(posts).limit(1);
        console.log('Posts table exists. Data:', data);
    } catch (error) {
        console.error('Error checking posts table:', error);
    }
    process.exit(0);
}

check();
