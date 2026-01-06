
import React, { useContext, useState } from 'react';
import { Product, Translation } from '../types';
import { CartContext } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  t: Translation;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, t, index }) => {
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
      className="group relative bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl rounded-[2rem] shadow-xl hover:shadow-[var(--breathing-glow-color-strong)] border border-white/20 overflow-hidden transition-all duration-500 hover:-translate-y-3 cursor-pointer opacity-0 animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onProductClick(product)}
    >
      {/* Hiệu ứng viền Gradient khi hover */}
      <div className="absolute inset-0 p-[2px] rounded-[2rem] bg-gradient-to-br from-transparent to-transparent group-hover:from-[var(--gradient-from)] group-hover:to-[var(--gradient-to)] transition-all duration-700 -z-10 opacity-50"></div>

      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
            <p className="text-white text-xs font-semibold capitalize">Mie Exclusive</p>
        </div>

        <div className="absolute bottom-4 left-6 right-6 transform group-hover:translate-y-[-5px] transition-transform duration-500">
            <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md">
                {product.name}
            </h3>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed italic font-light">
            {product.description}
        </p>

        <div className="flex justify-between items-end">
          <div className="space-y-0">
             <p className="text-xs font-semibold text-gray-400 capitalize mb-1">Giá ưu đãi</p>
             <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] leading-none">
                ₫{product.price.toLocaleString()}
             </p>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={added}
            className={`h-10 px-6 text-xs font-semibold capitalize text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-2xl shadow-lg transform transition-all duration-300 hover:brightness-110 hover:shadow-[var(--breathing-glow-color)] active:scale-90 disabled:opacity-50 ${added ? 'from-emerald-500 to-teal-600 ring-2 ring-emerald-500/20' : ''}`}
          >
            {added ? "Done!" : "Mua ngay"}
          </button>
        </div>
      </div>

      {/* Trang trí góc thẻ */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[var(--gradient-from)]/20 to-transparent blur-2xl -z-10 group-hover:scale-150 transition-transform duration-700"></div>
    </div>
  );
};

export default ProductCard;
