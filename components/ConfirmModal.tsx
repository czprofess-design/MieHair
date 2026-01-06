
import React, { useEffect } from 'react';
import { TrashIcon, XIcon, StopIcon, QuestionMarkCircleIcon } from './Icons';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info'; // Determines icon and color
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Xác nhận", 
    cancelText = "Hủy",
    type = 'danger'
}) => {
    
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

    const colors = {
        danger: {
            bgIcon: 'bg-rose-100 dark:bg-rose-500/20',
            textIcon: 'text-rose-600 dark:text-rose-500',
            btnBg: 'bg-rose-600 hover:bg-rose-700',
            icon: <TrashIcon size={32} />
        },
        warning: {
            bgIcon: 'bg-amber-100 dark:bg-amber-500/20',
            textIcon: 'text-amber-600 dark:text-amber-500',
            btnBg: 'bg-amber-600 hover:bg-amber-700',
            icon: <StopIcon size={32} />
        },
        info: {
            bgIcon: 'bg-sky-100 dark:bg-sky-500/20',
            textIcon: 'text-sky-600 dark:text-sky-500',
            btnBg: 'bg-sky-600 hover:bg-sky-700',
            icon: <QuestionMarkCircleIcon size={32} />
        }
    };

    const style = colors[type];

    return (
        <div 
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 transform transition-all animate-fadeInUp overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${style.bgIcon} ${style.textIcon}`}>
                        {style.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
                        {message}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button 
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all transform active:scale-95 ${style.btnBg}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
