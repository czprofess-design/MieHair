
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import type { Profile, TimeEntry, DailyNote } from '../types';
import { 
    PlusIcon, EditIcon, ClockIcon, 
    ChevronDownIcon, SearchIcon, UsersIcon,
    CalendarIcon, ClipboardListIcon,
    DocumentTextIcon, DollarSignIcon, BriefcaseIcon,
    ChevronUpIcon, CheckIcon, ArrowUpDownIcon, RadioIcon
} from './Icons';
import TimeEntryModal from './TimeEntryModal';
import EditEmployeeModal from './EditEmployeeModal';
import { SummaryHeader } from './SummaryHeader';

interface AdminDashboardProps {
    onOpenNoteModal: (date: Date, note: DailyNote | null, ownerId: string, readOnly?: boolean) => void;
    onManageEntries: () => void;
}

type SortKey = 'revenue' | 'hours' | 'shifts' | 'name';
type SortDirection = 'asc' | 'desc';

const calculateHours = (startISO: string, endISO: string | null) => {
    if (!endISO) return 0;
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);
    const durationMs = endDate.getTime() - startDate.getTime();
    return durationMs > 0 ? durationMs / (1000 * 60 * 60) : 0;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenNoteModal, onManageEntries }) => {
    const { t } = useSettings();
    const [employees, setEmployees] = useState<Profile[]>([]);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Profile | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'revenue', direction: 'desc' });

    const [summaryRange, setSummaryRange] = useState<{ start: Date, end: Date }>(() => {
        const now = new Date();
        return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 1) };
    });
    const [calendarDate, setCalendarDate] = useState(new Date());

    const fetchEmployees = useCallback(async () => {
        const { data, error } = await supabase.from('profiles').select('*').order('full_name', { ascending: true });
        if (!error) setEmployees(data || []);
    }, []);

    useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

    const handleSaveEmployeeProfile = async (updatedProfile: Profile) => {
        const { error } = await supabase.from('profiles').update({ full_name: updatedProfile.full_name, avatar_url: updatedProfile.avatar_url, role: updatedProfile.role }).eq('id', updatedProfile.id);
        if (!error) { 
            setIsEditModalOpen(false); fetchEmployees(); 
        }
    };

    const toggleSort = (key: SortKey) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    return (
        <div className="w-full space-y-4">
            <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm space-y-3 animate-fadeIn relative z-30">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-grow relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <SearchIcon size={16} />
                        </div>
                        <input 
                            type="text"
                            placeholder="Tìm nhanh nhân viên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-gray-50 dark:bg-gray-700/50 border border-black/5 dark:border-white/5 rounded-xl text-sm outline-none transition-all focus:ring-1 focus:ring-[var(--accent-color)]/20 font-light"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-0">
                    <SummaryHeader 
                        onRangeUpdate={setSummaryRange} 
                        onCustomMonthChange={setCalendarDate} 
                        customMonthDate={calendarDate} 
                        isSimpleView={true}
                    />
                    <EmployeeFilterDropdown 
                        employees={employees} 
                        selectedEmployeeIds={selectedEmployeeIds}
                        onToggle={(id) => {
                            setSelectedEmployeeIds(prev => 
                                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                            );
                        }}
                        onReset={() => setSelectedEmployeeIds([])}
                        onEdit={(emp) => { setEmployeeToEdit(emp); setIsEditModalOpen(true); }}
                    />
                </div>
            </div>

            <div className="relative z-10">
                <OverallView 
                    employees={employees} 
                    range={summaryRange} 
                    searchTerm={searchTerm} 
                    sortConfig={sortConfig}
                    selectedEmployeeIds={selectedEmployeeIds}
                    toggleSort={toggleSort}
                    key="overall-view" 
                />
            </div>

            {isEditModalOpen && employeeToEdit && (
                <EditEmployeeModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={handleSaveEmployeeProfile} 
                    employee={employeeToEdit}
                    onDelete={async (emp) => {
                         const { error } = await supabase.rpc('delete_user', { user_id: emp.id });
                         if (!error) { setIsEditModalOpen(false); fetchEmployees(); }
                    }}
                />
            )}
        </div>
    );
};

