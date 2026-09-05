
import React from 'react';
import ProductForm from './ProductForm';
import { getCategories, getAiSettings } from '../actions';

export default async function NewProductPage() {
    const [categories, aiSettings] = await Promise.all([
        getCategories(),
        getAiSettings()
    ]);

    return <ProductForm categories={categories} initialAiSettings={aiSettings} />;
}
