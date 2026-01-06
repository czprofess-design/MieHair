
import React, { useEffect, useState } from 'react';
import { CheckIcon, XIcon, QuestionMarkCircleIcon, StopIcon } from './Icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastProps {
    toast: ToastMessage;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onClose(toast.id), 300); // Wait for exit animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onClose(toast.id), 300);
    };

    const styles = {
        success: {
            icon: <CheckIcon size={20} className="text-emerald-500" />,
            border: 'border-l-emerald-500',
            bg: 'bg-white dark:bg-slate-800'
        },
        error: {
            icon: <StopIcon size={20} className="text-rose-500" />,
            border: 'border-l-rose-500',
            bg: 'bg-white dark:bg-slate-800'
        },
        warning: {
            icon: <QuestionMarkCircleIcon size={20} className="text-amber-500" />,
            border: 'border-l-amber-500',
            bg: 'bg-white dark:bg-slate-800'
        },
        info: {
            icon: <QuestionMarkCircleIcon size={20} className="text-sky-500" />,
            border: 'border-l-sky-500',
            bg: 'bg-white dark:bg-slate-800'
        }
    };

    const style = styles[toast.type];

    return (
        <div 
            className={`
                flex items-center gap-3 px-4 py-3 min-w-[300px] max-w-md
                rounded-lg shadow-xl border border-gray-100 dark:border-slate-700
                border-l-4 ${style.border} ${style.bg}
                transform transition-all duration-300 ease-in-out
                ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
            `}
            role="alert"
        >
            <div className="flex-shrink-0">{style.icon}</div>
            <p className="flex-grow text-sm font-medium text-gray-700 dark:text-gray-200">
                {toast.message}
            </p>
            <button 
                onClick={handleClose} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
                <XIcon size={16} />
            </button>
        </div>
    );
};

export default Toast;
