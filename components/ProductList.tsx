
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
        setError('Không thể tải danh sách sản phẩm. Vui lòng kiểm tra lại kết nối.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--accent-color)]/20 rounded-full"></div>
            <div className="absolute top-0 w-16 h-16 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[var(--accent-color)] animate-pulse font-semibold text-xs capitalize">Đang khởi tạo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-rose-500/10 rounded-3xl border border-rose-500/20 backdrop-blur-xl animate-fadeIn">
        <p className="text-rose-500 font-semibold mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-16 py-10">
        <div className="text-center space-y-4 animate-fadeInDown">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 text-[var(--accent-color)] text-xs font-semibold capitalize mb-2">
                Premium Collection
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] pb-2 capitalize drop-shadow-sm">
                Sản phẩm nổi bật
            </h1>
            <div className="h-1.5 w-32 bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] mx-auto rounded-full shadow-[0_0_15px_var(--breathing-glow-color)]"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onProductClick={setSelectedProduct} 
                  t={t} 
                  index={index}
                />
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
