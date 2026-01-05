
import React from 'react';
import { Translation } from '../types';

// Define the shape of the context data
export interface SettingsContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  colorScheme: 'rose' | 'blue';
  setColorScheme: (scheme: 'rose' | 'blue') => void;
  /** The current active language code (e.g., 'vi', 'en'). */
  language: string;
  /** The translation dictionary containing all localized strings. */
  t: Translation;
}

// Create the context with an undefined initial value
export const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

// Custom hook for consuming the context
export const useSettings = (): SettingsContextType => {
    const context = React.useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
