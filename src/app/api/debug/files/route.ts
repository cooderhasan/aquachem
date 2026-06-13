import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    const diagnostics: any = {
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV,
        cwd: process.cwd(),
    };

    const uploadsDir = process.env.NODE_ENV === 'production'
        ? '/app/public/uploads'
        : path.join(process.cwd(), 'public', 'uploads');

    diagnostics.targetUploadsDir = uploadsDir;

    // 1. Check if directory exists
    try {
        diagnostics.exists = fs.existsSync(uploadsDir);
        if (diagnostics.exists) {
            const stat = fs.statSync(uploadsDir);
            diagnostics.isDirectory = stat.isDirectory();
            diagnostics.mode = stat.mode.toString(8);
            diagnostics.uid = stat.uid;
            diagnostics.gid = stat.gid;
        }
    } catch (err: any) {
        diagnostics.existsError = {
            message: err.message,
            code: err.code
        };
    }

    // 2. Check writability
    const testFilePath = path.join(uploadsDir, 'test-write.txt');
    try {
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        fs.writeFileSync(testFilePath, `Write test at ${new Date().toISOString()}`);
        diagnostics.writable = true;
        diagnostics.testFileContent = fs.readFileSync(testFilePath, 'utf-8');
        fs.unlinkSync(testFilePath);
    } catch (err: any) {
        diagnostics.writable = false;
        diagnostics.writeError = {
            message: err.message,
            code: err.code
        };
    }

    // 3. List files (limit to first 50)
    try {
        if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            diagnostics.fileCount = files.length;
            diagnostics.filesSample = files.slice(0, 50);
        }
    } catch (err: any) {
        diagnostics.listError = {
            message: err.message,
            code: err.code
        };
    }

    // 4. Test fetch and download of a real image from source
    const testImageUrl = 'https://aquachem.hasandurmus.com/api/files/2f97af5c-e671-46b5-83fc-3e45879170e9-likitcittemizlemernleri.webp';
    const testDestName = 'test-download-image.webp';
    const testDestPath = path.join(uploadsDir, testDestName);

    try {
        diagnostics.downloadTest = { url: testImageUrl };
        const res = await fetch(testImageUrl);
        diagnostics.downloadTest.status = res.status;
        diagnostics.downloadTest.ok = res.ok;
        
        if (res.ok) {
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            fs.writeFileSync(testDestPath, buffer);
            diagnostics.downloadTest.saved = true;
            diagnostics.downloadTest.savedSize = buffer.length;
            
            // Clean up
            fs.unlinkSync(testDestPath);
        }
    } catch (err: any) {
        diagnostics.downloadTest.error = {
            message: err.message,
            code: err.code,
            stack: err.stack
        };
    }

    return NextResponse.json(diagnostics);
}
