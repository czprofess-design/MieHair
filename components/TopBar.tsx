
import React, { useState, useEffect } from 'react';
import SessionInfo from './SessionInfo';
import ActivityTicker from './ActivityTicker';
import type { Session } from '@supabase/supabase-js';
import type { TimeEntry } from '../types';
import { useSettings } from '../context/SettingsContext';
import { PlayIcon, StopIcon, LogoIcon } from './Icons';

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
            <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-amber-800 dark:text-amber-300 font-medium">{duration}</span>
                <button 
                    onClick={onEnd} 
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-sm transition-all hover:scale-105"
                >
                    <StopIcon size={14} /> {t.endShift}
                </button>
            </div>
        );
    }

    return (
        <button 
            onClick={onStart} 
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-sm transition-all hover:scale-105"
        >
            <PlayIcon size={14} /> {t.startShift}
        </button>
    );
};

const TopBar: React.FC<TopBarProps> = ({ session, activeShift, onStartShift, onEndShift, dataVersion }) => {
    const { t } = useSettings();
    return (
        <div className="bg-slate-100 dark:bg-black/20 text-gray-600 dark:text-gray-400 animate-fadeInDown border-b border-black/5 dark:border-white/5">
            <div className="container mx-auto px-4">
                
                {/* DESKTOP LAYOUT */}
                <div className="hidden md:flex relative w-full h-10 items-center">
                    <div className="flex-1 justify-start">
                        <SessionInfo />
                    </div>
                    {session && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                            <ShiftControl activeShift={activeShift} onStart={onStartShift} onEnd={onEndShift} />
                        </div>
                    )}
                    <div className="flex-1 flex justify-end">
                        <ActivityTicker session={session} dataVersion={dataVersion} />
                    </div>
                </div>

                {/* MOBILE LAYOUT */}
                <div className="w-full flex md:hidden justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                        {session ? (
                            <ShiftControl activeShift={activeShift} onStart={onStartShift} onEnd={onEndShift} />
                        ) : (
                            <div />
                        )}
                    </div>
                    <div className="flex justify-end">
                        <ActivityTicker session={session} dataVersion={dataVersion} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TopBar;
