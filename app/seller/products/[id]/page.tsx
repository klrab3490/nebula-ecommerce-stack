"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { Edit, ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountedPrice?: number | null;
    sku: string;
    stock: number;
    images: string[];
    categories: string[];
    featured: boolean;
    createdAt: string;
    faq?: { question: string; answer: string }[];
}

export default function ProductViewPage() {
    const router = useRouter();
    const params = useParams() as { id?: string };
    const id = params?.id;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to load product');
                setProduct(data.product);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="py-12 text-center">Loading...</div>;
    if (error) return <div className="py-12 text-center text-red-600">{error}</div>;
    if (!product) return <div className="py-12 text-center">Product not found</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <h1 className="text-2xl font-bold">{product.name}</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {product.images && product.images.length > 0 ? (
                                <div className="w-full h-64 relative rounded-lg overflow-hidden">
                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center">No Image</div>
                            )}

                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                                <p className="text-sm text-muted-foreground">Categories: {product.categories.join(', ')}</p>
                                <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                                <p className="text-sm text-muted-foreground">Price: {product.price}</p>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button onClick={() => router.push(`/seller/products/${id}/edit`)}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button variant="destructive" onClick={async () => {
                                    if (!confirm('Delete this product? This cannot be undone.')) return;
                                    try {
                                        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
                                        if (!res.ok) throw new Error('Failed to delete product');
                                        router.push('/seller/products');
                                    } catch (err) {
                                        alert(err instanceof Error ? err.message : 'Error deleting product');
                                    }
                                }}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{product.description}</p>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
                                {product.faq && product.faq.length > 0 ? (
                                    <Accordion type="single" collapsible>
                                        {product.faq.map((item, idx) => (
                                            <AccordionItem key={idx} value={`faq-${idx}`}>
                                                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                                                <AccordionContent className="text-sm text-muted-foreground">{item.answer}</AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No FAQs added for this product.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
