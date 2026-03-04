import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  age?: number;
  location?: string;
  isAdmin?: boolean;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  // signup: (name: string, email: string, password: string, age: number, location: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const stored = localStorage.getItem('desiguide_jwt');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
      setLoading(false);
    } else {
      checkUser();
    }
  }, []);

  const checkUser = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('desiguide_jwt');
      if (stored) {
        setUser(JSON.parse(stored));
        setLoading(false);
        return;
      }
      
      // Check if environment variables are configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
        console.warn('Supabase not configured. Skipping user check.');
        setLoading(false);
        return;
      }
      
      const { data } = await supabase.from('users').select('*').maybeSingle();
      if (data) setUser({ ...data, isAdmin: data.is_admin });
    } catch (err) {
      console.error('Error checking user:', err);
    } finally {
      setLoading(false);
    }
  };


  // const signup = async (name: string, email: string, password: string, age: number, location: string) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
    
  //     const { data, error } = await supabase
  //       .from('users')
  //       .insert([{ name, email, password, age, location, is_admin: true, role: 'admin' }])
  //       .select()
  //       .single();
  //     if (error) throw error;
  //     if (!data) throw new Error('Signup failed. No user data returned.');
  //     setUser({ ...data, isAdmin: true, role: 'admin' });
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'An error occurred during signup');
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        throw new Error('Supabase is not configured. Please set up your .env file with valid credentials.');
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Invalid email or password');

      //admin login
      if (!data.is_admin && data.role !== 'admin') {
        throw new Error('Only admin users can log in.');
      }
      const userObj = { ...data, isAdmin: true, role: 'admin' };
      setUser(userObj);
      localStorage.setItem('desiguide_jwt', JSON.stringify(userObj));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('desiguide_jwt');
  };

  const value = { user, login, logout, loading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};