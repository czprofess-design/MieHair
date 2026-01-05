
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UsersIcon, ClockIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AnimatedNumberProps {
  value: number;
  isDecimal?: boolean;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, isDecimal = false }) => {
  const formattedValue = isDecimal ? value.toFixed(1) : value.toLocaleString();
  return (
    <span key={value} className="animate-numberFlip inline-block">
      {formattedValue}
    </span>
  );
};

interface ActivityTickerProps {
    session: Session | null;
    dataVersion: number;
}

const ActivityTicker: React.FC<ActivityTickerProps> = ({ session, dataVersion }) => {
  const { t } = useSettings();
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [userMonthlyHours, setUserMonthlyHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickerData = useCallback(async () => {
    // 1. Get active employees count
    const { count: activeCount, error: activeError } = await supabase
        .from('time_entries')
        .select('user_id', { count: 'exact', head: true })
        .is('end_time', null);

    if (!activeError) {
        setActiveEmployees(activeCount || 0);
    }
    
    // 2. Get current user's monthly hours
    if (session) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const { data: userEntries, error: userEntriesError } = await supabase
            .from('time_entries')
            .select('start_time, end_time')
            .eq('user_id', session.user.id)
            .gte('start_time', startOfMonth.toISOString());
            
        if (!userEntriesError) {
            const totalMs = userEntries.reduce((acc, entry) => {
                // For active shifts, calculate duration up to now
                const end = entry.end_time ? new Date(entry.end_time) : new Date();
                const start = new Date(entry.start_time);
                if (end > start) {
                    return acc + (end.getTime() - start.getTime());
                }
                return acc;
            }, 0);
            setUserMonthlyHours(totalMs / (1000 * 60 * 60));
        }
    } else {
        setUserMonthlyHours(0);
    }

    if (isLoading) {
        setIsLoading(false);
    }
  }, [session, isLoading]);
  
  useEffect(() => {
    fetchTickerData(); // Initial fetch & on dataVersion change
    const dataInterval = setInterval(fetchTickerData, 60000); // Also keep refreshing every 1 minute
    return () => clearInterval(dataInterval);
  }, [fetchTickerData, dataVersion]);

  if (isLoading) {
    return <div className="text-xs animate-pulse font-light">...</div>;
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-3 md:gap-x-4 gap-y-1 text-xs">
      <div className="flex items-center gap-x-2">
        {activeEmployees > 0 ? (
           <span className="relative flex h-1.5 w-1.5" title={t.liveActivityOnShift}>
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
           </span>
        ) : (
            <span className="relative flex h-1.5 w-1.5" title={t.liveActivityIdle}>
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
           </span>
        )}
        <span className="font-medium text-gray-500 hidden sm:inline">{activeEmployees > 0 ? 'Trong ca' : 'Nghỉ'}</span>
      </div>

      <div className="flex items-center gap-x-1.5" title={t.activeSubs}>
        <UsersIcon size={14} className="text-[var(--accent-color)] opacity-70" />
        <span className="font-bold text-gray-700 dark:text-gray-300"><AnimatedNumber value={activeEmployees} /></span>
        <span className="hidden lg:inline text-gray-500 font-light">nhân viên</span>
      </div>
      
      {session && (
          <div className="flex items-center gap-x-1.5" title={t.userMonthlyHours}>
            <ClockIcon size={14} className="text-green-500 opacity-70" />
            <span className="hidden lg:inline text-gray-500 font-light">Tháng này:</span>
            <span className="font-bold text-gray-700 dark:text-gray-300"><AnimatedNumber value={userMonthlyHours} isDecimal />h</span>
          </div>
      )}
    </div>
  );
};

export default ActivityTicker;
