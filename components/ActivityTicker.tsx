
import React, { useState, useEffect, useCallback } from 'react';
import { UsersIcon, DollarSignIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { TimeEntry } from '../types';

interface AnimatedNumberProps {
  value: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  return (
    <span key={value} className="animate-numberFlip inline-block">
      {value.toLocaleString('vi-VN')}
    </span>
  );
};

interface ActivityTickerProps {
    session: Session | null;
    dataVersion: number;
    activeShift?: TimeEntry | null;
}

const ActivityTicker: React.FC<ActivityTickerProps> = ({ session, dataVersion, activeShift }) => {
  const { t } = useSettings();
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [userMonthlyRevenue, setUserMonthlyRevenue] = useState(0);
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
    
    // 2. Get current user's monthly revenue
    if (session) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const { data: userEntries, error: userEntriesError } = await supabase
            .from('time_entries')
            .select('revenue')
            .eq('user_id', session.user.id)
            .gte('start_time', startOfMonth.toISOString());
            
        if (!userEntriesError) {
            const totalRev = userEntries.reduce((acc, entry) => acc + (entry.revenue || 0), 0);
            setUserMonthlyRevenue(totalRev);
        }
    } else {
        setUserMonthlyRevenue(0);
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
    return <div className="text-xs animate-pulse font-mono text-gray-400">...</div>;
  }

  return (
    <div className="flex items-center space-x-4 text-xs">
      {/* User Status Indicator */}
      {session && (
          <div className="flex items-center space-x-1.5 animate-fadeIn">
            <span className={`w-2 h-2 rounded-full ${activeShift ? 'bg-orange-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className={`font-medium ${activeShift ? 'text-orange-500' : 'text-slate-500'}`}>
                {activeShift ? t.liveActivityOnShift : t.liveActivityIdle}
            </span>
          </div>
      )}

      <div className="hidden sm:flex items-center space-x-1.5" title={t.activeSubs}>
        <UsersIcon size={16} className="text-sky-500" />
        <span className="hidden lg:inline whitespace-nowrap font-medium text-gray-500 dark:text-gray-400">Nhân sự:</span>
        <span className="font-mono font-bold text-gray-700 dark:text-gray-200"><AnimatedNumber value={activeEmployees} /></span>
      </div>
      
      {session && (
          <div className="hidden sm:flex items-center space-x-1.5" title={t.revenue}>
            <DollarSignIcon size={16} className="text-emerald-500" />
            <span className="hidden lg:inline whitespace-nowrap font-medium text-gray-500 dark:text-gray-400">Doanh thu:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400"><AnimatedNumber value={userMonthlyRevenue} /> đ</span>
          </div>
      )}
    </div>
  );
};

export default ActivityTicker;
