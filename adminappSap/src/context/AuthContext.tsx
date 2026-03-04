// @refresh reset
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  age?: number;
  location?: string;
  isAdmin?: boolean;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials - works offline
const DEMO_CREDENTIALS = {
  'admin@gmail.com': {
    id: '1',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'password',
    role: 'admin',
    is_admin: true,
  },
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const stored = localStorage.getItem('desiguide_jwt');
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        setLoading(false);
        return;
      } catch {
        setUser(null);
      }
    }
    
    // Auto-login with demo credentials
    const demoUser = DEMO_CREDENTIALS['admin@gmail.com'];
    if (demoUser) {
      const userObj = { ...demoUser, isAdmin: true };
      setUser(userObj);
      localStorage.setItem('desiguide_jwt', JSON.stringify(userObj));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Demo mode - check credentials locally first
      const demoUser = DEMO_CREDENTIALS[email as keyof typeof DEMO_CREDENTIALS];
      
      if (demoUser && demoUser.password === password) {
        const userObj = { ...demoUser, isAdmin: true };
        setUser(userObj);
        localStorage.setItem('desiguide_jwt', JSON.stringify(userObj));
        setLoading(false);
        return;
      }

      // Try to authenticate with Supabase if configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

      if (!isConfigured) {
        throw new Error(
          'Demo mode: Use credentials\n\n📧 Email: admin@gmail.com\n🔑 Password: password\n\nOr configure your .env file with Supabase credentials for production.'
        );
      }

      // Production mode - use Supabase
      const { data, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();

      if (queryError) throw queryError;
      if (!data) throw new Error('Invalid email or password');

      if (!data.is_admin && data.role !== 'admin') {
        throw new Error('Only admin users can log in.');
      }

      const userObj = { ...data, isAdmin: true, role: 'admin' };
      setUser(userObj);
      localStorage.setItem('desiguide_jwt', JSON.stringify(userObj));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('desiguide_jwt');
  };

  const value: AuthContextType = { user, login, logout, loading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};