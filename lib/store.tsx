'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Language, translations, TranslationKey } from './translations';
import { Feed, defaultFeeds } from './feed-data';

// User types
export interface User {
  email: string;
  role: 'admin' | 'user';
  name: string;
}

// Ration history
export interface SavedRation {
  id: string;
  name: string;
  date: string;
  cowCharacteristics: {
    liveWeight: number;
    milkProductionPotential: number;
    lactationWeek: number;
    bodyConditionScore: number;
    ageMonths: number;
    gestationWeek: number;
    isMultiparous: boolean;
  };
  feeds: { feedId: string; quantity: number }[];
  results: {
    uflSupply: number;
    pdinSupply: number;
    pdieSupply: number;
    milkPermitted: number;
  };
}

// Statistics
export interface Statistics {
  totalCalculations: number;
  savedRations: number;
  averageMilkProduction: number;
  calculationsByDate: { date: string; count: number }[];
}

// App state
interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Feeds
  feeds: Feed[];
  addFeed: (feed: Omit<Feed, 'id'>) => void;
  updateFeed: (id: string, feed: Partial<Feed>) => void;
  deleteFeed: (id: string) => void;
  
  // Rations
  savedRations: SavedRation[];
  saveRation: (ration: Omit<SavedRation, 'id' | 'date'>) => void;
  deleteRation: (id: string) => void;
  
  // Statistics
  statistics: Statistics;
  incrementCalculations: () => void;
}

const AppContext = createContext<AppState | null>(null);

// Users database
const USERS = {
  'admin@agr.com': { password: '0000', role: 'admin' as const, name: 'Administrateur' },
  'user@agr.com': { password: '0000', role: 'user' as const, name: 'Utilisateur' }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguageState] = useState<Language>('fr');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [feeds, setFeeds] = useState<Feed[]>(defaultFeeds);
  const [savedRations, setSavedRations] = useState<SavedRation[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalCalculations: 0,
    savedRations: 0,
    averageMilkProduction: 0,
    calculationsByDate: []
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('rationpro_user');
      const savedLanguage = localStorage.getItem('rationpro_language');
      const savedTheme = localStorage.getItem('rationpro_theme');
      const savedFeeds = localStorage.getItem('rationpro_feeds');
      const savedRationsData = localStorage.getItem('rationpro_rations');
      const savedStats = localStorage.getItem('rationpro_statistics');

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedLanguage) setLanguageState(savedLanguage as Language);
      if (savedTheme) setIsDarkMode(savedTheme === 'dark');
      if (savedFeeds) setFeeds(JSON.parse(savedFeeds));
      if (savedRationsData) setSavedRations(JSON.parse(savedRationsData));
      if (savedStats) setStatistics(JSON.parse(savedStats));
      
      setIsInitialized(true);
    }
  }, []);

  // Apply dark mode class
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [isDarkMode, language]);

  // Save to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('rationpro_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('rationpro_user');
      }
      localStorage.setItem('rationpro_language', language);
      localStorage.setItem('rationpro_theme', isDarkMode ? 'dark' : 'light');
      localStorage.setItem('rationpro_feeds', JSON.stringify(feeds));
      localStorage.setItem('rationpro_rations', JSON.stringify(savedRations));
      localStorage.setItem('rationpro_statistics', JSON.stringify(statistics));
    }
  }, [user, language, isDarkMode, feeds, savedRations, statistics, isInitialized]);

  const login = (email: string, password: string): boolean => {
    const userData = USERS[email as keyof typeof USERS];
    if (userData && userData.password === password) {
      setUser({ email, role: userData.role, name: userData.name });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (theme: 'light' | 'dark') => {
    setIsDarkMode(theme === 'dark');
  };

  const addFeed = (feed: Omit<Feed, 'id'>) => {
    const newFeed = { ...feed, id: Date.now().toString() };
    setFeeds(prev => [...prev, newFeed as Feed]);
  };

  const updateFeed = (id: string, feedUpdate: Partial<Feed>) => {
    setFeeds(prev => prev.map(f => f.id === id ? { ...f, ...feedUpdate } : f));
  };

  const deleteFeed = (id: string) => {
    setFeeds(prev => prev.filter(f => f.id !== id));
  };

  const saveRation = (ration: Omit<SavedRation, 'id' | 'date'>) => {
    const newRation: SavedRation = {
      ...ration,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setSavedRations(prev => [...prev, newRation]);
    setStatistics(prev => ({
      ...prev,
      savedRations: prev.savedRations + 1
    }));
  };

  const deleteRation = (id: string) => {
    setSavedRations(prev => prev.filter(r => r.id !== id));
    setStatistics(prev => ({
      ...prev,
      savedRations: Math.max(0, prev.savedRations - 1)
    }));
  };

  const incrementCalculations = () => {
    const today = new Date().toISOString().split('T')[0];
    setStatistics(prev => {
      const existingDate = prev.calculationsByDate.find(d => d.date === today);
      let newByDate;
      if (existingDate) {
        newByDate = prev.calculationsByDate.map(d => 
          d.date === today ? { ...d, count: d.count + 1 } : d
        );
      } else {
        newByDate = [...prev.calculationsByDate.slice(-29), { date: today, count: 1 }];
      }
      return {
        ...prev,
        totalCalculations: prev.totalCalculations + 1,
        calculationsByDate: newByDate
      };
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      language,
      setLanguage,
      t,
      isDarkMode,
      toggleDarkMode,
      theme: isDarkMode ? 'dark' : 'light',
      setTheme,
      feeds,
      addFeed,
      updateFeed,
      deleteFeed,
      savedRations,
      saveRation,
      deleteRation,
      statistics,
      incrementCalculations
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
