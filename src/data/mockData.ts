import { Sparkles, Droplet, ShieldCheck, Shirt, AlertCircle, TestTube, Car, LucideIcon } from 'lucide-react';

export interface Category {
    id: number;
    title: string;
    slug: string;
    icon: LucideIcon;
    color: string;
    image: string;
}

export interface Product {
    id: number;
    title: string;
    slug: string;
    categoryId: number;
    description: string;
    image: string;
    // Extended fields for detail page
    subtitle?: string;
    usageArea?: string;
    features?: string[];
}

export const categories: Category[] = [
    {
        id: 1,
        title: 'Genel Temizlik',
        slug: 'genel-temizlik',
        icon: Sparkles,
        color: 'bg-blue-500',
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'Likit Cilt Temizleme',
        slug: 'likit-cilt-temizleme',
        icon: Droplet,
        color: 'bg-rose-500',
        image: 'https://images.unsplash.com/photo-1616091322045-8f358be9f7fa?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 3,
        title: 'Dezenfektan Grubu',
        slug: 'dezenfektan-grubu',
        icon: ShieldCheck,
        color: 'bg-teal-500',
        image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 4,
        title: 'Bulaşık Yıkama',
        slug: 'bulasik-yikama',
        icon: Sparkles,
        color: 'bg-yellow-500',
        image: 'https://images.unsplash.com/photo-1585837575652-2c6bfd0b2306?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 5,
        title: 'Çamaşır Yıkama',
        slug: 'camasir-yikama',
        icon: Shirt,
        color: 'bg-indigo-500',
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 6,
        title: 'Oda Parfüm Grubu',
        slug: 'oda-parfum-grubu',
        icon: AlertCircle,
        color: 'bg-purple-500',
        image: 'https://images.unsplash.com/photo-1603123853880-a92fafb7a976?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 7,
        title: 'Teknik Grup',
        slug: 'teknik-grup',
        icon: TestTube,
        color: 'bg-slate-500',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 8,
        title: 'Oto Bakım Grubu',
        slug: 'oto-bakim-grubu',
        icon: Car,
        color: 'bg-red-500',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 9,
        title: 'Kazan Kimyasalları',
        slug: 'kazan-kimyasallari',
        icon: TestTube,
        color: 'bg-orange-500',
        image: 'https://images.unsplash.com/photo-1579267130635-a745c92c8429?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 10,
        title: 'Tekstil Kimyasalları',
        slug: 'tekstil-kimyasallari',
        icon: Shirt,
        color: 'bg-cyan-500',
        image: 'https://images.unsplash.com/photo-1530982011887-3cc11cc85693?q=80&w=600&auto=format&fit=crop'
    },
];

export const products: Product[] = [
    {
        id: 101,
        title: 'PENGUIN 10',
        slug: 'penguin-10',
        categoryId: 2,
        description: 'Endüstriyel Cilt Temizleme Ürünü (Kremli)',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
        subtitle: 'Endüstriyel Cilt Temizleme Ürünü (Kremli)',
        usageArea: 'Oto tamirhaneleri, boya sanayi, matbaalar, inşaat sektörü, metal sanayi.',
        features: ['Güçlü formül', 'Cildi korur', 'Hoş kokulu']
    },
    {
        id: 102,
        title: 'PENGUIN 20',
        slug: 'penguin-20',
        categoryId: 2,
        description: 'Endüstriyel Cilt Temizleme Ürünü (Granüllü)',
        image: 'https://images.unsplash.com/photo-1556228720-1987594a8dae?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 103,
        title: 'PENGUIN 30',
        slug: 'penguin-30',
        categoryId: 2,
        description: 'Ağır Kir ve Yağ Sökücü El Sabunu',
        image: 'https://images.unsplash.com/photo-1616091322045-8f358be9f7fa?q=80&w=400&auto=format&fit=crop'
    },
    { id: 104, title: 'PENGUIN 40', slug: 'penguin-40', categoryId: 2, description: 'Antibakteriyel El Temizleyici', image: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?q=80&w=400&auto=format&fit=crop' },
    { id: 105, title: 'PENGUIN 50', slug: 'penguin-50', categoryId: 2, description: 'Köpük El Sabunu', image: 'https://images.unsplash.com/photo-1585837575652-2c6bfd0b2306?q=80&w=400&auto=format&fit=crop' },
    { id: 106, title: 'PENGUIN 60', slug: 'penguin-60', categoryId: 2, description: 'Hassas Ciltler İçin Temizleyici', image: 'https://images.unsplash.com/photo-1556228578-8d8442d64a03?q=80&w=400&auto=format&fit=crop' },
    { id: 107, title: 'PENGUIN 70', slug: 'penguin-70', categoryId: 2, description: 'Yoğun Nemlendiricili Cilt Temizleyici', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=400&auto=format&fit=crop' },
    { id: 108, title: 'PENGUIN 80', slug: 'penguin-80', categoryId: 2, description: 'Mekanik Temizleme Tozu', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=400&auto=format&fit=crop' },
    { id: 109, title: 'PENGUIN 90', slug: 'penguin-90', categoryId: 2, description: 'Susuz El Temizleme Jeli', image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=400&auto=format&fit=crop' },
    { id: 110, title: 'PENGUIN 100', slug: 'penguin-100', categoryId: 2, description: 'Dezenfektanlı Cilt Sabunu', image: 'https://images.unsplash.com/photo-1584472376859-069137f61c3f?q=80&w=400&auto=format&fit=crop' },
];

export interface Reference {
    id: number;
    name: string;
    logo: string;
    categoryId: number; // Linked to Category.id
}

export const references: Reference[] = [
    { id: 1, name: "Referans 1", logo: "https://placehold.co/200x100/e2e8f0/475569?text=LOGO+1", categoryId: 1 }, // Genel Temizlik
    { id: 2, name: "Referans 2", logo: "https://placehold.co/200x100/e2e8f0/475569?text=LOGO+2", categoryId: 2 }, // Likit Cilt
    { id: 3, name: "Referans 3", logo: "https://placehold.co/200x100/e2e8f0/475569?text=LOGO+3", categoryId: 7 }, // Teknik
    { id: 4, name: "Referans 4", logo: "https://placehold.co/200x100/e2e8f0/475569?text=LOGO+4", categoryId: 8 }, // Oto Bakım
    { id: 5, name: "Referans 5", logo: "https://placehold.co/200x100/e2e8f0/475569?text=LOGO+5", categoryId: 9 }, // Kazan Kimyasalları
    { id: 6, name: "Referans 6", logo: "https://placehold.co/200x100/e2e8f0/475569?text=LOGO+6", categoryId: 1 }, // Genel Temizlik
];
