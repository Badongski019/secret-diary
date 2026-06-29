// src/lib/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';

const AuthContext = createContext(null);

// ── Callsign auth (no Firebase account needed for the lover) ────────────────
// The "babuu" password is checked client-side; the actual Firebase user
// is a shared read-only account you create once in the Firebase console.
// For the admin panel a separate, secret Firebase email/password is used.
const LOVER_EMAIL    = import.meta.env.VITE_LOVER_EMAIL    || 'lover@secretdiary.app';
const LOVER_PASSWORD = import.meta.env.VITE_LOVER_PASSWORD || 'loverpassword123';
const CALLSIGN       = import.meta.env.VITE_CALLSIGN       || 'babuu';
const ADMIN_EMAIL    = import.meta.env.VITE_ADMIN_EMAIL    || 'admin@secretdiary.app';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'adminpassword123';

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [isAdmin,     setIsAdmin]     = useState(false);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u?.email === ADMIN_EMAIL);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Lover login — checks callsign then signs in with shared Firebase account
  async function loverLogin(callsign) {
    if (callsign.trim().toLowerCase() !== CALLSIGN.toLowerCase()) {
      throw new Error("That's not our special word. 💔");
    }
    await signInWithEmailAndPassword(auth, LOVER_EMAIL, LOVER_PASSWORD);
  }

  // Admin login — full email + password
  async function adminLogin(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (cred.user.email !== ADMIN_EMAIL) {
      await signOut(auth);
      throw new Error('Not authorized as admin.');
    }
  }

  async function logout() {
    await signOut(auth);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loverLogin, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
