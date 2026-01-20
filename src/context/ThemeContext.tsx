import { createContext, useContext, ReactNode } from 'react';
import { useAppStore } from '../store/appStore';

interface Theme {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  inputBackground: string;
}

const lightTheme: Theme = {
  background: '#F3F4F6',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  primary: '#10B981',
  border: '#E5E7EB',
  inputBackground: '#F3F4F6',
};

const darkTheme: Theme = {
  background: '#111827',
  card: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  primary: '#10B981',
  border: '#374151',
  inputBackground: '#374151',
};

const ThemeContext = createContext<Theme>(lightTheme);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const settings = useAppStore((state) => state.settings);
  const theme = settings.theme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}