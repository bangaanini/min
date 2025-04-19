import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { supabase } from '../../../lib/supabase';

const ADMIN_WALLETS = ['0x53367d720EF2A149a550414205d41B003A5273A0'].map((a) => a.toLowerCase());
const ADMIN_EMAILS = ['admin@chisachon.cloud'];

export const useAdminAuth = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const [mounted, setMounted] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const isAuthenticated = !!address || !!session;


  const isAdmin =
    (address && ADMIN_WALLETS.includes(address.toLowerCase())) ||
    (session?.user?.email && ADMIN_EMAILS.includes(session.user.email.toLowerCase()));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (mounted && (address || session)) {
      setLoadingAuth(false);
    }
  }, [mounted, address, session]);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });
        if (error) {
        setAuthError(error.message);
        } else {
        setSession(data.session);
        localStorage.setItem('lastLoginTime', Date.now().toString());
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        disconnect();
        setSession(null);
        setEmail('');
        setPassword('');
        setAuthError('');
        localStorage.removeItem('lastLoginTime');
    };

    

    return {
        address,
        mounted,
        loadingAuth,
        isAdmin,
        session,
        email,
        password,
        authError,
        setEmail,
        setPassword,
        handleEmailLogin,
        handleLogout,
        isAuthenticated,
    };
};
