import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Creator } from '@/lib/api';

interface UserContextType {
  currentCreator: Creator | null;
  setCurrentCreator: (creator: Creator | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentCreator, setCurrentCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { connected, publicKey } = useWallet();

  const isAuthenticated = !!currentCreator;

  // Load creator data from localStorage on mount
  useEffect(() => {
    const savedCreator = localStorage.getItem('currentCreator');
    if (savedCreator) {
      try {
        setCurrentCreator(JSON.parse(savedCreator));
      } catch (error) {
        console.error('Failed to parse saved creator:', error);
        localStorage.removeItem('currentCreator');
      }
    }
  }, []);

  // Save creator data to localStorage when it changes
  useEffect(() => {
    if (currentCreator) {
      localStorage.setItem('currentCreator', JSON.stringify(currentCreator));
    } else {
      localStorage.removeItem('currentCreator');
    }
  }, [currentCreator]);

  // Clear creator data when wallet disconnects
  useEffect(() => {
    if (!connected && !publicKey) {
      setCurrentCreator(null);
    }
  }, [connected, publicKey]);

  const value: UserContextType = {
    currentCreator,
    setCurrentCreator,
    isAuthenticated,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
