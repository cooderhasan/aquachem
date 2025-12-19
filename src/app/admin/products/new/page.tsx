
import React from 'react';
import ProductForm from './ProductForm';
import { getCategories } from '../actions';

export default async function NewProductPage() {
    const categories = await getCategories();

    return <ProductForm categories={categories} />;
}
