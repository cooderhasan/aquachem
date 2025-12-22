import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

        // Use /app/public/uploads for Docker (matches Coolify volume mount) or fallback to public/uploads for local dev
        const uploadDir = process.env.NODE_ENV === 'production'
            ? '/app/public/uploads'
            : path.join(process.cwd(), 'public/uploads');

        // Ensure directory exists
        try {
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
        } catch (dirError) {
            console.error('Failed to create upload directory:', dirError);
            return NextResponse.json({ error: 'Upload directory creation failed' }, { status: 500 });
        }

        const filePath = path.join(uploadDir, fileName);

        try {
            fs.writeFileSync(filePath, buffer);
        } catch (writeError) {
            console.error('Failed to write file:', writeError);
            return NextResponse.json({ error: 'File write failed' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            url: `/api/files/${fileName}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
