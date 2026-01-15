'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p: any) => String(p.id) === String(id));
        setProduct(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Product not found</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{product.title}</h1>

      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.title}
          style={{ maxWidth: 300, marginBottom: 20 }}
        />
      )}

      <p>
        <strong>Price:</strong>{' '}
        {product.price ? product.price : 'Not available'}
      </p>

      <p style={{ marginTop: 20 }}>
        <a href="/" style={{ color: 'blue' }}>
          ← Back to products
        </a>
      </p>
    </div>
  );
}
