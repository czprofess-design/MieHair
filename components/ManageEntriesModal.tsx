
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { TimeEntry, Profile } from '../types';
import { useSettings } from '../context/SettingsContext';
import { XIcon, PlusIcon, EditIcon, SpinnerIcon, EyeIcon } from './Icons';

interface ManageEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  profile: Profile | null;
  onAddEntry: () => void;
  onEditEntry: (entry: TimeEntry) => void;
}

const formatDuration = (startISO: string, endISO: string | null) => {
    if (!endISO) return 'Đang diễn ra...';
    const durationMs = new Date(endISO).getTime() - new Date(startISO).getTime();
    if (durationMs < 0) return 'Không hợp lệ';
    const totalMinutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
};

const EntryList: React.FC<{ entries: TimeEntry[], onEditEntry: (entry: TimeEntry) => void, isReadOnly: boolean }> = ({ entries, onEditEntry, isReadOnly }) => {
    const { language, t } = useSettings();
    const dateTimeFormatter = useMemo(() => new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }), [language]);
    
    return (
        <ul className="space-y-3 mt-3">
            {entries.map(entry => (
                <li key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-black/5 dark:border-white/5 animate-fadeIn group">
                    <div className="min-w-0">
                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{dateTimeFormatter.format(new Date(entry.start_time))}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-sky-500"></span>
                                {formatDuration(entry.start_time, entry.end_time)}
                            </p>
                            <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                {t.currencySymbol}{entry.revenue?.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onEditEntry(entry)} 
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium tracking-wide rounded-lg transition-all ${
                            isReadOnly 
                            ? 'text-sky-600 bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-400' 
                            : 'text-gray-600 bg-white border border-gray-200 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] dark:bg-gray-800 dark:border-gray-600'
                        }`}
                    >
                       {isReadOnly ? <><EyeIcon size={12} /> Chi tiết</> : <><EditIcon size={12} /> Sửa</>}
                    </button>
                </li>
            ))}
        </ul>
    );
};

const ManageEntriesModal: React.FC<ManageEntriesModalProps> = ({ isOpen, onClose, session, profile, onAddEntry, onEditEntry }) => {
    const { t } = useSettings();
    const [recentLoading, setRecentLoading] = useState(true);
    const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([]);
    
    const [selectedDate, setSelectedDate] = useState('');
    const [dateEntries, setDateEntries] = useState<TimeEntry[]>([]);
    const [dateLoading, setDateLoading] = useState(false);

    const isReadOnly = profile?.role === 'employee';

    const fetchRecentEntries = useCallback(async () => {
        if (!session) return;
        setRecentLoading(true);
        const { data, error } = await supabase
            .from('time_entries')
            .select('*')
            .eq('user_id', session.user.id)
            .order('start_time', { ascending: false })
            .limit(10);
        
        if (error) console.error("Error fetching recent entries:", error);
        else setRecentEntries(data || []);
        setRecentLoading(false);
    }, [session]);

    const fetchEntriesForDate = useCallback(async (date: string) => {
        if (!session || !date) return;
        setDateLoading(true);
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const { data, error } = await supabase
            .from('time_entries')
            .select('*')
            .eq('user_id', session.user.id)
            .gte('start_time', startDate.toISOString())
            .lt('start_time', endDate.toISOString())
            .order('start_time', { ascending: true });
        
        if (error) console.error(`Error fetching entries for ${date}:`, error);
        else setDateEntries(data || []);
        setDateLoading(false);
    }, [session]);

    useEffect(() => {
        if (isOpen) {
            fetchRecentEntries();
            setSelectedDate(new Date().toISOString().split('T')[0]);
            setDateEntries([]);
        }
    }, [isOpen, fetchRecentEntries]);

    useEffect(() => {
        if (selectedDate) fetchEntriesForDate(selectedDate);
        else setDateEntries([]);
    }, [selectedDate, fetchEntriesForDate]);
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-entries-modal-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-out animate-fadeInUp max-h-[85vh] flex flex-col border border-black/5 dark:border-white/10"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-100 dark:border-gray-700/50 flex-shrink-0 bg-gray-50/50 dark:bg-gray-900/20 rounded-t-3xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 id="manage-entries-modal-title" className="text-xl font-medium text-gray-800 dark:text-gray-100">
                                {isReadOnly ? 'Lịch sử hoạt động' : 'Quản lý ca làm'}
                            </h2>
                            <p className="text-xs font-light text-gray-500 dark:text-gray-400 mt-1">
                                {isReadOnly ? 'Xem lại lịch sử chấm công của bạn.' : 'Quản lý và cập nhật ca làm của nhân viên.'}
                            </p>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 -mt-2 -mr-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label={t.close}>
                            <XIcon size={20} />
                        </button>
                    </div>
                    {!isReadOnly && (
                        <button onClick={onAddEntry} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all">
                            <PlusIcon size={14} /> Thêm ca mới
                        </button>
                    )}
                </div>

                <div className="overflow-y-auto p-6 custom-scrollbar font-light">
                    <div>
                        <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">Tra cứu theo ngày</h3>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={selectedDate} 
                                onChange={(e) => setSelectedDate(e.target.value)} 
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-black/5 dark:border-white/5 rounded-xl text-sm font-normal outline-none focus:ring-1 focus:ring-[var(--accent-color)]/20 transition-all" 
                            />
                        </div>
                         {dateLoading ? (
                             <div className="flex justify-center p-8"><SpinnerIcon size={20} className="animate-spin text-[var(--accent-color)]"/></div>
                         ) : dateEntries.length > 0 ? (
                             <EntryList entries={dateEntries} onEditEntry={onEditEntry} isReadOnly={isReadOnly} />
                         ) : selectedDate && !dateLoading ? (
                             <div className="text-center py-10">
                                 <p className="text-sm font-light text-gray-400 italic">Không có dữ liệu cho ngày này.</p>
                             </div>
                         ) : null}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700/50 my-6"></div>

                    <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-4">Hoạt động gần đây</h3>
                    {recentLoading ? (
                        <div className="flex justify-center p-8"><SpinnerIcon size={20} className="animate-spin text-[var(--accent-color)]"/></div>
                    ) : recentEntries.length > 0 ? (
                        <EntryList entries={recentEntries} onEditEntry={onEditEntry} isReadOnly={isReadOnly} />
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-sm font-light text-gray-400 italic">Chưa có hoạt động nào.</p>
                        </div>
                    )}
                </div>
                
                 <div className="bg-gray-50/50 dark:bg-gray-900/20 px-6 py-4 flex justify-end items-center rounded-b-3xl border-t border-gray-100 dark:border-gray-700/50">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 rounded-xl border border-black/5 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageEntriesModal;
