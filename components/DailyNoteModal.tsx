import React, { useState, useEffect, useRef } from 'react';
import { XIcon, PaperclipIcon, TrashIcon, SpinnerIcon, DocumentTextIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';
import { DailyNote } from '../types';

interface DailyNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { noteText: string; file: File | null; removeExistingFile: boolean }) => Promise<void>;
  onDelete: () => Promise<void>;
  note: DailyNote | null;
  date: Date;
  isSaving: boolean;
  error?: string | null;
  readOnly?: boolean;
}

const DailyNoteModal: React.FC<DailyNoteModalProps> = ({ isOpen, onClose, onSave, onDelete, note, date, isSaving, error, readOnly = false }) => {
    const { t, language } = useSettings();
    const [noteText, setNoteText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [removeExistingFile, setRemoveExistingFile] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const dateFormatted = new Intl.DateTimeFormat(language, { dateStyle: 'full' }).format(date);
    
    useEffect(() => {
        if (isOpen) {
            setNoteText(note?.note || '');
            setFilePreview(note?.file_url || null);
            setFile(null);
            setRemoveExistingFile(false);
        }
    }, [isOpen, note]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly) return;
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
            setRemoveExistingFile(false);
        }
    };

    const handleRemoveFile = () => {
        if (readOnly) return;
        setFile(null);
        setFilePreview(null);
        setRemoveExistingFile(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSaveClick = async () => {
        if (readOnly) return;
        await onSave({ noteText, file, removeExistingFile });
    };

    const handleDeleteClick = async () => {
        if(readOnly) return;
        if(window.confirm("Are you sure you want to delete this note and its attachment?")) {
            await onDelete();
        }
    };

    if (!isOpen) return null;

    return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-modal-title"
    >
        <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-out animate-fadeInUp"
            onClick={e => e.stopPropagation()}
        >
            <div className="p-6 relative">
                <button 
                    type="button"
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                    aria-label={t.close}
                >
                    <XIcon size={24} />
                </button>
                <h2 id="note-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <DocumentTextIcon size={24}/>
                    Note for {dateFormatted}
                </h2>
                <div className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="note-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Note</label>
                        <textarea 
                            id="note-text"
                            rows={5}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            readOnly={readOnly}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] sm:text-sm disabled:opacity-70"
                            placeholder={readOnly && !noteText ? "No note for this day." : "Add details..."}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attachment</label>
                        {filePreview ? (
                            <div className="mt-2 relative group">
                                <a href={filePreview} target="_blank" rel="noopener noreferrer">
                                    <img src={filePreview} alt="File preview" className="max-h-48 rounded-md object-contain border border-gray-300 dark:border-gray-600"/>
                                </a>
                                {!readOnly && (
                                    <button onClick={handleRemoveFile} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove attachment">
                                        <TrashIcon size={16} />
                                    </button>
                                )}
                            </div>
                        ) : (
                             <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <PaperclipIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                         {!readOnly ? (
                                             <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-[var(--accent-color)] hover:text-[var(--accent-color-dark)]">
                                                <span>Upload a file</span>
                                                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                            </label>
                                         ) : <p>No file attached.</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 flex flex-col gap-3 rounded-b-2xl">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="flex justify-between items-center">
                    {note && !readOnly ? (
                        <button onClick={handleDeleteClick} disabled={isSaving} className="px-4 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 flex items-center gap-2">
                            <TrashIcon size={16}/> Delete
                        </button>
                    ) : <div />}
                    <div className="flex items-center space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 shadow-sm transition-colors">{t.close}</button>
                        {!readOnly && (
                            <button onClick={handleSaveClick} disabled={isSaving} className="px-4 py-2 w-24 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-md shadow-md disabled:opacity-50 flex justify-center items-center">
                                {isSaving ? <SpinnerIcon className="animate-spin" size={20}/> : t.save}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default DailyNoteModal;
