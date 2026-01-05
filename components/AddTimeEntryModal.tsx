import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';
import { EMPLOYEES } from '../constants';
// FIX: Import TimeEntry type to resolve type errors.
import { TimeEntry } from '../types';

interface AddTimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Change onSave signature to be more flexible and align with TimeEntry structure
  onSave: (entry: Partial<Omit<TimeEntry, 'id' | 'created_at'>>) => void;
}

const AddTimeEntryModal: React.FC<AddTimeEntryModalProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useSettings();
  // FIX: Change employeeId state to handle string IDs from profiles/constants.
  const [employeeId, setEmployeeId] = useState<string | undefined>();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setEmployeeId(undefined);
      setDate(new Date().toISOString().split('T')[0]); // Default to today
      setStartTime('09:00');
      setEndTime('17:00');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId && date && startTime) {
      // FIX: Construct a valid TimeEntry object for saving.
      const start_time = new Date(`${date}T${startTime}`).toISOString();
      const end_time = endTime ? new Date(`${date}T${endTime}`).toISOString() : null;
      
      onSave({
        user_id: employeeId,
        start_time,
        end_time,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-entry-modal-title"
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
                {/* FIX: Use correct translation key */}
                <h2 id="add-entry-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.addNewTimeEntry}</h2>
                
                <div className="mt-6 space-y-4">
                    <div>
                        {/* FIX: Use correct translation key */}
                        <label htmlFor="employee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.employee}</label>
                        <select
                            id="employee"
                            value={employeeId || ''}
                            // FIX: Handle string value for employee ID
                            onChange={(e) => setEmployeeId(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm"
                        >
                            {/* FIX: Use correct translation key */}
                            <option value="" disabled>{t.selectEmployee}</option>
                            {EMPLOYEES.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.date}</label>
                        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.startTime}</label>
                            <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.endTime}</label>
                            <input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                        </div>
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

export default AddTimeEntryModal;
