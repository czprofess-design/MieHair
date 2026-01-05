import React, { useEffect } from 'react';
import { XIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="group border-b border-gray-200 dark:border-gray-700 py-4 last:border-b-0" open>
    <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center text-gray-800 dark:text-gray-200 group-hover:text-[var(--accent-color)] dark:group-hover:text-[var(--accent-color-dark)] transition-colors">
      {title}
      <span className="transform transition-transform duration-200 group-open:rotate-180 text-sm">▼</span>
    </summary>
    <div className="mt-4 text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none">
      {children}
    </div>
  </details>
);

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
    const { t } = useSettings();

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-guide-modal-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-out animate-fadeInUp"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 id="user-guide-modal-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">{t.howToUseThisApp}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        aria-label={t.close}
                    >
                        <XIcon size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    <GuideSection title={t.userGuide_s1_title}>
                      <ul>
                        <li><strong>{t.userGuide_s1_l1_strong}</strong> {t.userGuide_s1_l1_text}</li>
                        <li><strong>{t.userGuide_s1_l2_strong}</strong> {t.userGuide_s1_l2_text}</li>
                        <li><strong>{t.userGuide_s1_l3_strong}</strong> {t.userGuide_s1_l3_text}</li>
                        <li><strong>{t.userGuide_s1_l4_strong}</strong> {t.userGuide_s1_l4_text}</li>
                      </ul>
                    </GuideSection>

                    <GuideSection title={t.userGuide_s2_title}>
                       <ul>
                        <li><strong>{t.userGuide_s2_l1_strong}</strong> {t.userGuide_s2_l1_text}</li>
                        <li><strong>{t.userGuide_s2_l2_strong}</strong> {t.userGuide_s2_l2_text}</li>
                        <li><strong>{t.userGuide_s2_l3_strong}</strong> {t.userGuide_s2_l3_text}</li>
                        <li><strong>{t.userGuide_s2_l4_strong}</strong> {t.userGuide_s2_l4_text}</li>
                        <li><strong>{t.userGuide_s2_l5_strong}</strong> {t.userGuide_s2_l5_text}</li>
                      </ul>
                    </GuideSection>

                    <GuideSection title={t.userGuide_s3_title}>
                      <ul>
                        <li><strong>{t.userGuide_s3_l1_strong}</strong> {t.userGuide_s3_l1_text}</li>
                        <li><strong>{t.userGuide_s3_l2_strong}</strong> {t.userGuide_s3_l2_text}</li>
                         <li><strong>{t.userGuide_s3_l3_strong}</strong> {t.userGuide_s3_l3_text}</li>
                         <li><strong>{t.userGuide_s3_l4_strong}</strong> {t.userGuide_s3_l4_text}</li>
                      </ul>
                    </GuideSection>
                    
                    <GuideSection title={t.userGuide_s4_title}>
                         <ul>
                            <li><strong>{t.userGuide_s4_l1_strong}</strong> {t.userGuide_s4_l1_text}</li>
                            <li><strong>{t.userGuide_s4_l2_strong}</strong> {t.userGuide_s4_l2_text}</li>
                            <li><strong>{t.userGuide_s4_l3_strong}</strong> {t.userGuide_s4_l3_text}</li>
                        </ul>
                    </GuideSection>

                    <GuideSection title={t.userGuide_s5_title}>
                         <ul>
                            <li><strong>{t.userGuide_s5_l1_strong}</strong> {t.userGuide_s5_l1_text}</li>
                            <li><strong>{t.userGuide_s5_l2_strong}</strong> {t.userGuide_s5_l2_text}</li>
                            <li><strong>{t.userGuide_s5_l3_strong}</strong> {t.userGuide_s5_l3_text}</li>
                        </ul>
                    </GuideSection>
                </div>
            </div>
        </div>
    );
};

export default UserGuideModal;
