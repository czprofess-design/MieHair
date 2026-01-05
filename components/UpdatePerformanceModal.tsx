import React, { useState, useEffect } from 'react';
import { XIcon, StarIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';
import { PerformanceReview } from '../types';

interface UpdatePerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (review: PerformanceReview) => void;
  review: PerformanceReview;
}

const UpdatePerformanceModal: React.FC<UpdatePerformanceModalProps> = ({ isOpen, onClose, onSave, review }) => {
  const { t } = useSettings();
  const [score, setScore] = useState(review.score);
  const [comments, setComments] = useState(review.comments);
  
  useEffect(() => {
    if (isOpen) {
      setScore(review.score);
      setComments(review.comments);
    }
  }, [isOpen, review]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
        ...review,
        score,
        comments,
        reviewDate: new Date().toISOString().split('T')[0] // Update review date to today
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="performance-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-fadeInUp"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
            <div className="p-6 relative">
                <button 
                    type="button"
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                    aria-label={t.close}
                >
                    <XIcon size={24} />
                </button>
                <h2 id="performance-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.editPerformanceReview}</h2>
                
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.score}</label>
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <button type="button" key={i} onClick={() => setScore(i + 1)}>
                                    <StarIcon 
                                        size={28} 
                                        className={`cursor-pointer transition-colors ${i < score ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'}`} 
                                        fill={i < score ? 'currentColor' : 'none'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.comments}</label>
                        <textarea
                            id="comments"
                            rows={4}
                            value={comments}
                            onChange={e => setComments(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm"
                        />
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 flex justify-end items-center space-x-3 rounded-b-2xl">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 shadow-sm transition-colors">{t.cancel}</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-md shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none">{t.save}</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePerformanceModal;
