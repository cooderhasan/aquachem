"use server";

import { db } from "@/lib/db";
import { certificates } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getCertificates() {
    try {
        const items = await db.select().from(certificates).orderBy(desc(certificates.id));
        return items;
    } catch (error) {
        console.error("Failed to fetch certificates:", error);
        return [];
    }
}

export async function getCertificate(id: number) {
    try {
        const items = await db.select().from(certificates).where(eq(certificates.id, id));
        return items[0];
    } catch (error) {
        console.error("Failed to fetch certificate:", error);
        return null;
    }
}

export async function createCertificate(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;

    if (!title || !image) {
        throw new Error("Title and image are required");
    }

    try {
        await db.insert(certificates).values({
            title,
            description,
            image,
        });
        revalidatePath("/admin/certificates");
        revalidatePath("/certificates");
    } catch (error) {
        console.error("Failed to create certificate:", error);
        throw new Error("Failed to create certificate");
    }

    redirect("/admin/certificates");
}

export async function updateCertificate(id: number, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;

    if (!title || !image) {
        throw new Error("Title and image are required");
    }

    try {
        await db.update(certificates)
            .set({
                title,
                description,
                image,
            })
            .where(eq(certificates.id, id));

        revalidatePath("/admin/certificates");
        revalidatePath("/certificates");
    } catch (error) {
        console.error("Failed to update certificate:", error);
        throw new Error("Failed to update certificate");
    }

    redirect("/admin/certificates");
}

export async function deleteCertificate(id: number) {
    try {
        await db.delete(certificates).where(eq(certificates.id, id));
        revalidatePath("/admin/certificates");
        revalidatePath("/certificates");
    } catch (error) {
        console.error("Failed to delete certificate:", error);
        throw new Error("Failed to delete certificate");
    }
}
