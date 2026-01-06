
import React, { useState, useContext, useEffect } from 'react';
import { Product, Translation } from '../types';
import { CartContext } from '../context/CartContext';
import { XIcon, PlusIcon, MinusIcon } from './Icons';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  t: Translation;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, t }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useContext(CartContext);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuantity(1);
      setAdded(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
        setAdded(false);
        onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4 sm:p-6 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden transform transition-all duration-500 ease-out animate-fadeInUp relative border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all z-20 border border-white/10"
        >
          <XIcon size={24} />
        </button>

        <div className="w-full md:w-1/2 h-80 md:h-auto overflow-hidden relative">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col overflow-y-auto bg-slate-50 dark:bg-gray-900">
            <div className="flex-grow space-y-6">
                <div>
                    <h2 className="text-xs font-semibold capitalize text-[var(--accent-color)] mb-2">Chi tiết sản phẩm</h2>
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white leading-tight">
                        {product.name}
                    </h2>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]">
                        ₫{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Giá niêm yết</span>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent"></div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm font-light">
                    {product.long_description || product.description}
                </p>
            </div>

            <div className="mt-10 space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold capitalize text-gray-400">Số lượng</span>
                    <div className="flex items-center bg-white dark:bg-gray-800 p-1 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-500 hover:text-[var(--accent-color)] transition-colors"><MinusIcon size={14}/></button>
                        <span className="px-6 text-lg font-bold min-w-[60px] text-center">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-500 hover:text-[var(--accent-color)] transition-colors"><PlusIcon size={14}/></button>
                    </div>
                </div>

                 <button 
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`w-full py-4 text-sm font-semibold capitalize text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:opacity-80 animate-breathingGlow ${added ? 'from-emerald-500 to-teal-600' : ''}`}
                >
                    {added ? "Đã thêm thành công!" : "Xác nhận mua hàng"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