const EmployeeFilterDropdown: React.FC<{ 
    employees: Profile[]; 
    selectedEmployeeIds: string[]; 
    onToggle: (id: string) => void;
    onReset: () => void;
    onEdit: (emp: Profile) => void;
}> = ({ employees, selectedEmployeeIds, onToggle, onReset, onEdit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalSearch, setInternalSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const filtered = useMemo(() => {
        return employees.filter(e => (e.full_name || '').toLowerCase().includes(internalSearch.toLowerCase()));
    }, [employees, internalSearch]);

    const displayText = selectedEmployeeIds.length === 0 
        ? "Nhân viên" 
        : `Nhân viên (${selectedEmployeeIds.length})`;

    return (
        <div className="relative" ref={ref}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-3 px-4 bg-[#1e293b] hover:bg-[#2d3a4f] text-slate-100 text-xs font-medium rounded-xl transition-all border border-slate-700/50 shadow-lg group h-10 min-w-[140px]"
            >
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-[var(--accent-color)]/10 rounded-lg">
                        <UsersIcon size={14} className="text-[var(--accent-color)]" />
                    </div>
                    <span className="truncate">{displayText}</span>
                </div>
                <ChevronDownIcon size={14} className={`text-slate-500 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-[240px] bg-[#1a1f2e] border border-slate-800/50 rounded-xl shadow-2xl z-[200] overflow-hidden animate-fadeIn origin-top">
                    <div className="p-2 border-b border-slate-800/50 bg-[#161b29]">
                        <div className="relative">
                            <SearchIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                autoFocus
                                type="text"
                                placeholder="Tìm theo tên..."
                                value={internalSearch}
                                onChange={(e) => setInternalSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 bg-[#0f172a] border border-slate-800 text-slate-300 text-[10px] rounded-md outline-none focus:ring-1 focus:ring-[var(--accent-color)]/30 transition-all font-light"
                            />
                        </div>
                    </div>
                    
                    <div className="max-h-[200px] overflow-y-auto py-1 custom-scrollbar">
                        <button 
                            onClick={() => onReset()}
                            className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-800/40 transition-colors group"
                        >
                            <div className={`w-3 h-3 rounded border flex-shrink-0 transition-all flex items-center justify-center ${selectedEmployeeIds.length === 0 ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'border-slate-600 bg-[#0f172a]'}`}>
                                {selectedEmployeeIds.length === 0 && <CheckIcon size={8} className="text-white" />}
                            </div>
                            <span className={`text-xs font-normal ${selectedEmployeeIds.length === 0 ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'}`}>Tất cả</span>
                        </button>

                        {filtered.map(emp => {
                            const isSelected = selectedEmployeeIds.includes(emp.id);
                            return (
                                <div key={emp.id} className="group relative">
                                    <button 
                                        onClick={() => onToggle(emp.id)}
                                        className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-3 h-3 rounded border flex-shrink-0 transition-all flex items-center justify-center ${isSelected ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'border-slate-600 bg-[#0f172a]'}`}>
                                                {isSelected && <CheckIcon size={8} className="text-white" />}
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {emp.avatar_url ? (
                                                    <img src={emp.avatar_url} className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700" alt="" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-medium text-slate-300">
                                                        {(emp.full_name || '?').charAt(0)}
                                                    </div>
                                                )}
                                                <span className={`text-xs truncate ${isSelected ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                                    {emp.full_name}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            onClick={(e) => { e.stopPropagation(); onEdit(emp); }} 
                                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-700/50 rounded text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
                                        >
                                            <EditIcon size={10} />
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const OverallView: React.FC<{
    employees: Profile[], 
    range: {start: Date, end: Date},
    searchTerm: string,
    sortConfig: { key: SortKey; direction: SortDirection },
    selectedEmployeeIds: string[],
    toggleSort: (key: SortKey) => void
}> = ({ employees, range, searchTerm, sortConfig, selectedEmployeeIds, toggleSort }) => {
    const { t, language } = useSettings();
    const [allEntries, setAllEntries] = useState<TimeEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from('time_entries').select('*').gte('start_time', range.start.toISOString()).lt('start_time', range.end.toISOString());
        if (!error) setAllEntries(data || []);
        setLoading(false);
    }, [range]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const employeeStats = useMemo(() => {
        const statsMap = new Map<string, { profile: Profile; hours: number; shifts: number; revenue: number; workDays: Set<string>; lastActivity: Date | null; isLive: boolean }>();
        employees.forEach(emp => { statsMap.set(emp.id, { profile: emp, hours: 0, shifts: 0, revenue: 0, workDays: new Set(), lastActivity: null, isLive: false }); });
        
        allEntries.forEach(entry => {
            const stat = statsMap.get(entry.user_id);
            if (stat) {
                stat.hours += calculateHours(entry.start_time, entry.end_time);
                stat.shifts += 1;
                stat.revenue += (entry.revenue || 0);
                stat.workDays.add(new Date(entry.start_time).toISOString().split('T')[0]);
                
                const activityTime = new Date(entry.start_time);
                if (!stat.lastActivity || activityTime > stat.lastActivity) {
                    stat.lastActivity = activityTime;
                }
                if (!entry.end_time) {
                    stat.isLive = true;
                }
            }
        });

        const nowMs = Date.now();
        const MS_PER_DAY = 24 * 60 * 60 * 1000;

        return Array.from(statsMap.values())
            .map(s => ({
                profile: s.profile, 
                hours: s.hours, 
                shifts: s.shifts, 
                days: s.workDays.size, 
                revenue: s.revenue,
                name: s.profile.full_name || '',
                lastActivity: s.lastActivity,
                isLive: s.isLive,
                isActive24h: s.lastActivity ? (nowMs - s.lastActivity.getTime()) < MS_PER_DAY : false
            }))
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(s => selectedEmployeeIds.length === 0 || selectedEmployeeIds.includes(s.profile.id))
            .sort((a, b) => {
                let aVal: any;
                let bVal: any;

                if (sortConfig.key === 'name') { aVal = a.name; bVal = b.name; }
                else { aVal = a[sortConfig.key as keyof typeof a]; bVal = b[sortConfig.key as keyof typeof b]; }
                
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
    }, [employees, allEntries, searchTerm, sortConfig, selectedEmployeeIds]);

    return (
        <div className="space-y-4 animate-fadeIn">
            <MonthlySummary entries={allEntries.filter(e => selectedEmployeeIds.length === 0 || selectedEmployeeIds.includes(e.user_id))} />
            <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-black/5 dark:border-white/5 p-4 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-gray-400 border-b border-black/5 dark:border-white/5 text-[11px] font-medium tracking-wide">
                                <th className="p-3 cursor-pointer group" onClick={() => toggleSort('name')}>
                                    <div className="flex items-center gap-1">
                                        Nhân viên
                                        <ArrowUpDownIcon size={12} className={`transition-colors ${sortConfig.key === 'name' ? 'text-[var(--accent-color)]' : 'text-gray-300'}`} />
                                    </div>
                                </th>
                                <th className="p-3 text-center cursor-pointer group" onClick={() => toggleSort('revenue')}>
                                    <div className="flex items-center justify-center gap-1">
                                        Doanh số
                                        <ArrowUpDownIcon size={12} className={`transition-colors ${sortConfig.key === 'revenue' ? 'text-[var(--accent-color)]' : 'text-gray-300'}`} />
                                    </div>
                                </th>
                                <th className="p-3 text-center cursor-pointer group" onClick={() => toggleSort('hours')}>
                                    <div className="flex items-center justify-center gap-1">
                                        Số giờ
                                        <ArrowUpDownIcon size={12} className={`transition-colors ${sortConfig.key === 'hours' ? 'text-[var(--accent-color)]' : 'text-gray-300'}`} />
                                    </div>
                                </th>
                                <th className="p-3 text-center cursor-pointer group" onClick={() => toggleSort('shifts')}>
                                    <div className="flex items-center justify-center gap-1">
                                        Số ca
                                        <ArrowUpDownIcon size={12} className={`transition-colors ${sortConfig.key === 'shifts' ? 'text-[var(--accent-color)]' : 'text-gray-300'}`} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center"><div className="w-5 h-5 border border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : employeeStats.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400 font-light italic">Không tìm thấy nhân viên phù hợp</td></tr>
                            ) : employeeStats.map(({profile, hours, shifts, revenue, isLive, isActive24h}) => (
                                <tr key={profile.id} className="hover:bg-[var(--accent-color)]/5 transition-all group">
                                    <td className="p-3 font-normal text-gray-800 dark:text-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                {profile.avatar_url ? (
                                                    <img src={profile.avatar_url} className={`w-9 h-9 rounded-full object-cover border-2 ${isActive24h ? 'border-emerald-500/50 shadow-sm' : 'border-black/5 dark:border-white/5'}`} alt="" />
                                                ) : (
                                                    <div className={`w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium border-2 ${isActive24h ? 'border-emerald-500/50' : 'border-transparent'}`}>{(profile.full_name || '?').charAt(0)}</div>
                                                )}
                                                {isLive && (
                                                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white dark:border-slate-800"></span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{profile.full_name}</span>
                                                {isLive && (
                                                    <div className="flex items-center gap-1 text-[9px] font-medium text-rose-500 animate-pulse">
                                                        <RadioIcon size={10} />
                                                        <span>Live</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center font-bold text-emerald-500 tabular-nums text-sm">₫{revenue.toLocaleString()}</td>
                                    <td className="p-3 text-center font-bold text-amber-500 tabular-nums text-sm">{hours.toFixed(1)}h</td>
                                    <td className="p-3 text-center font-bold text-cyan-500 tabular-nums text-sm">{shifts}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MonthlySummary: React.FC<{ entries: TimeEntry[]; }> = ({ entries }) => {
    const { t } = useSettings();
    const stats = useMemo(() => {
        let h = 0, r = 0; const days = new Set();
        entries.forEach(e => { h += calculateHours(e.start_time, e.end_time); r += (e.revenue || 0); days.add(new Date(e.start_time).toISOString().split('T')[0]); });
        return { h, r, d: days.size, s: entries.length };
    }, [entries]);
    
    const statCards = [
        { icon: <ClockIcon size={18} className="text-amber-500/80" />, label: t.totalHoursWorked, value: stats.h.toFixed(1) + 'h', valueColor: 'text-amber-500' },
        { icon: <DollarSignIcon size={18} className="text-emerald-500/80" />, label: t.totalRevenue, value: `${t.currencySymbol}${stats.r.toLocaleString()}`, valueColor: 'text-emerald-500' },
        { icon: <BriefcaseIcon size={18} className="text-green-500/80" />, label: t.totalWorkDays, value: stats.d, valueColor: 'text-green-500' },
        { icon: <ClipboardListIcon size={18} className="text-cyan-500/80"/>, label: t.totalShifts, value: stats.s, valueColor: 'text-cyan-500' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
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

export default AdminDashboard;
