
import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, CheckIcon, SettingsIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

const SettingsController: React.FC = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 rounded-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white shadow-md transform hover:scale-110">
        <SettingsIcon size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl ring-1 ring-black/5 z-50 animate-fadeIn">
          <div className="p-3 space-y-4">
            <div className="space-y-3">
              <h3 className="px-1 text-xs font-semibold capitalize text-gray-500 dark:text-gray-400">Giao diện</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 px-1">Chế độ</label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button onClick={() => setTheme('light')} className={`px-3 py-1.5 rounded-md flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-[var(--accent-color)] text-white font-semibold' : 'bg-gray-200 dark:bg-gray-700/50'}`}>
                    <SunIcon size={16} /> Sáng
                  </button>
                  <button onClick={() => setTheme('dark')} className={`px-3 py-1.5 rounded-md flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-[var(--accent-color)] text-white font-semibold' : 'bg-gray-200 dark:bg-gray-700/50'}`}>
                    <MoonIcon size={16} /> Tối
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 px-1">Màu nhấn</label>
                <div className="flex items-center gap-3 px-1">
                   <button onClick={() => setColorScheme('rose')} className={`w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 border-2 ${colorScheme === 'rose' ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)] ring-offset-2 dark:ring-offset-gray-800' : 'border-transparent'}`}>
                     {colorScheme === 'rose' && <CheckIcon size={14} className="text-white mx-auto" />}
                   </button>
                   <button onClick={() => setColorScheme('blue')} className={`w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 border-2 ${colorScheme === 'blue' ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)] ring-offset-2 dark:ring-offset-gray-800' : 'border-transparent'}`}>
                     {colorScheme === 'blue' && <CheckIcon size={14} className="text-white mx-auto" />}
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SettingsController;
