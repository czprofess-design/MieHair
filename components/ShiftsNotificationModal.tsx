
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../context/SettingsContext';
import type { Profile, TimeEntry } from '../types';
import { XIcon, SearchIcon, StopIcon, EditIcon, TrashIcon, CheckIcon } from './Icons';
import TimeEntryModal from './TimeEntryModal';

interface ShiftsNotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    employees: Profile[];
}

const formatPreciseDuration = (startISO: string, endISO: string) => {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return '00:00:00';
    const h = String(Math.floor(diffMs / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const ActiveTimer: React.FC<{ startISO: string }> = ({ startISO }) => {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        const update = () => {
            const start = new Date(startISO);
            const now = new Date();
            const diffMs = now.getTime() - start.getTime();
            if (diffMs < 0) {
                setElapsed('00:00:00');
                return;
            }
            const h = String(Math.floor(diffMs / 3600000)).padStart(2, '0');
            const m = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, '0');
            setElapsed(`${h}:${m}:${s}`);
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [startISO]);

    return <span className="text-amber-500 font-mono text-[10px] font-medium tracking-wider">{elapsed}</span>;
};

const ShiftsNotificationModal: React.FC<ShiftsNotificationModalProps> = ({ isOpen, onClose, employees }) => {
    const { t } = useSettings();
    const [shifts, setShifts] = useState<TimeEntry[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [timeRange, setTimeRange] = useState('7d');

    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

    const fetchShifts = useCallback(async () => {
        setLoading(true);
        const now = new Date();
        let startDate = new Date();
        
        if (timeRange === '24h') startDate.setDate(now.getDate() - 1);
        else if (timeRange === '7d') startDate.setDate(now.getDate() - 7);
        else if (timeRange === '30d') startDate.setDate(now.getDate() - 30);

        const { data, error } = await supabase
            .from('time_entries')
            .select('*')
            .gte('start_time', startDate.toISOString())
            .order('start_time', { ascending: false });

        if (!error) setShifts(data || []);
        setLoading(false);
    }, [timeRange]);

    useEffect(() => {
        if (isOpen) fetchShifts();
    }, [isOpen, fetchShifts]);

    // --- ACTIONS ---

    const handleForceEndShift = async (e: React.MouseEvent, shiftId: number) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!window.confirm("Xác nhận kết thúc ca làm này cho nhân viên?")) return;
        
        const { error } = await supabase
            .from('time_entries')
            .update({ end_time: new Date().toISOString() })
            .eq('id', shiftId);
        
        if (error) alert("Lỗi: " + error.message);
        else fetchShifts();
    };

    const handleDeleteShift = async (shiftId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn ca làm việc này không? Hành động này không thể hoàn tác.")) return;

        const { error } = await supabase
            .from('time_entries')
            .delete()
            .eq('id', shiftId);

        if (error) alert("Lỗi khi xóa: " + error.message);
        else fetchShifts();
    };

    const handleEditClick = (shift: TimeEntry) => {
        setEditingEntry(shift);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (updatedEntry: Partial<TimeEntry>) => {
        if (!editingEntry) return;
        
        const { error } = await supabase
            .from('time_entries')
            .update({
                start_time: updatedEntry.start_time,
                end_time: updatedEntry.end_time,
                revenue: updatedEntry.revenue
            })
            .eq('id', editingEntry.id);

        if (error) {
            console.error("Error updating entry:", error);
            alert("Không thể cập nhật ca làm việc.");
        } else {
            setIsEditModalOpen(false);
            setEditingEntry(null);
            fetchShifts();
        }
    };

    const handleBatchStop = async () => {
        const activeShifts = shifts.filter(s => !s.end_time);
        if (activeShifts.length === 0) return;

        if (!window.confirm(`Bạn có chắc muốn kết thúc ${activeShifts.length} ca đang hoạt động ngay lập tức?`)) return;

        const ids = activeShifts.map(s => s.id);
        const now = new Date().toISOString();

        const { error } = await supabase
            .from('time_entries')
            .update({ end_time: now })
            .in('id', ids);

        if (error) alert("Lỗi khi dừng hàng loạt: " + error.message);
        else fetchShifts();
    };

    // --- FILTERING ---

    const filteredShifts = useMemo(() => {
        return shifts.filter(shift => {
            const employee = employees.find(e => e.id === shift.user_id);
            const matchesSearch = (employee?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesUser = selectedUser === 'all' || shift.user_id === selectedUser;
            const matchesStatus = selectedStatus === 'all' || 
                (selectedStatus === 'active' && !shift.end_time) || 
                (selectedStatus === 'finished' && shift.end_time);
            
            return matchesSearch && matchesUser && matchesStatus;
        });
    }, [shifts, searchQuery, selectedUser, selectedStatus, employees]);

    const activeShiftCount = shifts.filter(s => !s.end_time).length;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div 
                className="bg-[#1a1f2e] w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-800/50 overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 flex justify-between items-center bg-[#1a1f2e] border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-medium text-slate-100 tracking-wide">
                            Nhật ký hoạt động hệ thống
                        </h2>
                        {activeShiftCount > 0 && (
                            <button 
                                onClick={handleBatchStop}
                                className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wide rounded-full transition-all animate-pulse"
                            >
                                <StopIcon size={10} />
                                Dừng tất cả ({activeShiftCount})
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-700/30 rounded-md text-slate-500 transition-colors">
                        <XIcon size={20} />
                    </button>
                </div>

                <div className="p-4 bg-[#1a1f2e] grid grid-cols-1 md:grid-cols-4 gap-3 border-b border-slate-800/50">
                    <div className="relative md:col-span-1">
                        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            type="text"
                            placeholder="Tìm nhân viên..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-[#252d3d] border border-slate-700/50 rounded-xl text-sm text-slate-200 outline-none focus:ring-1 focus:ring-[var(--accent-color)]/30"
                        />
                    </div>

                    <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="bg-[#252d3d] border border-slate-700/50 text-sm text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer font-light">
                        <option value="all">Tất cả nhân viên</option>
                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
                    </select>

                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-[#252d3d] border border-slate-700/50 text-sm text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer font-light">
                        <option value="all">Trạng thái</option>
                        <option value="active">Đang làm việc</option>
                        <option value="finished">Đã hoàn thành</option>
                    </select>

                    <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-[#252d3d] border border-slate-700/50 text-sm text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer font-light">
                        <option value="24h">24 giờ qua</option>
                        <option value="7d">7 ngày qua</option>
                        <option value="30d">30 ngày qua</option>
                    </select>
                </div>

                <div className="px-4 py-4 overflow-y-auto custom-scrollbar space-y-3 bg-[#0f172a]/20 flex-grow">
                    {loading ? (
                        <div className="py-20 text-center text-slate-500 animate-pulse font-light italic">Đang đồng bộ...</div>
                    ) : filteredShifts.length === 0 ? (
                        <div className="py-20 text-center text-slate-500 font-light italic">Không tìm thấy dữ liệu.</div>
                    ) : (
                        filteredShifts.map(shift => {
                            const employee = employees.find(e => e.id === shift.user_id);
                            const startDate = new Date(shift.start_time);
                            const isActive = !shift.end_time;
                            
                            const day = String(startDate.getDate()).padStart(2, '0');
                            const month = String(startDate.getMonth() + 1).padStart(2, '0');
                            const eventDate = `${day}/${month}`;
                            
                            const startTime = startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
                            const endTime = shift.end_time ? new Date(shift.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }) : null;

                            return (
                                <div key={shift.id} className="flex items-center justify-between p-3.5 bg-[#252d3d]/50 rounded-2xl border border-slate-700/20 hover:border-slate-600/40 transition-all group relative">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex flex-col items-center justify-center bg-[#1a1f2e] rounded-xl px-2 py-2 border border-slate-700/40 min-w-[65px] shadow-sm">
                                            <span className="text-[9px] font-medium text-slate-500 mb-0.5 uppercase tracking-tighter">{eventDate}</span>
                                            <span className="text-base font-bold text-[var(--accent-color)] leading-none">{startTime}</span>
                                        </div>
                                        
                                        <div className="relative">
                                            {employee?.avatar_url ? (
                                                <img src={employee.avatar_url} className="w-10 h-10 rounded-full object-cover border border-slate-700/30" alt="" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-300">
                                                    {(employee?.full_name || '?').charAt(0)}
                                                </div>
                                            )}
                                            {isActive && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#1a1f2e] rounded-full shadow-lg animate-pulse"></span>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-0.5 min-w-0">
                                            <p className="font-medium text-slate-100 text-sm truncate">{employee?.full_name || 'Nhân viên'}</p>
                                            <div className="flex items-center gap-2 text-[10px] font-light">
                                                {isActive ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-emerald-400 font-medium">Đang làm việc</span>
                                                        <span className="text-slate-600">|</span>
                                                        <ActiveTimer startISO={shift.start_time} />
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">Kết thúc: {endTime} <span className="text-slate-600 mx-1">•</span> Thời lượng: {formatPreciseDuration(shift.start_time, shift.end_time!)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-1 text-emerald-400 font-medium">
                                                <p className="text-base">{shift.revenue?.toLocaleString()}₫</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pl-4 border-l border-slate-700/50">
                                            {isActive && (
                                                <button 
                                                    onClick={(e) => handleForceEndShift(e, shift.id)}
                                                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-all"
                                                    title="Kết thúc ca"
                                                >
                                                    <StopIcon size={14} />
                                                </button>
                                            )}
                                            
                                            <button 
                                                onClick={() => handleEditClick(shift)}
                                                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-sky-400 transition-all"
                                                title="Sửa ca"
                                            >
                                                <EditIcon size={14} />
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleDeleteShift(shift.id)}
                                                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-all"
                                                title="Xóa ca"
                                            >
                                                <TrashIcon size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {isEditModalOpen && (
                <TimeEntryModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveEdit}
                    entry={editingEntry}
                />
            )}
        </div>
    );
};

export default ShiftsNotificationModal;
