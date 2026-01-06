
import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { CalendarIcon } from './Icons';
import CustomDropdown from './CustomDropdown';

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

    const options = [
        { id: 'today', label: 'Hôm nay' },
        { id: 'thisWeek', label: 'Tuần này' },
        { id: 'last30Days', label: '30 ngày qua' },
        { id: 'thisMonth', label: 'Tháng này' },
        { id: 'byMonth', label: 'Tùy chọn tháng' },
    ];
    
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    return (
        <div className="flex flex-wrap items-center gap-3 z-[100]">
            <CustomDropdown 
                options={options}
                selectedIds={[preset]}
                onToggle={(id) => setPreset(id as Preset)}
                placeholder="Chọn phạm vi"
                className="min-w-[150px]"
                icon={<CalendarIcon size={14} className="text-[var(--accent-color)]" />}
            />
            
            {preset === 'byMonth' && (
                <div className="animate-fadeIn">
                    <select 
                        value={customMonthDate.getMonth()} 
                        onChange={(e) => onCustomMonthChange(new Date(customMonthDate.getFullYear(), parseInt(e.target.value), 1))} 
                        className="h-10 px-4 bg-[#1e293b] border border-slate-700/50 text-slate-100 text-xs font-semibold rounded-xl outline-none focus:ring-1 focus:ring-[var(--accent-color)]/30 transition-all cursor-pointer shadow-lg"
                    >
                        {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                </div>
            )}
        </div>
    );
};
