
import React, { useState, useEffect } from 'react';
import { XIcon, DollarSignIcon, ClockIcon, CalendarIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';
import { TimeEntry } from '../types';

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Partial<TimeEntry>) => void;
  entry: TimeEntry | Partial<TimeEntry> | null;
}

const TimeEntryModal: React.FC<TimeEntryModalProps> = ({ isOpen, onClose, onSave, entry }) => {
  const { t } = useSettings();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [revenue, setRevenue] = useState<number>(0);

  const toYYYYMMDD = (isoString: string | null | undefined) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  const toHHMM = (isoString: string | null | undefined) => {
      if (!isoString) return '';
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (isOpen) {
        if(entry && entry.start_time) {
            setDate(toYYYYMMDD(entry.start_time));
            setStartTime(toHHMM(entry.start_time));
            setEndTime(toHHMM(entry.end_time || new Date().toISOString()));
            setRevenue((entry as TimeEntry).revenue || 0);
        } else {
            const today = new Date();
            setDate(toYYYYMMDD(today.toISOString()));
            setStartTime('09:00');
            setEndTime('17:00');
            setRevenue(0);
        }
    }
  }, [entry, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && startTime) {
      const startDateTime = new Date(`${date}T${startTime}`);
      const start_time_iso = startDateTime.toISOString();
      let end_time_iso = null;
      if (endTime) {
          const endDateTime = new Date(`${date}T${endTime}`);
          end_time_iso = endDateTime.toISOString();
      }
      onSave({ 
          ...entry, 
          start_time: start_time_iso, 
          end_time: end_time_iso, 
          revenue: Number(revenue) 
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                <ClockIcon className="text-[var(--accent-color)]" />
                {entry && (entry as TimeEntry).id ? t.editEntry : t.addNewTimeEntry}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <XIcon size={20} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-sm font-bold uppercase text-slate-500 mb-2 block flex items-center gap-2">
                            <CalendarIcon size={16}/> {t.date}
                        </label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[var(--accent-color)] outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold uppercase text-slate-500 mb-2 block">{t.startTime}</label>
                        <input 
                            type="time" 
                            value={startTime} 
                            onChange={e => setStartTime(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[var(--accent-color)] outline-none transition-all text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold uppercase text-slate-500 mb-2 block">{t.endTime}</label>
                        <input 
                            type="time" 
                            value={endTime} 
                            onChange={e => setEndTime(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[var(--accent-color)] outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800/50 rounded-2xl animate-fadeInUp">
                    <label className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2 block flex items-center gap-2">
                        <DollarSignIcon size={20} /> {t.revenue}
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-emerald-600/50">{t.currencySymbol}</span>
                        <input 
                            type="number" 
                            value={revenue} 
                            onChange={e => setRevenue(Number(e.target.value))}
                            placeholder="0"
                            autoFocus
                            className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-xl text-2xl font-bold text-emerald-600 dark:text-emerald-400 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                        />
                    </div>
                    <p className="text-xs text-emerald-600/70 mt-2 italic font-medium">
                        * Nhập tổng doanh số cho ca làm việc này.
                    </p>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm">
                    {t.cancel}
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/50 transform hover:-translate-y-0.5 transition-all text-sm">
                    {t.save}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default TimeEntryModal;
