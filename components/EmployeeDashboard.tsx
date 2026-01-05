
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import type { TimeEntry, DailyNote, Profile } from '../types';
import type { Session } from '@supabase/supabase-js';
import { ClockIcon, BriefcaseIcon, ClipboardListIcon, PlusIcon, DocumentTextIcon, PaperclipIcon, DollarSignIcon, HistoryIcon } from './Icons';
import { SummaryHeader } from './SummaryHeader';
import MonthlyChart from './MonthlyChart';

interface EmployeeDashboardProps {
    session: Session | null;
    profile: Profile | null;
    dataVersion: number;
    onOpenNoteModal: (date: Date, note: DailyNote | null, ownerId: string) => void;
    onManageEntries: () => void;
}

const calculateHours = (startISO: string, endISO: string | null) => {
    if (!endISO) return 0;
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);
    const durationMs = endDate.getTime() - startDate.getTime();
    if (durationMs < 0) return 0;
    return durationMs / (1000 * 60 * 60);
};

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ session, profile, dataVersion, onOpenNoteModal, onManageEntries }) => {
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [summaryRange, setSummaryRange] = useState<{ start: Date, end: Date }>({ 
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), 
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) 
    });

    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([]);
    const [loading, setLoading] = useState(true);
    
    const timeZone = 'Asia/Ho_Chi_Minh';
    const ymdFormatter = useMemo(() => new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone }), [timeZone]);

    const fetchData = useCallback(async (user_id: string, start: Date, end: Date) => {
        setLoading(true);
        const startISO = start.toISOString();
        const endISO = end.toISOString();
        const startYMD = ymdFormatter.format(start);
        const endYMD = ymdFormatter.format(end);

        const [entriesResult, notesResult] = await Promise.all([
            supabase.from('time_entries').select('*').eq('user_id', user_id).gte('start_time', startISO).lt('start_time', endISO).order('start_time', { ascending: true }),
            supabase.from('daily_notes').select('*').eq('user_id', user_id).gte('date', startYMD).lte('date', endYMD)
        ]);

        if (!entriesResult.error) setTimeEntries(entriesResult.data);
        if (!notesResult.error) setDailyNotes(notesResult.data || []);
        setLoading(false);
    }, [ymdFormatter]);
    
     useEffect(() => {
        if (session) fetchData(session.user.id, summaryRange.start, summaryRange.end);
        else { setTimeEntries([]); setDailyNotes([]); setLoading(false); }
    }, [session, summaryRange, fetchData, dataVersion]);

    const onRangeUpdate = useCallback(({start, end}: {start: Date, end: Date}) => {
        setSummaryRange({start, end});
    }, []);
    
    const onCustomMonthChange = useCallback((newDate: Date) => {
        setCalendarDate(newDate);
    }, []);

    return (
        <div className="w-full animate-fadeInUp">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white/40 dark:bg-gray-800/20 p-3 rounded-2xl border border-black/5 dark:border-white/5 backdrop-blur-sm">
                <div className="w-full md:w-auto">
                    <SummaryHeader 
                        onRangeUpdate={onRangeUpdate} 
                        onCustomMonthChange={onCustomMonthChange} 
                        customMonthDate={calendarDate} 
                    />
                </div>
                <button
                    onClick={onManageEntries}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 w-full md:w-auto text-sm font-medium text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-xl shadow-lg hover:shadow-[var(--accent-color)]/20 hover:scale-[1.01] active:scale-95 transition-all"
                >
                    <HistoryIcon size={16} />
                    <span>Xem lịch sử ca</span>
                </button>
            </div>

            <MonthlySummary entries={timeEntries} />
            
            <div className="mt-4 mb-6">
                <MonthlyChart entries={timeEntries} range={summaryRange} />
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-black/5 dark:border-white/5">
                <CalendarGrid 
                    currentDate={calendarDate} 
                    entries={timeEntries} 
                    notes={dailyNotes} 
                    loading={loading}
                    onOpenNoteModal={(date, note) => onOpenNoteModal(date, note, session!.user.id)}
                    ymdFormatter={ymdFormatter} 
                />
            </div>
        </div>
    );
};

