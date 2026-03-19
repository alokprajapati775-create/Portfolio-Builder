import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import BuilderView from './components/BuilderView';

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

  // Auto-save to localStorage
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
    if (hasDraft) {
      setShowDraftBanner(true);
    }
    setStarted(true);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = () => {
    // Mock login
    setIsLoggedIn(true);
    setUserName('Guest User');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  if (!started) {
    return (
      <>
        <AuthHeader isLoggedIn={isLoggedIn} userName={userName} onLogin={handleLogin} onLogout={handleLogout} />
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
      <AuthHeader isLoggedIn={isLoggedIn} userName={userName} onLogin={handleLogin} onLogout={handleLogout} />
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

function AuthHeader({ isLoggedIn, userName, onLogin, onLogout }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      background: 'rgba(10, 10, 26, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#7c3aed' }}>P</span>
        <span style={{ letterSpacing: '0.5px' }}>PortfolioCraft</span>
      </div>
      <div>
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Welcome, <strong style={{ color: '#fff' }}>{userName}</strong></span>
            <button onClick={onLogout} style={{ padding: '6px 14px', borderRadius: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s', }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <button onClick={onLogin} style={{ padding: '6px 14px', borderRadius: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
              Log In
            </button>
            <button onClick={onLogin} style={{ padding: '6px 14px', borderRadius: '6px', background: 'var(--accent-primary)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)' }}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
