'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>World of Books</h1>

      {products.length === 0 && <p>No products found</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 20,
          marginTop: 20,
        }}
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            style={{
              border: '1px solid #ddd',
              padding: 10,
              textDecoration: 'none',
              color: 'black',
            }}
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
              />
            )}

            <h3 style={{ marginTop: 10 }}>{product.title}</h3>
            <p>{product.price || 'Price not available'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