const CalendarGrid: React.FC<{ currentDate: Date; entries: TimeEntry[]; notes: DailyNote[]; loading: boolean; onOpenNoteModal: (date: Date, note: DailyNote | null) => void; ymdFormatter: Intl.DateTimeFormat; }> = ({ currentDate, entries, notes, loading, onOpenNoteModal, ymdFormatter }) => {
    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = new Date(Date.UTC(year, month, 1));
        const days = [];
        const firstDayUTC = date.getUTCDay();
        for (let i = 0; i < firstDayUTC; i++) days.push(null);
        while (date.getUTCMonth() === month) {
            days.push(new Date(date));
            date.setUTCDate(date.getUTCDate() + 1);
        }
        return days;
    }, [currentDate]);

    if (loading) return <div className="text-center p-20 text-gray-500 animate-pulse font-light italic">Đang tải lịch...</div>;

    const todayYMD = ymdFormatter.format(new Date());
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    return (
        <div>
            <div className="grid grid-cols-7 text-center text-[10px] font-medium text-gray-400 mb-3 tracking-wide">
                {dayNames.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {daysInMonth.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="min-h-[5rem]"></div>;
                    const dayYMD = ymdFormatter.format(day);
                    const dailyEntries = entries.filter(e => ymdFormatter.format(new Date(e.start_time)) === dayYMD);
                    const totalHours = dailyEntries.reduce((sum, entry) => sum + calculateHours(entry.start_time, entry.end_time), 0);
                    const revenue = dailyEntries.reduce((sum, entry) => sum + (entry.revenue || 0), 0);
                    const dayNote = notes.find(n => n.date === dayYMD);
                    const isToday = dayYMD === todayYMD;

                    return (
                        <div key={dayYMD} className={`group relative min-h-[5rem] rounded-xl text-left flex flex-col transition-all duration-300 border ${isToday ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5' : 'border-black/5 dark:border-white/5 hover:border-gray-200 dark:hover:border-gray-600'} hover:shadow-sm`}>
                            <div className="p-1.5 flex justify-between items-start">
                                <span className={`font-medium text-xs ${isToday ? 'text-white bg-[var(--accent-color)] rounded-full w-5 h-5 flex items-center justify-center' : 'text-gray-400'}`}>{day.getUTCDate()}</span>
                                <button onClick={() => onOpenNoteModal(day, dayNote || null)} className="p-0.5 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {dayNote ? <div className="relative"><DocumentTextIcon size={14} className="text-[var(--accent-color)]" /></div> : <PlusIcon size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                </button>
                            </div>
                            <div className="flex-grow"></div>
                            <div className="p-1 text-center">
                                {dailyEntries.length > 0 && (
                                    <div className="space-y-0.5">
                                        <div className="text-[9px] font-bold text-amber-500">{totalHours.toFixed(1)}h</div>
                                        <div className="text-[9px] font-medium text-emerald-500 truncate px-0.5">₫{revenue.toLocaleString()}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MonthlySummary: React.FC<{ entries: TimeEntry[]; }> = ({ entries }) => {
    const stats = useMemo(() => {
        let totalH = 0, totalR = 0, days = new Set();
        entries.forEach(e => {
            totalH += calculateHours(e.start_time, e.end_time);
            totalR += (e.revenue || 0);
            days.add(new Date(e.start_time).toISOString().split('T')[0]);
        });
        return { totalH, totalR, totalDays: days.size, totalShifts: entries.length };
    }, [entries]);

    const statCards = [
        { icon: <ClockIcon size={18} className="text-amber-500/80" />, label: "Giờ làm việc", value: stats.totalH.toFixed(1) + 'h', valueColor: 'text-amber-500' },
        { icon: <DollarSignIcon size={18} className="text-emerald-500/80" />, label: "Doanh số", value: `₫${stats.totalR.toLocaleString()}`, valueColor: 'text-emerald-500' },
        { icon: <BriefcaseIcon size={18} className="text-green-500/80" />, label: "Ngày làm", value: stats.totalDays, valueColor: 'text-green-500' },
        { icon: <ClipboardListIcon size={18} className="text-cyan-500/80"/>, label: "Số ca làm", value: stats.totalShifts, valueColor: 'text-cyan-500' },
    ];
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
            {statCards.map((card, index) => (
                <div key={index} className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-sm p-4 flex items-center gap-3 border border-black/5 dark:border-white/5 transition-transform hover:scale-[1.01]">
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex-shrink-0">{card.icon}</div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-medium text-gray-400 truncate">{card.label}</p>
                        <p className={`text-lg font-bold truncate ${card.valueColor}`}>{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmployeeDashboard;
