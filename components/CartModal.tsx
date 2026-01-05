
import React, { useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { XIcon, PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const { t } = useSettings();
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
    >
        <div 
            className="fixed inset-0"
            onClick={onClose}
        />
        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl h-full flex flex-col transform transition-transform duration-300 ease-in-out animate-fadeIn" style={{ animationName: 'slideInRight' }}>
            <style>{`
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            `}</style>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 id="cart-modal-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">{t.yourCart}</h2>
                <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    aria-label={t.close}
                >
                    <XIcon size={24} />
                </button>
            </div>

            {/* Cart Items */}
            {cartItems.length > 0 ? (
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                            <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">{item.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">${item.price.toLocaleString()}</p>
                                <div className="flex items-center mt-2">
                                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"><MinusIcon size={12}/></button>
                                        <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"><PlusIcon size={12} /></button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="font-bold text-gray-800 dark:text-gray-100">${(item.price * item.quantity).toLocaleString()}</p>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 mt-2" aria-label={`${t.remove} ${item.name}`}>
                                    <TrashIcon size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
                    <ShoppingCartIcon size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t.emptyCart}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{t.emptyCartPrompt}</p>
                 </div>
            )}
            
            {/* Footer */}
            {cartItems.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="flex justify-between font-semibold">
                        <span>{t.subtotal}</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={onCheckout}
                        className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)]"
                    >
                        {t.checkout}
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default CartModal;
