
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogoIcon, XIcon } from './Icons';
import { useSettings } from '../context/SettingsContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    prompt?: string;
}

type AuthView = 'signIn' | 'signUp' | 'forgotPassword';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, prompt }) => {
  const { t } = useSettings();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Thêm state cho họ tên
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authView, setAuthView] = useState<AuthView>('signIn');

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setFullName('');
      setError(null);
      setMessage(null);
      setAuthView('signIn');
      if (prompt) {
        setMessage(prompt);
      }
    }
  }, [isOpen, prompt]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    let authError = null;

    if (authView === 'signUp') {
      // Gửi kèm fullName vào options.data (metadata)
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      authError = error;
      if (!error) setMessage(t.magicLinkSent);
    } else { // 'signIn'
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      authError = error;
      if (!error) onClose();
    }
    
    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  };
  
  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
       redirectTo: window.location.origin,
    });
    if (error) {
        setError(error.message);
    } else {
        setMessage(t.magicLinkSent);
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 ease-out animate-fadeInUp overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 relative">
          <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
              aria-label={t.close}
          >
              <XIcon size={24} />
          </button>
          
          <div className="flex flex-col items-center mb-6">
              <LogoIcon size={40} />
              <h1 id="auth-modal-title" className="text-2xl font-bold text-center mt-3 bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--accent-color-dark)] dark:to-[var(--gradient-to)]">
                 {authView === 'forgotPassword' ? 'Reset Password' : (prompt ? t.signInToContinue : t.authHeader)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center mt-1">
                {authView !== 'forgotPassword' && (prompt || t.authPrompt)}
              </p>
          </div>

          {authView !== 'forgotPassword' ? (
            <>
            <div className="grid grid-cols-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-6">
                <button onClick={() => setAuthView('signIn')} className={`py-3 transition-colors ${authView === 'signIn' ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}>
                    {t.signIn}
                </button>
                 <button onClick={() => setAuthView('signUp')} className={`py-3 transition-colors ${authView === 'signUp' ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'hover:text-gray-700 dark:hover:text-gray-200'}`}>
                    {t.signUp}
                </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                  {authView === 'signUp' && (
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">
                            Họ và tên
                        </label>
                        <input
                            id="fullName"
                            className="mt-1 block w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent sm:text-sm"
                            type="text"
                            placeholder="Họ và tên của bạn"
                            value={fullName}
                            required
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                  )}
                  <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">
                          {t.emailLabel}
                      </label>
                      <input
                          id="email"
                          className="mt-1 block w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent sm:text-sm"
                          type="email"
                          placeholder={t.emailLabel}
                          value={email}
                          required
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">
                         {t.passwordLabel}
                      </label>
                      <input
                          id="password"
                          className="mt-1 block w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent sm:text-sm"
                          type="password"
                          placeholder={t.passwordLabel}
                          value={password}
                          required
                          onChange={(e) => setPassword(e.target.value)}
                      />
                  </div>
              </div>
              
              {authView === 'signIn' && (
                <div className="text-right mt-2">
                    <button type="button" onClick={() => setAuthView('forgotPassword')} className="text-xs text-gray-500 dark:text-gray-400 hover:text-[var(--accent-color)] dark:hover:text-[var(--accent-color-dark)] transition-colors">
                        Forgot Password?
                    </button>
                </div>
              )}

              {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}
              {message && <p className="mt-3 text-center text-xs text-green-500">{message}</p>}

              <div className="mt-6">
                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:opacity-50 transition"
                  >
                      {loading ? (authView === 'signIn' ? t.signingIn : t.signingUp) : (authView === 'signIn' ? t.signIn : t.signUp)}
                  </button>
              </div>
            </form>
            </>
          ) : (
            <form onSubmit={handlePasswordReset}>
                 <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">Enter your email and we'll send you a link to reset your password.</p>
                 <input
                    id="email-reset"
                    className="mt-1 block w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent sm:text-sm"
                    type="email"
                    placeholder={t.emailLabel}
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                 {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}
                 {message && <p className="mt-3 text-center text-xs text-green-500">{message}</p>}

                 <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:opacity-50 transition"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => setAuthView('signIn')} className="mt-3 w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-[var(--accent-color)] dark:hover:text-[var(--accent-color-dark)] transition-colors">
                    Back to Sign In
                </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
