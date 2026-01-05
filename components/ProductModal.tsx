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
      setQuantity(1); // Reset quantity when modal opens
      setAdded(false); // Reset added state
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
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden transform transition-all duration-300 ease-out animate-fadeInUp"
        onClick={e => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
            aria-label={t.close}
        >
          <XIcon size={28} />
        </button>
        <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
            <h2 id="product-modal-title" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--accent-color-dark)] dark:to-[var(--gradient-to)] pr-8">
                {product.name}
            </h2>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-2">${product.price.toLocaleString()}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-4 flex-grow">
                {product.long_description || product.description}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"><MinusIcon /></button>
                    <span className="px-4 text-lg font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"><PlusIcon /></button>
                </div>
                 <button 
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`flex-1 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)] disabled:opacity-80 disabled:cursor-not-allowed ${added ? 'bg-green-500 from-green-500 to-green-600' : ''}`}
                >
                    {added ? t.addedToCart : t.addToCart}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;