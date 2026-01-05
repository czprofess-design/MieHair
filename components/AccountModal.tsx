import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { XIcon, UserIcon } from './Icons';
import type { Session } from '@supabase/supabase-js';
import { useSettings } from '../context/SettingsContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, session }) => {
    const { t } = useSettings();
    const [activeTab, setActiveTab] = useState('profile');
    
    const [profileLoading, setProfileLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetMessages = () => {
        setProfileMessage({ text: '', type: '' });
        setPasswordMessage({ text: '', type: '' });
    };

    const getProfile = useCallback(async () => {
        if (!session) return;
        setProfileLoading(true);
        resetMessages();
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`full_name, avatar_url`)
                .eq('id', session.user.id)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setFullName(data.full_name || '');
                setAvatarUrl(data.avatar_url || null);
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error.message);
            setProfileMessage({ text: 'Error fetching profile.', type: 'error' });
        } finally {
            setProfileLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (isOpen && session) {
            getProfile();
            setActiveTab('profile');
            setPassword('');
            setConfirmPassword('');
            setAvatarFile(null);
        }
    }, [isOpen, session, getProfile]);
    
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        setProfileLoading(true);
        setUploading(!!avatarFile);
        resetMessages();
        
        try {
            let newAvatarUrl = avatarUrl;
            
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop();
                const filePath = `${session.user.id}/${Math.random()}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
                newAvatarUrl = urlData.publicUrl;
            }

            const updates = {
                id: session.user.id,
                full_name: fullName,
                avatar_url: newAvatarUrl,
                updated_at: new Date().toISOString(),
            };

            const { error: profileError } = await supabase.from('profiles').upsert(updates);
            if (profileError) throw profileError;
            
            // Also update auth user metadata for consistency in the app
            await supabase.auth.updateUser({ data: { full_name: fullName, avatar_url: newAvatarUrl } });
            
            setProfileMessage({ text: t.profileUpdated, type: 'success' });
            setAvatarFile(null);
        } catch (error: any) {
            console.error("Error updating profile:", error.message);
            setProfileMessage({ text: error.message, type: 'error' });
        } finally {
            setProfileLoading(false);
            setUploading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        resetMessages();
        if (password !== confirmPassword) {
            setPasswordMessage({ text: t.passwordsDoNotMatch, type: 'error' });
            return;
        }
        setPasswordLoading(true);

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setPasswordMessage({ text: error.message, type: 'error' });
        } else {
            setPasswordMessage({ text: t.passwordUpdated, type: 'success' });
            setPassword('');
            setConfirmPassword('');
        }
        setPasswordLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-fadeInUp max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 pb-0 relative flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                        aria-label={t.close}
                    >
                        <XIcon size={24} />
                    </button>
                    <h2 id="account-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.accountSettings}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{session?.user?.email}</p>

                    <div className="border-b border-gray-200 dark:border-gray-700 mt-4">
                        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                            <button onClick={() => setActiveTab('profile')} className={`${activeTab === 'profile' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>{t.profile}</button>
                            <button onClick={() => setActiveTab('password')} className={`${activeTab === 'password' ? 'border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>{t.password}</button>
                        </nav>
                    </div>
                </div>

                <div className="overflow-y-auto p-6">
                    {activeTab === 'profile' ? (
                        <form onSubmit={handleProfileUpdate}>
                            <h3 className="text-lg font-medium">{t.updateProfile}</h3>
                            {profileLoading && !avatarFile ? (
                                <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading profile...</div>
                            ) : (
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.avatar}</label>
                                    <div className="mt-2 flex items-center gap-4">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <UserIcon size={32} className="text-gray-400" />
                                            </div>
                                        )}
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 shadow-sm transition-colors">{t.uploadAvatar}</button>
                                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/png, image/jpeg" className="hidden"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.fullName}</label>
                                    <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                                </div>
                            </div>
                            )}
                            <div className="mt-6 flex items-center justify-between">
                                <button type="submit" disabled={profileLoading || uploading} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none disabled:opacity-50">
                                    {uploading ? t.uploading : (profileLoading ? t.updating : t.update)}
                                </button>
                                {profileMessage.text && <span className={`text-sm animate-fadeIn ${profileMessage.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{profileMessage.text}</span>}
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordUpdate}>
                            <h3 className="text-lg font-medium">{t.changePassword}</h3>
                                <div className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.newPassword}</label>
                                    <input type="password" id="newPassword" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.confirmNewPassword}</label>
                                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm" />
                                </div>
                            </div>
                                <div className="mt-6 flex items-center justify-between">
                                <button type="submit" disabled={passwordLoading} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none disabled:opacity-50">
                                    {passwordLoading ? t.updating : t.update}
                                </button>
                                {passwordMessage.text && <span className={`text-sm animate-fadeIn ${passwordMessage.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{passwordMessage.text}</span>}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountModal;
