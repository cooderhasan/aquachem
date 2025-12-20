
import { db } from '@/lib/db';
import { stats } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function TestStatsPage() {
    let result;
    let errorMsg;

    try {
        result = await db.select().from(stats);
    } catch (e: any) {
        errorMsg = e.message;
        console.error(e);
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Debug Stats Connection</h1>
            {errorMsg ? (
                <div className="bg-red-100 p-4 rounded text-red-800">
                    <h2 className="font-bold">Error:</h2>
                    <pre>{errorMsg}</pre>
                </div>
            ) : (
                <div className="bg-green-100 p-4 rounded text-green-800">
                    <h2 className="font-bold">Success!</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
