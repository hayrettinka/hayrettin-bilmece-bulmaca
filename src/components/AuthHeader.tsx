'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, signOut };
}

interface AuthHeaderProps {
  locale: string;
}

export function AuthHeader({ locale }: AuthHeaderProps) {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>;
  }

  if (!user) {
    return (
      <a
        href={`/${locale}/auth/login`}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 border border-gray-300 rounded-md hover:border-indigo-300 transition-colors"
      >
        <UserIcon className="h-4 w-4 mr-2" />
        {locale === 'tr' ? 'Giriş Yap' : 'Sign In'}
      </a>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <a
        href={`/${locale}/admin`}
        className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        {locale === 'tr' ? 'Admin Panel' : 'Admin Panel'}
      </a>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">{user.email}</span>
        <button
          onClick={signOut}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          title={locale === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
