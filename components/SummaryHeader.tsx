
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { ChevronDownIcon, CalendarIcon, CheckIcon } from './Icons';

type Preset = 'today' | 'thisWeek' | 'last30Days' | 'thisMonth' | 'byMonth';

interface SummaryHeaderProps {
  onRangeUpdate: (range: { start: Date; end: Date }) => void;
  onCustomMonthChange: (date: Date) => void;
  customMonthDate: Date;
  isSimpleView?: boolean;
}

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({ onRangeUpdate, onCustomMonthChange, customMonthDate }) => {
    const [preset, setPreset] = useState<Preset>('thisMonth');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { range, label } = useMemo(() => {
        const now = new Date();
        let start = new Date(), end = new Date(), label = '';
        switch(preset) {
            case 'today': start = new Date(now.getFullYear(), now.getMonth(), now.getDate()); end = new Date(start); end.setDate(end.getDate() + 1); label = 'Hôm nay'; break;
            case 'thisWeek': start = getStartOfWeek(now); start.setHours(0, 0, 0, 0); end = new Date(start); end.setDate(end.getDate() + 7); label = 'Tuần này'; break;
            case 'last30Days': start = new Date(); start.setDate(now.getDate() - 30); end = new Date(now); end.setDate(now.getDate() + 1); label = '30 ngày qua'; break;
            case 'byMonth': start = new Date(customMonthDate.getFullYear(), customMonthDate.getMonth(), 1); end = new Date(customMonthDate.getFullYear(), customMonthDate.getMonth() + 1, 1); label = `Tháng ${customMonthDate.getMonth() + 1}`; break;
            case 'thisMonth': default: start = new Date(now.getFullYear(), now.getMonth(), 1); end = new Date(now.getFullYear(), now.getMonth() + 1, 1); label = 'Tháng này';
        }
        return { range: { start, end }, label };
    }, [preset, customMonthDate]);

    useEffect(() => { onRangeUpdate(range); }, [range, onRangeUpdate]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const options: {key: Preset, label: string}[] = [
        { key: 'today', label: 'Hôm nay' }, { key: 'thisWeek', label: 'Tuần này' }, { key: 'last30Days', label: '30 ngày qua' }, { key: 'thisMonth', label: 'Tháng này' }, { key: 'byMonth', label: 'Tùy chọn tháng' },
    ];
    
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    return (
        <div className="relative flex items-center gap-2 z-[100]" ref={dropdownRef}>
            <div className="relative min-w-[140px]">
                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between gap-3 px-4 bg-[#1e293b] hover:bg-[#2d3a4f] text-slate-100 text-xs font-semibold rounded-xl transition-all border border-slate-700/50 shadow-lg group h-10">
                    <div className="flex items-center gap-2">
                        <CalendarIcon size={14} className="text-[var(--accent-color)]" />
                        <span className="tracking-wide">{label}</span>
                    </div>
                    <ChevronDownIcon size={14} className={`text-slate-500 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180 text-[var(--accent-color)]' : ''}`} />
                </button>
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[200] animate-fadeIn origin-top min-w-[180px]">
                        <div className="py-1">
                            {options.map(p => (
                                <button key={p.key} type="button" onClick={(e) => { e.stopPropagation(); setPreset(p.key); if (p.key !== 'byMonth') setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                    <span className={`text-xs font-medium ${preset === p.key ? 'text-[var(--accent-color)] font-semibold' : 'text-slate-400 group-hover:text-slate-200'}`}>{p.label}</span>
                                    {preset === p.key && <CheckIcon size={10} className="text-[var(--accent-color)]" />}
                                </button>
                            ))}
                            {preset === 'byMonth' && (
                                <div className="px-4 py-3 border-t border-white/5 bg-black/20 mt-1">
                                    <select value={customMonthDate.getMonth()} onChange={(e) => { onCustomMonthChange(new Date(customMonthDate.getFullYear(), parseInt(e.target.value), 1)); setIsDropdownOpen(false); }} className="w-full bg-[#1e293b] border border-white/10 text-slate-200 text-xs font-semibold rounded-lg px-2 py-1.5">
                                        {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
