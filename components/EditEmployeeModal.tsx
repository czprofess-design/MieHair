import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { XIcon, UserIcon, TrashIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';
import type { Profile } from '../types';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
  employee: Profile;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ isOpen, onClose, onSave, onDelete, employee }) => {
    const { t } = useSettings();
    
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'admin' | 'employee'>('employee');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (employee) {
            setFullName(employee.full_name);
            setRole(employee.role);
            setAvatarUrl(employee.avatar_url);
            setAvatarFile(null);
        }
    }, [employee, isOpen]);
    
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploading(!!avatarFile);

        let newAvatarUrl = avatarUrl;
        
        if (avatarFile) {
            const fileExt = avatarFile.name.split('.').pop();
            const filePath = `${employee.id}/${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true });
            if (uploadError) {
                alert('Error uploading avatar: ' + uploadError.message);
                setLoading(false);
                setUploading(false);
                return;
            }

            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            newAvatarUrl = urlData.publicUrl;
        }

        const updatedProfile: Profile = {
            ...employee,
            full_name: fullName,
            avatar_url: newAvatarUrl || '',
            role: role,
        };
        
        onSave(updatedProfile);
        setLoading(false);
        setUploading(false);
    };

    const handleDelete = () => {
        if (window.confirm(t.deleteEmployeeConfirmationMessage(employee.full_name || employee.id))) {
            onDelete(employee);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-employee-modal-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-fadeInUp"
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6 relative">
                        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" aria-label={t.close}>
                            <XIcon size={24} />
                        </button>
                        <h2 id="edit-employee-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.editEmployeeProfile}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{employee.id}</p>

                        <div className="mt-6 space-y-4">
                             <div>
                                <label className="block text-sm font-medium">{t.avatar}</label>
                                <div className="mt-2 flex items-center gap-4">
                                    {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><UserIcon size={32} className="text-gray-400" /></div>}
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600">{t.uploadAvatar}</button>
                                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/png, image/jpeg" className="hidden"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium">{t.fullName}</label>
                                <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium">{t.role}</label>
                                <select id="role" value={role} onChange={e => setRole(e.target.value as 'admin' | 'employee')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <option value="employee">{t.employee}</option>
                                    <option value="admin">{t.admin}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 flex justify-between items-center rounded-b-2xl">
                         <button type="button" onClick={handleDelete} className="px-4 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center gap-2">
                            <TrashIcon size={16}/> Delete
                        </button>
                        <div className="flex items-center space-x-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600">{t.cancel}</button>
                            <button type="submit" disabled={loading || uploading} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-md">
                                {uploading ? t.uploading : (loading ? t.updating : t.save)}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployeeModal;
