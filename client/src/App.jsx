import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import BuilderView from './components/BuilderView';
import { useAuth } from './hooks/useAuth';

const INITIAL_DATA = {
  name: '',
  bio: '',
  about: '',
  portfolioType: '',
  theme: '',
  customPrimaryColor: null,
  animationMode: 'ambient',
  backgroundVariant: 'aurora-waves',
  cursorEffect: 'default',
  soundEnabled: false,
  profileImage: null,
  profileImageUrl: '',
  projects: [{ title: '', description: '', link: '' }],
  skills: [],
  socials: {
    github: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    website: '',
  },
  contact: {
    email: '',
    phone: '',
    location: '',
  },
};

const DRAFT_KEY = 'portfoliocraft_draft';

export default function App() {
  const [started, setStarted] = useState(false);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [hasDraft, setHasDraft] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftDate, setDraftDate] = useState('');

  const { user, loading, signInWithGoogle, logout } = useAuth();

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data && parsed.savedAt) {
          setHasDraft(true);
          setDraftDate(new Date(parsed.savedAt).toLocaleString());
        }
      }
    } catch (e) { /* ignore */ }
  }, []);

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const saveDraft = (data) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        data,
        savedAt: new Date().toISOString(),
        version: '1.0'
      }));
    } catch (e) { /* ignore */ }
  };

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) {
          setFormData({ ...INITIAL_DATA, ...parsed.data });
          setStarted(true);
          setShowDraftBanner(false);
        }
      }
    } catch (e) { /* ignore */ }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setShowDraftBanner(false);
    setFormData(INITIAL_DATA);
  };

  const handleStart = () => {
    if (hasDraft) setShowDraftBanner(true);
    setStarted(true);
  };

  // Show minimal loader while Firebase resolves auth state
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a1a' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.3)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!started) {
    return (
      <>
        <AuthHeader user={user} onSignIn={signInWithGoogle} onLogout={logout} />
        <WelcomeScreen
          onStart={handleStart}
          hasDraft={hasDraft}
          onResumeDraft={loadDraft}
        />
      </>
    );
  }

  return (
    <>
      <AuthHeader user={user} onSignIn={signInWithGoogle} onLogout={logout} />
      {/* Draft Resume Banner */}
      {showDraftBanner && hasDraft && (
        <div style={{
          position: 'fixed', top: 56, left: 0, right: 0, zIndex: 1000,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(6,182,212,0.95))',
          backdropFilter: 'blur(10px)',
          padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>
            👋 Welcome back! You have a draft saved from {draftDate}
          </span>
          <button onClick={loadDraft} style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: '#fff', color: '#7c3aed', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
            Continue Draft
          </button>
          <button onClick={() => { clearDraft(); setShowDraftBanner(false); }} style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.5)', background: 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>
            Start Fresh
          </button>
          <button onClick={() => setShowDraftBanner(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1.1rem', padding: '2px 6px' }}>✕</button>
        </div>
      )}
      <BuilderView
        formData={formData}
        updateFormData={updateFormData}
        saveDraft={saveDraft}
      />
    </>
  );
}

/* ─────────────────────────────
   Auth Header
───────────────────────────── */
function AuthHeader({ user, onSignIn, onLogout }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '56px',
      background: 'rgba(10, 10, 26, 0.88)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      {/* Brand */}
      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#7c3aed' }}>✦</span>
        <span style={{ letterSpacing: '0.5px' }}>PortfolioCraft</span>
      </div>

      {/* Auth zone */}
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Avatar */}
          {user.photoURL && !imgError ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              onError={() => setImgError(true)}
              style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #7c3aed', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#fff', border: '2px solid #7c3aed' }}>
              {user.displayName ? user.displayName[0].toUpperCase() : '?'}
            </div>
          )}
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem' }}>
            {user.displayName?.split(' ')[0] || 'User'}
          </span>
          <button
            onClick={onLogout}
            style={{ padding: '6px 14px', borderRadius: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s' }}
            onMouseEnter={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.18)'}
          >
            Sign out
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Google Sign-In button */}
          <button
            onClick={onSignIn}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 16px', borderRadius: '8px',
              background: '#fff', border: 'none',
              color: '#3c4043', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600,
              boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.4)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.25)'}
          >
            {/* Google G icon */}
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}
