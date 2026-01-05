
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import AuthModal from './components/Auth';
import AccountModal from './components/AccountModal';
import UserGuideModal from './components/UserGuide';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import TimeEntryModal from './components/TimeEntryModal';
import DailyNoteModal from './components/DailyNoteModal';
import ManageEntriesModal from './components/ManageEntriesModal';
import ShiftsNotificationModal from './components/ShiftsNotificationModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Profile, TimeEntry, DailyNote } from './types';
import { SettingsContext, SettingsContextType } from './context/SettingsContext';
// Import the translation object to be provided via context
import { t as translations } from './translations';

const AppContainer: React.FC<{ session: Session | null }> = ({ session }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [colorScheme, setColorScheme] = useLocalStorage<'rose' | 'blue'>('colorScheme', 'rose');
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isTodaysShiftsOpen, setIsTodaysShiftsOpen] = useState(false);
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  const [isAdminView, setIsAdminView] = useState(false);
  const [activeShift, setActiveShift] = useState<TimeEntry | null>(null);
  const [dataVersion, setDataVersion] = useState(0);

  const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | Partial<TimeEntry> | null>(null);
  const [isManageEntriesModalOpen, setIsManageEntriesModalOpen] = useState(false);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedDateForNote, setSelectedDateForNote] = useState<Date | null>(null);
  const [activeNote, setActiveNote] = useState<DailyNote | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteModalError, setNoteModalError] = useState<string | null>(null);
  const [noteOwnerId, setNoteOwnerId] = useState<string | null>(null);
  const [isNoteReadOnly, setIsNoteReadOnly] = useState(false);
  const ymdFormatter = useMemo(() => new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }), []);

  const refreshData = useCallback(() => setDataVersion(v => v + 1), []);

  const fetchActiveShift = useCallback(async (user: Session['user'] | null) => {
    if (!user) {
        setActiveShift(null);
        return;
    }
    const { data, error } = await supabase.from('time_entries').select('*').eq('user_id', user.id).is('end_time', null).single();
    if (error && error.code !== 'PGRST116') console.error("Error fetching active shift:", error.message);
    else setActiveShift(data);
  }, []);

  const fetchEmployees = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    if (data) setEmployees(data);
  }, []);

  useEffect(() => {
    fetchActiveShift(session?.user ?? null);
    if (session) fetchEmployees();
  }, [session, fetchActiveShift, fetchEmployees, dataVersion]);

  const handleStartShift = async () => {
    if (!session) return;
    const { error } = await supabase.from('time_entries').insert({ user_id: session.user.id, start_time: new Date().toISOString(), revenue: 0 });
    if (error) console.error("Error starting shift:", error);
    else refreshData();
  };

  const handleEndShiftRequest = () => {
    if (!activeShift) return;
    setEditingEntry({
        ...activeShift,
        end_time: new Date().toISOString()
    });
    setIsTimeEntryModalOpen(true);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-rose', 'theme-blue');
    root.classList.add(`theme-${colorScheme}`);
  }, [colorScheme]);

  const getProfile = useCallback(async (user: Session['user'] | null) => {
      if (!user) return;
      setLoadingProfile(true);
      try {
          const { data, error } = await supabase.from('profiles').select(`*`).eq('id', user.id).single();
          if (error && error.code !== 'PGRST116') throw error;
          if (data) {
              setProfile(data);
              if (data.role === 'admin') setIsAdminView(true);
          }
          else setIsAdminView(false);
      } catch (error: any) {
          console.error('Error fetching profile:', error.message);
      } finally {
          setLoadingProfile(false);
      }
  }, []);

  useEffect(() => {
    if (session) getProfile(session.user);
    else { setProfile(null); setLoadingProfile(false); setIsAdminView(false); }
  }, [session, getProfile]);
  
  const handleSaveEntry = async (entry: Partial<TimeEntry>) => {
      if (!session) return;
      if (profile?.role === 'employee' && (entry as TimeEntry).id) {
          setIsTimeEntryModalOpen(false);
          return;
      }
      const user_id = 'user_id' in entry ? entry.user_id : session.user.id;
      const { error } = (entry as TimeEntry).id
          ? await supabase.from('time_entries').update({ ...entry, user_id }).eq('id', (entry as TimeEntry).id)
          : await supabase.from('time_entries').insert({ ...entry, user_id });
      
      if (error) console.error("Error saving entry:", error);
      else {
          refreshData();
          setIsTimeEntryModalOpen(false);
          setEditingEntry(null);
      }
  };

  const openAddEntryModal = () => {
      const start = new Date(); start.setHours(9, 0, 0, 0);
      const end = new Date(); end.setHours(17, 0, 0, 0);
      setEditingEntry({ start_time: start.toISOString(), end_time: end.toISOString(), revenue: 0 });
      setIsTimeEntryModalOpen(true);
  };
  
  const openEditEntryModal = (entry: TimeEntry) => {
      setEditingEntry(entry);
      setIsTimeEntryModalOpen(true);
  };

  const handleOpenNoteModal = useCallback((date: Date, note: DailyNote | null, ownerId: string, readOnly: boolean = false) => {
      setSelectedDateForNote(date); setActiveNote(note); setNoteOwnerId(ownerId); setIsNoteReadOnly(readOnly); setIsNoteModalOpen(true);
  }, []);

  const handleCloseNoteModal = useCallback(() => { setIsNoteModalOpen(false); }, []);

  const handleSaveNote = useCallback(async ({ noteText, file, removeExistingFile }: { noteText: string; file: File | null; removeExistingFile: boolean }) => {
      if (!noteOwnerId || !selectedDateForNote) return;
      setIsSavingNote(true);
      let file_url = activeNote?.file_url || null;
      try {
          if (file) {
              const filePath = `${noteOwnerId}/${ymdFormatter.format(selectedDateForNote)}/${Date.now()}-${file.name}`;
              await supabase.storage.from('daily_attachments').upload(filePath, file);
              const { data: urlData } = supabase.storage.from('daily_attachments').getPublicUrl(filePath);
              file_url = urlData.publicUrl;
          }
          await supabase.from('daily_notes').upsert({ user_id: noteOwnerId, date: ymdFormatter.format(selectedDateForNote), note: noteText, file_url }, { onConflict: 'user_id, date' });
          refreshData();
          handleCloseNoteModal();
      } catch(error: any) { setNoteModalError(error.message); } finally { setIsSavingNote(false); }
  }, [noteOwnerId, selectedDateForNote, activeNote, refreshData, handleCloseNoteModal, ymdFormatter]);

  const handleDeleteNote = useCallback(async () => {
      if (!noteOwnerId || !activeNote) return;
      setIsSavingNote(true);
      try {
          await supabase.from('daily_notes').delete().eq('id', activeNote.id);
          refreshData();
          handleCloseNoteModal();
      } catch(error: any) { setNoteModalError(error.message); } finally { setIsSavingNote(false); }
  }, [noteOwnerId, activeNote, refreshData, handleCloseNoteModal]);

  // Providing 'vi' as the default language and 'translations' as the t object.
  const language = 'vi';
  const settingsContextValue: SettingsContextType = { 
    theme, 
    setTheme, 
    colorScheme, 
    setColorScheme, 
    language, 
    t: translations 
  };
  
  return (
    <SettingsContext.Provider value={settingsContextValue}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans flex flex-col transition-colors duration-300">
        <Header 
          session={session} profile={profile} handleSignOut={() => supabase.auth.signOut()}
          onSignInClick={() => setIsAuthModalOpen(true)} onAccountClick={() => setIsAccountModalOpen(true)}
          onTodaysShiftsClick={() => setIsTodaysShiftsOpen(true)}
          isAdminView={isAdminView} setIsAdminView={setIsAdminView}
          activeShift={activeShift} onStartShift={handleStartShift} onEndShift={handleEndShiftRequest}
          dataVersion={dataVersion}
        />
        <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
          {isSupabaseConfigured ? (
              profile?.role === 'admin' && isAdminView ? 
              <AdminDashboard onOpenNoteModal={handleOpenNoteModal} onManageEntries={() => setIsManageEntriesModalOpen(true)} /> : 
              <EmployeeDashboard session={session} profile={profile} dataVersion={dataVersion} onOpenNoteModal={handleOpenNoteModal} onManageEntries={() => setIsManageEntriesModalOpen(true)} />
          ) : <div className="text-center p-10 bg-amber-50 rounded-xl">Supabase chưa được cấu hình</div>}
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} session={session} />
        <UserGuideModal isOpen={isUserGuideOpen} onClose={() => setIsUserGuideOpen(false)} />
        {isTodaysShiftsOpen && <ShiftsNotificationModal isOpen={isTodaysShiftsOpen} onClose={() => setIsTodaysShiftsOpen(false)} employees={employees} />}
        {isTimeEntryModalOpen && <TimeEntryModal isOpen={isTimeEntryModalOpen} onClose={() => setIsTimeEntryModalOpen(false)} onSave={handleSaveEntry} entry={editingEntry as TimeEntry | null} />}
        {isNoteModalOpen && selectedDateForNote && (
          <DailyNoteModal isOpen={isNoteModalOpen} onClose={handleCloseNoteModal} onSave={handleSaveNote} onDelete={handleDeleteNote} note={activeNote} date={selectedDateForNote} isSaving={isSavingNote} error={noteModalError} readOnly={isNoteReadOnly} />
        )}
        {isManageEntriesModalOpen && (
          <ManageEntriesModal isOpen={isManageEntriesModalOpen} onClose={() => setIsManageEntriesModalOpen(false)} session={session} profile={profile} onAddEntry={() => { setIsManageEntriesModalOpen(false); openAddEntryModal(); }} onEditEntry={(entry) => { setIsManageEntriesModalOpen(false); openEditEntryModal(entry); }} />
        )}
      </div>
    </SettingsContext.Provider>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);
  return <AppContainer session={session} />;
}
