
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';
import { Product } from '../types';
import ProductModal from './ProductModal';
import { useSettings } from '../context/SettingsContext';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { t } = useSettings();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }); 

        if (dbError) throw dbError;
        setProducts(data || []);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng kiểm tra lại cấu hình Supabase.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 animate-pulse font-bold tracking-widest uppercase text-xs">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-rose-500 bg-rose-100 dark:bg-rose-900/30 p-6 rounded-2xl border border-rose-200 font-semibold">{error}</div>;
  }

  if (products.length === 0) {
      return (
        <div className="text-center py-20 bg-white/40 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl border border-black/5">
            <p className="text-gray-400 font-medium">Chưa có sản phẩm nào được hiển thị.</p>
        </div>
      );
  }

  return (
    <div className="w-full space-y-10 animate-fadeInUp">
        <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--accent-color-dark)] dark:to-[var(--gradient-to)] pb-2 uppercase tracking-tighter">
                Sản phẩm & Dịch vụ
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} t={t} />
            ))}
        </div>

        {selectedProduct && (
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                t={t}
            />
        )}
    </div>
  );
};

export default ProductList;
