import React from 'react';
import { getCategories, getProduct } from '../actions';
import ProductForm from '../new/ProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    const [categories, product] = await Promise.all([
        getCategories(),
        getProduct(id)
    ]);

    if (!product) {
        return <div>Ürün bulunamadı.</div>;
    }

    // Cast properties to match ProductForm interface roughly
    // The DB product might have slight nuances (e.g. usage vs usageArea in mock data fallback)
    // We should normalize it or trust Drizzle/Mock intersection

    // Quick normalization for type safety if needed, 
    // but Drizzle schema and our Product interface should ideally match.
    // For mock data, we might need a little mapping if field names differ.
    // The mock data has `usageArea` while schema has `usage`.

    // Let's manually map just in case to be safe, especially given the "fallback" nature.
    const normalizedProduct = {
        id: product.id,
        title: product.title,
        categoryId: product.categoryId,
        description: product.description,
        usage: (product as any).usage || (product as any).usageArea || '',
        slug: product.slug,
        image: product.image
    };

    return (
        <ProductForm categories={categories} product={normalizedProduct} />
    );
}
