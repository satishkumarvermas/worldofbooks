'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: number;
  title: string;
  price: string;
  imageUrl: string;
  productUrl: string;
};

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/products`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find(
          (p: Product) => p.id === Number(params.id)
        );
        setProduct(found);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="h-80 mx-auto mb-6 object-contain"
      />

      <h1 className="text-2xl font-bold mb-2">
        {product.title}
      </h1>

      <p className="text-green-600 font-bold text-lg mb-4">
        {product.price || 'Price not available'}
      </p>

      <a
        href={product.productUrl}
        target="_blank"
        className="text-blue-600 underline"
      >
        View on WorldOfBooks
      </a>
    </main>
  );
}
