
import React, { useState, useEffect } from 'react';
import { GlobeIcon, ClockIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

const SessionInfo: React.FC = () => {
  const { t } = useSettings();
  const [ip, setIp] = useState('...');
  const [sessionTime, setSessionTime] = useState('00:00');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch('https://api.ipify.org?format=json', { signal })
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch((err) => {
        if (err.name !== 'AbortError') {
            setIp('Unavailable');
        }
      });
      
      return () => {
        controller.abort();
      };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const seconds = String(elapsed % 60).padStart(2, '0');
      setSessionTime(`${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex items-center space-x-4 text-xs">
      <div className="flex items-center space-x-1.5">
        <GlobeIcon size={16} className="text-[var(--accent-color)]" />
        <span>{t.ipAddress}:</span>
        <span className="font-mono">{ip}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <ClockIcon size={16} className="text-[var(--accent-color)]" />
        <span>{t.sessionTime}:</span>
        <span className="font-mono">{sessionTime}</span>
      </div>
    </div>
  );
};

export default SessionInfo;
