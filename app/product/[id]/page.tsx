"use client"

import React, { useEffect, useState, use } from 'react';

export default function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const { id } = params;
    const [product, setProduct] = useState<{ name: string; description: string } | null>(null);

    useEffect(() => {
        // Simulate fetching product data
        async function fetchProduct() {
            // Replace with actual API call
            const data = {
                name: `Product ${id}`,
                description: `Description for product ${id}`,
            };
            setProduct(data);
        }
        fetchProduct();
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
        </div>
    );
}