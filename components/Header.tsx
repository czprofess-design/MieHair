
import React, { useState, useRef, useEffect } from 'react';
import TopBar from './TopBar';
import SettingsController from './SettingsController';
import { LogoIcon, LogOutIcon, UserIcon, BriefcaseIcon, UsersIcon, BellIcon } from './Icons';
import type { Session } from '@supabase/supabase-js';
import { useSettings } from '../context/SettingsContext';
import type { Profile, TimeEntry } from '../types';

interface HeaderProps {
  session: Session | null;
  profile: Profile | null;
  handleSignOut: () => void;
  onSignInClick: () => void;
  onAccountClick: () => void;
  onTodaysShiftsClick: () => void;
  isAdminView: boolean;
  setIsAdminView: (isAdminView: boolean) => void;
  activeShift: TimeEntry | null;
  onStartShift: () => void;
  onEndShift: () => void;
  dataVersion: number;
}

const UserMenu: React.FC<{ session: Session; profile: Profile | null; onAccountClick: () => void; handleSignOut: () => void; }> = ({ session, profile, onAccountClick, handleSignOut }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const displayName = profile?.full_name || session.user.email || '';
    const avatarUrl = profile?.avatar_url;
    const userInitial = displayName.charAt(0).toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[var(--accent-color)] transition-colors">
                {avatarUrl ? <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover ring-1 ring-black/5" /> : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center text-white font-bold text-xs">{userInitial}</div>}
                <span className="hidden sm:inline max-w-[120px] truncate">{displayName}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl ring-1 ring-black/5 z-50 animate-fadeIn">
                    <div className="p-2">
                        <button onClick={() => { onAccountClick(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors">
                            <UserIcon size={16} /> <span>Cài đặt tài khoản</span>
                        </button>
                        <div className="my-1 border-t border-black/10 dark:border-white/10"></div>
                        <button onClick={handleSignOut} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm rounded-md text-rose-600 hover:bg-rose-50 transition-colors">
                            <LogOutIcon size={16} /> <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ session, profile, handleSignOut, onSignInClick, onAccountClick, onTodaysShiftsClick, isAdminView, setIsAdminView, activeShift, onStartShift, onEndShift, dataVersion }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-sm flex flex-col">
      <TopBar session={session} activeShift={activeShift} onStartShift={onStartShift} onEndShift={onEndShift} dataVersion={dataVersion} />
      <div className="container mx-auto px-4 py-2 md:py-0 md:h-16 flex flex-wrap items-center">
        <div className="w-full md:flex-1 flex justify-center order-1 md:order-2 mb-2 md:mb-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <LogoIcon />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--accent-color-dark)] dark:to-[var(--gradient-to)]">Mie Hair</span>
            </div>
        </div>
        <div className="w-1/2 md:flex-1 flex justify-start order-2 md:order-1">
            {session && profile?.role === 'admin' && (
                <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-0.5">
                    <button onClick={() => setIsAdminView(false)} className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors ${!isAdminView ? 'bg-white dark:bg-gray-800 shadow text-[var(--accent-color)]' : 'text-gray-600 dark:text-gray-400'}`}>
                        <BriefcaseIcon size={14}/> <span className="hidden sm:inline">Nhân Viên</span>
                    </button>
                    <button onClick={() => setIsAdminView(true)} className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors ${isAdminView ? 'bg-white dark:bg-gray-800 shadow text-[var(--accent-color)]' : 'text-gray-600 dark:text-gray-400'}`}>
                        <UsersIcon size={14}/> <span className="hidden sm:inline">Trang Quản Lý</span>
                    </button>
                </div>
            )}
        </div>
        <div className="w-1/2 md:flex-1 flex justify-end items-center space-x-2 order-3 md:order-3">
          {session && profile?.role === 'admin' && <button onClick={onTodaysShiftsClick} className="p-2 rounded-full text-gray-500 hover:text-[var(--accent-color)] relative"><BellIcon size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span></button>}
          {session ? <UserMenu session={session} profile={profile} onAccountClick={onAccountClick} handleSignOut={handleSignOut} /> : <button onClick={onSignInClick} className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md">Đăng nhập</button>}
          <SettingsController />
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
