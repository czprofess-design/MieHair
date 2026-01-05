
import React, { useContext, useState } from 'react';
import { Product, Translation } from '../types';
import { CartContext } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  t: Translation;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, t }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  
  return (
    <div 
      className="group relative bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
            <p className="text-white text-xs font-black uppercase tracking-widest">Premium</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white group-hover:text-[var(--accent-color)] transition-colors duration-300 truncate">
            {product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-[2.5em] leading-relaxed italic">
                {product.description}
            </p>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="space-y-0.5">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giá niêm yết</p>
             <p className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]">
                ₫{product.price.toLocaleString()}
             </p>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={added}
            className={`px-5 py-2.5 text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 ${added ? 'from-emerald-500 to-teal-600 ring-2 ring-emerald-500/20' : ''}`}
          >
            {added ? "Đã thêm!" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>

      {/* Hiệu ứng viền phát sáng khi hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--accent-color)]/30 rounded-3xl transition-colors duration-500 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;
