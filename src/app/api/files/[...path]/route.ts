import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathSegments } = await params;
        const filePath = path.join(process.cwd(), 'public/uploads', ...pathSegments);

        // Security: prevent directory traversal
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        if (!filePath.startsWith(uploadsDir)) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
        }

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        const ext = path.extname(fileName).toLowerCase();

        // Determine content type
        const contentTypes: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        };

        const contentType = contentTypes[ext] || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${fileName}"`,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('File serve error:', error);
        return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
    }
}
