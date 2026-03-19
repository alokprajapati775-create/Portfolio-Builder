import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import BuilderView from './components/BuilderView';
import AuthModal from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { logoutUser } from './services/authService';

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
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, loading } = useAuth();

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
        <AuthHeader user={user} onOpenAuth={() => setShowAuthModal(true)} />
        <WelcomeScreen
          onStart={handleStart}
          hasDraft={hasDraft}
          onResumeDraft={loadDraft}
        />
        {showAuthModal && (
          <AuthModal
            onSuccess={() => setShowAuthModal(false)}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <AuthHeader user={user} onOpenAuth={() => setShowAuthModal(true)} />
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
      {showAuthModal && (
        <AuthModal
          onSuccess={() => setShowAuthModal(false)}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}

/* ─────────────────────────────
   Auth Header
───────────────────────────── */
function AuthHeader({ user, onOpenAuth }) {
  const [imgError, setImgError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    setShowMenu(false);
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          {/* Avatar */}
          <div
            onClick={() => setShowMenu(!showMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: 'background 0.2s' }}
          >
            {user.photoURL && !imgError ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                onError={() => setImgError(true)}
                style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #7c3aed', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#fff', border: '2px solid #7c3aed' }}>
                {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem' }}>
              {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>▾</span>
          </div>

          {/* Dropdown */}
          {showMenu && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              background: '#131320', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '8px 0', minWidth: 180,
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              zIndex: 3000,
            }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{user.displayName || 'User'}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{user.email}</div>
              </div>
              <button onClick={handleLogout} style={{
                width: '100%', padding: '10px 16px', background: 'none', border: 'none',
                color: '#ff6b6b', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,107,107,0.1)'}
              onMouseLeave={e => e.target.style.background = 'none'}
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onOpenAuth}
            style={{
              padding: '7px 16px', borderRadius: '8px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
          >
            Log In
          </button>
          <button
            onClick={onOpenAuth}
            style={{
              padding: '7px 16px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              border: 'none',
              color: '#fff', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600,
              boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Sign Up Free
          </button>
        </div>
      )}
    </div>
  );
}
