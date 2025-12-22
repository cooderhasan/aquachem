import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
    const trMap: { [key: string]: string } = {
        'ç': 'c', 'Ç': 'c',
        'ğ': 'g', 'Ğ': 'g',
        'ş': 's', 'Ş': 's',
        'ü': 'u', 'Ü': 'u',
        'ı': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o'
    };

    return text
        .replace(/[çÇğĞşŞüÜıİöÖ]/g, (match) => trMap[match])
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-word chars
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-'); // Replace multiple - with single -
}
