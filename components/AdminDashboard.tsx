
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import type { Profile, TimeEntry, DailyNote } from '../types';
import { 
    EditIcon, ClockIcon, SearchIcon, UsersIcon,
    CalendarIcon, ClipboardListIcon,
    DollarSignIcon, BriefcaseIcon,
    CheckIcon, ArrowUpDownIcon, RadioIcon
} from './Icons';
import EditEmployeeModal from './EditEmployeeModal';
import { SummaryHeader } from './SummaryHeader';
import CustomDropdown from './CustomDropdown';

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

    const toggleSort = (key: SortKey) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const employeeOptions = useMemo(() => employees.map(e => ({
        id: e.id,
        label: e.full_name,
        icon: e.avatar_url ? <img src={e.avatar_url} className="w-4 h-4 rounded-full object-cover" /> : null
    })), [employees]);

    return (
        <div className="w-full space-y-4">
            <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm space-y-3 animate-fadeIn relative z-40">
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
                            className="w-full h-10 pl-10 pr-4 bg-gray-50 dark:bg-gray-700/50 border border-black/5 dark:border-white/5 rounded-xl text-sm outline-none transition-all focus:ring-1 focus:ring-[var(--accent-color)]/20"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <SummaryHeader 
                        onRangeUpdate={setSummaryRange} 
                        onCustomMonthChange={setCalendarDate} 
                        customMonthDate={calendarDate} 
                        isSimpleView={true}
                    />
                    <CustomDropdown 
                        options={employeeOptions}
                        selectedIds={selectedEmployeeIds}
                        onToggle={(id) => setSelectedEmployeeIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
                        placeholder="Nhân Viên"
                        isMulti={true}
                        onSelectAll={() => setSelectedEmployeeIds(selectedEmployeeIds.length === employees.length ? [] : employees.map(e => e.id))}
                        className="md:min-w-[180px]"
                        icon={<UsersIcon size={14} className="text-[var(--accent-color)]" />}
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
                />
            </div>

            {isEditModalOpen && employeeToEdit && (
                <EditEmployeeModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={async (updated) => {
                        await supabase.from('profiles').update({ full_name: updated.full_name, avatar_url: updated.avatar_url, role: updated.role }).eq('id', updated.id);
                        setIsEditModalOpen(false); fetchEmployees();
                    }} 
                    employee={employeeToEdit}
                    onDelete={async (emp) => {
                         await supabase.rpc('delete_user', { user_id: emp.id });
                         setIsEditModalOpen(false); fetchEmployees();
                    }}
                />
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
    const { t } = useSettings();
    const [allEntries, setAllEntries] = useState<TimeEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const { data } = await supabase.from('time_entries').select('*').gte('start_time', range.start.toISOString()).lt('start_time', range.end.toISOString());
            setAllEntries(data || []);
            setLoading(false);
        };
        fetch();
    }, [range]);

    const employeeStats = useMemo(() => {
        const statsMap = new Map<string, { profile: Profile; hours: number; shifts: number; revenue: number; isLive: boolean }>();
        employees.forEach(emp => { statsMap.set(emp.id, { profile: emp, hours: 0, shifts: 0, revenue: 0, isLive: false }); });
        
        allEntries.forEach(entry => {
            const stat = statsMap.get(entry.user_id);
            if (stat) {
                stat.hours += calculateHours(entry.start_time, entry.end_time);
                stat.shifts += 1;
                stat.revenue += (entry.revenue || 0);
                if (!entry.end_time) stat.isLive = true;
            }
        });

        return Array.from(statsMap.values())
            .map(s => ({
                profile: s.profile, 
                hours: s.hours, 
                shifts: s.shifts, 
                revenue: s.revenue,
                name: s.profile.full_name || '',
                isLive: s.isLive
            }))
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(s => selectedEmployeeIds.length === 0 || selectedEmployeeIds.includes(s.profile.id))
            .sort((a, b) => {
                let aVal = sortConfig.key === 'name' ? a.name : a[sortConfig.key as keyof typeof a];
                let bVal = sortConfig.key === 'name' ? b.name : b[sortConfig.key as keyof typeof b];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
    }, [employees, allEntries, searchTerm, sortConfig, selectedEmployeeIds]);

    return (
        <div className="space-y-4 animate-fadeIn">
            {/* Sắp xếp lại thứ tự: Nhân Viên, Giờ Làm, Doanh Số, Tổng Ca */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <StatCard icon={<BriefcaseIcon size={18} className="text-green-500" />} label="Nhân viên" value={employeeStats.length} color="text-green-500" />
                <StatCard icon={<ClockIcon size={18} className="text-amber-500" />} label="Giờ làm" value={employeeStats.reduce((s, e) => s + e.hours, 0).toFixed(1) + 'h'} color="text-amber-500" />
                <StatCard icon={<DollarSignIcon size={18} className="text-emerald-500" />} label="Doanh số" value={`${employeeStats.reduce((s, e) => s + e.revenue, 0).toLocaleString('vi-VN')} đ`} color="text-emerald-500" />
                <StatCard icon={<ClipboardListIcon size={18} className="text-cyan-500" />} label="Tổng ca" value={employeeStats.reduce((s, e) => s + e.shifts, 0)} color="text-cyan-500" />
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-black/5 dark:border-white/5 p-4 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-gray-400 border-b border-black/5 dark:border-white/5 text-xs font-semibold capitalize">
                                <th className="p-3 cursor-pointer" onClick={() => toggleSort('name')}><div className="flex items-center gap-1">Nhân viên <ArrowUpDownIcon size={12} className={sortConfig.key === 'name' ? 'text-[var(--accent-color)]' : 'text-gray-300'} /></div></th>
                                <th className="p-3 text-center cursor-pointer" onClick={() => toggleSort('hours')}><div className="flex items-center justify-center gap-1">Số giờ <ArrowUpDownIcon size={12} className={sortConfig.key === 'hours' ? 'text-[var(--accent-color)]' : 'text-gray-300'} /></div></th>
                                <th className="p-3 text-center cursor-pointer" onClick={() => toggleSort('revenue')}><div className="flex items-center justify-center gap-1">Doanh số <ArrowUpDownIcon size={12} className={sortConfig.key === 'revenue' ? 'text-[var(--accent-color)]' : 'text-gray-300'} /></div></th>
                                <th className="p-3 text-center cursor-pointer" onClick={() => toggleSort('shifts')}><div className="flex items-center justify-center gap-1">Số ca <ArrowUpDownIcon size={12} className={sortConfig.key === 'shifts' ? 'text-[var(--accent-color)]' : 'text-gray-300'} /></div></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan={4} className="p-10 text-center"><div className="w-6 h-6 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                            ) : employeeStats.map(({profile, hours, shifts, revenue, isLive}) => (
                                <tr key={profile.id} className="hover:bg-[var(--accent-color)]/5 transition-all">
                                    <td className="p-3 font-normal text-gray-800 dark:text-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                {profile.avatar_url ? <img src={profile.avatar_url} className="w-9 h-9 rounded-full object-cover border border-black/5" /> : <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">{(profile.full_name || '?').charAt(0)}</div>}
                                                {isLive && <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-white dark:border-slate-800" /></span>}
                                            </div>
                                            <div className="flex flex-col"><span className="text-sm font-bold">{profile.full_name}</span>{isLive && <div className="flex items-center gap-1 text-[9px] text-rose-500 font-bold uppercase"><RadioIcon size={10} /> Live</div>}</div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-center font-bold text-amber-500">{hours.toFixed(1)}h</td>
                                    <td className="p-3 text-center font-bold text-emerald-500">{revenue.toLocaleString('vi-VN')} đ</td>
                                    <td className="p-3 text-center font-bold text-cyan-500">{shifts}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-sm p-4 flex items-center gap-3 border border-black/5 dark:border-white/5 transition-transform hover:scale-[1.01]">
        <div className="p-2.5 bg-gray-50 dark:bg-gray-700/30 rounded-lg">{icon}</div>
        <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-400 truncate capitalize">{label}</p>
            <p className={`text-lg font-bold truncate ${color}`}>{value}</p>
        </div>
    </div>
);

export default AdminDashboard;
