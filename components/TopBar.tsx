
import React, { useState, useEffect } from 'react';
import SessionInfo from './SessionInfo';
import ActivityTicker from './ActivityTicker';
import type { Session } from '@supabase/supabase-js';
import type { TimeEntry } from '../types';
import { useSettings } from '../context/SettingsContext';
import { PlayIcon, StopIcon } from './Icons';

interface TopBarProps {
    session: Session | null;
    activeShift: TimeEntry | null;
    onStartShift: () => void;
    onEndShift: () => void;
    dataVersion: number;
}

const ShiftControl: React.FC<{
    activeShift: TimeEntry | null;
    onStart: () => void;
    onEnd: () => void;
}> = ({ activeShift, onStart, onEnd }) => {
    const { t } = useSettings();
    const [duration, setDuration] = useState('00:00:00');

    useEffect(() => {
        let timerId: number | undefined;
        if (activeShift) {
            const updateDuration = () => {
                const durationMs = new Date().getTime() - new Date(activeShift.start_time).getTime();
                const hours = String(Math.floor(durationMs / 3600000)).padStart(2, '0');
                const minutes = String(Math.floor((durationMs % 3600000) / 60000)).padStart(2, '0');
                const seconds = String(Math.floor((durationMs % 60000) / 1000)).padStart(2, '0');
                setDuration(`${hours}:${minutes}:${seconds}`);
            };
            updateDuration();
            timerId = window.setInterval(updateDuration, 1000);
        }
        return () => window.clearInterval(timerId);
    }, [activeShift]);
    
    if (activeShift) {
        return (
            <div className="flex items-center gap-4">
                <span className="font-mono text-base font-bold text-amber-500 drop-shadow-sm min-w-[70px] text-center">{duration}</span>
                <button 
                    onClick={onEnd} 
                    className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 tracking-wide"
                >
                    <StopIcon size={12} fill="currentColor" /> {t.endShift}
                </button>
            </div>
        );
    }

    return (
        <button 
            onClick={onStart} 
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 tracking-wide"
        >
            <PlayIcon size={12} fill="currentColor" /> {t.startShift}
        </button>
    );
};

const TopBar: React.FC<TopBarProps> = ({ session, activeShift, onStartShift, onEndShift, dataVersion }) => {
    return (
        <div className="bg-slate-50 dark:bg-[#0f172a] text-gray-600 dark:text-gray-400 animate-fadeInDown border-b border-black/5 dark:border-white/5 transition-colors duration-300">
            <div className="container mx-auto px-4">
                
                {/* DESKTOP LAYOUT */}
                <div className="hidden md:flex relative w-full h-10 items-center justify-between">
                    <div className="flex-1 flex justify-start">
                        <SessionInfo />
                    </div>
                    
                    {session && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                            <ShiftControl activeShift={activeShift} onStart={onStartShift} onEnd={onEndShift} />
                        </div>
                    )}
                    
                    <div className="flex-1 flex justify-end">
                        <ActivityTicker session={session} dataVersion={dataVersion} activeShift={activeShift} />
                    </div>
                </div>

                {/* MOBILE LAYOUT */}
                <div className="w-full flex md:hidden justify-between items-center py-2 h-auto min-h-[40px]">
                    <div className="flex items-center gap-2">
                        {session ? (
                            <ShiftControl activeShift={activeShift} onStart={onStartShift} onEnd={onEndShift} />
                        ) : (
                            <div />
                        )}
                    </div>
                    <div className="flex justify-end pl-2">
                        <ActivityTicker session={session} dataVersion={dataVersion} activeShift={activeShift} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TopBar;
