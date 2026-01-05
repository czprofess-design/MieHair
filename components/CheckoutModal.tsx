
import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { XIcon, CheckIcon } from './Icons';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { useSettings } from '../context/SettingsContext';


interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, session }) => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { t } = useSettings();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset states when modal opens
      setIsSuccess(false); 
      setIsProcessing(false);
      setError(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirmPurchase = async () => {
    if (!session || cartItems.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
        // 1. Create an order record
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: session.user.id,
                total_amount: subtotal,
            })
            .select('id')
            .single();

        if (orderError) throw orderError;

        const orderId = orderData.id;

        // 2. Create order_items records
        const orderItems = cartItems.map(item => ({
            order_id: orderId,
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
        }));
        
        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        
        if (itemsError) throw itemsError;
        
        // 3. Clear the user's cart
        await clearCart();

        // 4. Show success screen
        setIsSuccess(true);

    } catch (err: any) {
        console.error("Error processing purchase:", err);
        setError("Could not process your order. Please try again.");
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-fadeInUp"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 relative">
            <button 
                onClick={handleClose} 
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                aria-label={t.close}
            >
                <XIcon size={24} />
            </button>

            {isSuccess ? (
                <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
                        <CheckIcon size={32} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.purchaseSuccessful}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{t.purchaseSuccessfulMessage}</p>
                    <button 
                        onClick={handleClose}
                        className="mt-6 w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)]"
                    >
                        {t.close}
                    </button>
                </div>
            ) : (
                <>
                    <h2 id="checkout-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.checkoutTitle}</h2>
                    <div className="mt-4 border-t border-b border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 my-4 max-h-60 overflow-y-auto">
                        {cartItems.map(item => (
                            <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{t.quantity}: {item.quantity}</p>
                                </div>
                                <p className="font-medium text-gray-700 dark:text-gray-300">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>{t.total}</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>

                    {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}

                    <button 
                        onClick={handleConfirmPurchase}
                        disabled={cartItems.length === 0 || isProcessing}
                        className="mt-6 w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)] disabled:opacity-50"
                    >
                        {isProcessing ? 'Processing...' : t.confirmPurchase}
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
