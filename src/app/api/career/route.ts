import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { db } from "@/lib/db";
import { applications } from "@/db/schema";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const position = formData.get("position") as string;
        const cv = formData.get("cv") as File | null;

        // Validation
        if (!name || !email || !cv) {
            return NextResponse.json(
                { error: "Lütfen zorunlu alanları doldurunuz." },
                { status: 400 }
            );
        }

        let cvUrl = null;
        let attachments = [];

        // Handle CV File
        if (cv) {
            const buffer = Buffer.from(await cv.arrayBuffer());

            // 1. Prepare for Email Attachment
            attachments.push({
                filename: cv.name,
                content: buffer,
            });

            // 2. Save to Disk for Admin Panel (best effort)
            try {
                // Ensure upload directory exists
                const uploadDir = join(process.cwd(), "public", "uploads", "cvs");
                await mkdir(uploadDir, { recursive: true });

                // Create unique filename
                const filename = `${uuidv4()}-${cv.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
                const filepath = join(uploadDir, filename);

                // Write file
                await writeFile(filepath, buffer);

                // Set URL
                cvUrl = `/uploads/cvs/${filename}`;
            } catch (err) {
                console.error("Error saving CV file locally:", err);
                // Continue without saving file to disk, but still send email
            }
        }

        // Save to Database
        try {
            await db.insert(applications).values({
                name,
                email,
                phone,
                position: position || "-",
                cvUrl: cvUrl || "",
            });
        } catch (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json(
                { error: "Veritabanı hatası" },
                { status: 500 }
            );
        }

        // Email content
        const html = `
            <h2>Yeni İş Başvurusu</h2>
            <p><strong>Ad Soyad:</strong> ${name}</p>
            <p><strong>E-posta:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone || "-"}</p>
            <p><strong>Pozisyon:</strong> ${position || "-"}</p>
            ${cv ? `<p><strong>CV:</strong> Dosya ektedir (${cv.name})</p>` : "<p><strong>CV:</strong> Yüklenmedi</p>"}
        `;

        const text = `
            Yeni İş Başvurusu
            Ad Soyad: ${name}
            E-posta: ${email}
            Telefon: ${phone || "-"}
            Pozisyon: ${position || "-"}
            CV: Dosya ektedir (${cv ? cv.name : "Yüklenmedi"})
        `;

        // Send Email (Fire and forget - don't await if you want speed, but for debug lets await)
        // Testing with Gmail first as requested before
        try {
            await sendMail({
                to: ["info@aquachems.com", "onurvarol@aquachems.com", "selimvarol@aquachems.com"],
                subject: `İş Başvurusu: ${name} - ${position || "Genel"}`,
                text,
                html,
                attachments
            });
        } catch (mailError) {
            console.error("Mail sending error:", mailError);
            // Don't fail the request if mail fails, since we saved to DB
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Job application error:", error);
        return NextResponse.json(
            { error: "Sunucu hatası oluştu" },
            { status: 500 }
        );
    }
}
