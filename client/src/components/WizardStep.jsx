import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiGithub, FiLinkedin, FiInstagram, FiTwitter, FiGlobe, FiPlus, FiX, FiUpload, FiMonitor, FiSmartphone, FiTablet, FiRefreshCw } from 'react-icons/fi';
import { allThemes } from '../config/themesData';
import { BASE_AVATARS } from '../utils/avatarUtils';
import { QRCodeSVG } from 'qrcode.react';

export default function WizardStep({ step, stepIndex, totalSteps, formData, updateFormData, previewHTML, isGenerating, onRegenerate }) {
  return (
    <div>
      <div className="step-header">
        <div className="step-number">Step {stepIndex + 1} of {totalSteps}</div>
        <h2 className="step-title">{step.title}</h2>
        <p className="step-description">{step.description}</p>
      </div>

      <div className="step-body">
        {step.type === 'name' && <NameStep formData={formData} updateFormData={updateFormData} />}
        {step.type === 'portfolioType' && <PortfolioTypeStep formData={formData} updateFormData={updateFormData} />}
        {step.type === 'themeSelection' && <ThemeSelectionStep formData={formData} updateFormData={updateFormData} />}
        {step.type === 'animationMode' && <AnimationModeStep formData={formData} updateFormData={updateFormData} />}
        {step.type === 'profileImage' && <ProfileImageStep formData={formData} updateFormData={updateFormData} />}
        {step.type === 'projects' && <ProjectsStep formData={formData} updateFormData={updateFormData} />}
        {step.type === 'skills' && <SkillsStep formData={formData} updateFormData={updateFormData} />}
        {step.type === 'socials' && <SocialsStep formData={formData} updateFormData={updateFormData} />}
        {step.type === 'contact' && <ContactStep formData={formData} updateFormData={updateFormData} />}
        {step.type === 'preview' && <PreviewStep html={previewHTML} isGenerating={isGenerating} onRegenerate={onRegenerate} formData={formData} />}
      </div>
    </div>
  );
}

/* ---- Portfolio Preview ---- */
function PreviewStep({ html, isGenerating, onRegenerate, formData }) {
  const iframeRef = useRef(null);
  const [viewMode, setViewMode] = useState('desktop');

  // Force full iframe remount on viewMode change by using key
  const iframeKey = viewMode + '_' + (html ? html.length : 0);

  const getIframeWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  if (isGenerating) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid var(--border-subtle)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Generating your portfolio...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!html) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>Something went wrong. Try regenerating.</p>
        <button className="btn btn-primary" onClick={onRegenerate} style={{ padding: '10px 24px' }}>🔄 Regenerate</button>
      </div>
    );
  }

  return (
    <div>
      {/* Device Toggle & Regenerate */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { mode: 'desktop', icon: <FiMonitor />, label: 'Desktop' },
            { mode: 'tablet', icon: <FiTablet />, label: 'Tablet' },
            { mode: 'mobile', icon: <FiSmartphone />, label: 'Mobile' },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={label}
              style={{
                padding: '8px 14px', borderRadius: '8px', border: '1px solid',
                borderColor: viewMode === mode ? 'var(--accent-primary)' : 'var(--border-subtle)',
                background: viewMode === mode ? 'rgba(124,58,237,0.15)' : 'var(--bg-card)',
                color: viewMode === mode ? 'var(--text-accent)' : 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.2s ease',
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
        <button
          onClick={onRegenerate}
          style={{
            padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 500,
          }}
        >
          <FiRefreshCw size={14} /> Regenerate
        </button>
      </div>

      {/* Iframe Preview */}
      <div style={{
        border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden',
        background: '#050510', display: 'flex', justifyContent: 'center',
        padding: viewMode !== 'desktop' ? '20px' : '0',
      }}>
        <iframe
          key={iframeKey}
          title="Portfolio Preview"
          srcDoc={html}
          sandbox="allow-scripts allow-same-origin"
          style={{
            width: getIframeWidth(), height: '70vh', border: 'none', background: '#0a0a1a',
            borderRadius: viewMode !== 'desktop' ? '12px' : '0',
            boxShadow: viewMode !== 'desktop' ? '0 0 40px rgba(0,0,0,0.5)' : 'none',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Info and QR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
        <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
          ✨ This is exactly what your downloaded portfolio will look like
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ background: '#fff', padding: '6px', borderRadius: '8px' }}>
            <QRCodeSVG value={`https://portfoliocraft.com/@${(formData.name || 'user').replace(/\s+/g,'').toLowerCase()}`} size={48} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Your QR Code</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scan to preview</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Name & Bio ---- */
function NameStep({ formData, updateFormData }) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAIGenerate = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const pType = formData.portfolioType || 'Creative Professional';
      const name = formData.name || 'this professional';
      updateFormData({
        bio: `${pType} passionate about building scalable solutions and digital experiences.`,
        about: `Hello! I'm ${name}, a dedicated ${pType.toLowerCase()} with a track record of delivering high-quality work. I thrive on solving complex problems and collaborating with teams to create digital experiences that make an impact. My approach blends technical expertise with creative problem-solving to drive innovation.`
      });
      setIsGeneratingAI(false);
    }, 1500);
  };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Your Name or Brand</label>
        <input
          className="form-input"
          type="text"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Short Bio / Tagline</label>
        <input
          className="form-input"
          type="text"
          placeholder="e.g. Full Stack Developer & UI Designer"
          value={formData.bio}
          onChange={(e) => updateFormData({ bio: e.target.value })}
        />
      </div>
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>About You</label>
          <button 
            onClick={handleAIGenerate} 
            disabled={isGeneratingAI}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'transform 0.2s', filter: isGeneratingAI ? 'grayscale(1)' : 'none' }}
          >
            {isGeneratingAI ? '⏳ Generating...' : '🤖 Auto-write with AI'}
          </button>
        </div>
        <textarea
          className="form-textarea"
          placeholder="Tell the world about yourself, your passion, and what drives you..."
          value={formData.about}
          onChange={(e) => updateFormData({ about: e.target.value })}
          rows={4}
        />
      </div>
    </>
  );
}

/* ---- Portfolio Type Category ---- */
function PortfolioTypeStep({ formData, updateFormData }) {
  const options = [
    { value: 'developer', icon: '💻', label: 'Developer', desc: 'Software & web dev' },
    { value: 'designer', icon: '🎨', label: 'Designer', desc: 'UI/UX & graphic design' },
    { value: 'freelancer', icon: '🚀', label: 'Freelancer', desc: 'Independent professional' },
    { value: 'business', icon: '💼', label: 'Business', desc: 'Company or startup' },
    { value: 'student', icon: '🎓', label: 'Student', desc: 'Academic portfolio' },
    { value: 'creative', icon: '✨', label: 'Creative', desc: 'Artist or content creator' },
  ];

  const handleCategorySelect = (val) => {
    if (formData.portfolioType !== val) {
      updateFormData({ portfolioType: val, theme: '' });
    }
  };

  return (
    <div className="portfolio-type-container">
      <div className="option-grid">
        {options.map((opt) => (
          <div
            key={opt.value}
            className={`option-card ${formData.portfolioType === opt.value ? 'selected' : ''}`}
            onClick={() => handleCategorySelect(opt.value)}
          >
            <div className="option-card-icon">{opt.icon}</div>
            <div className="option-card-label">{opt.label}</div>
            <div className="option-card-desc">{opt.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Theme Selection ---- */
function ThemeSelectionStep({ formData, updateFormData }) {
  const fontMap = {
    'monospace': '"Fira Code", "Courier New", monospace',
    'serif': '"Playfair Display", "Georgia", serif',
    'sans-serif': '"Inter", "Helvetica Neue", sans-serif'
  };

  const selectedThemes = allThemes;

  const handleSurpriseMe = () => {
    const randomTheme = selectedThemes[Math.floor(Math.random() * selectedThemes.length)];
    const isLight = (randomTheme.colors[0] === '#FFFFFF' || randomTheme.colors[0] === '#F4F4F4' || randomTheme.colors[0].toLowerCase().startsWith('#f'));
    updateFormData({ 
      theme: randomTheme.id,
      customPrimaryColor: null,
      themePalette: {
        bg: randomTheme.colors[0],
        bgSecondary: randomTheme.colors[0],
        accent: randomTheme.colors[1],
        accentAlt: randomTheme.colors[2],
        text: isLight ? '#111111' : '#f0f0f5',
        textSecondary: isLight ? '#444444' : '#9ca3af',
        card: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
        gradient: `linear-gradient(135deg, ${randomTheme.colors[1]}, ${randomTheme.colors[2]})`,
        font: randomTheme.font
      }
    });
  };

  return (
    <div className="portfolio-type-container">
      <div className="theme-panel slide-in-right">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 className="theme-panel-title" style={{ margin: 0, border: 'none', padding: 0 }}>
            Select a theme
          </h3>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={handleSurpriseMe}>
            🎲 Surprise Me
          </button>
        </div>
        
        <div className="category-theme-grid">
          {selectedThemes.map(t => {
            const isSelected = formData.theme === t.id;
            const currentBg = isSelected && formData.themePalette ? formData.themePalette.bg : t.colors[0];
            const currentAccent = isSelected && formData.themePalette ? formData.themePalette.accent : t.colors[1];
            const currentAccentAlt = isSelected && formData.themePalette ? formData.themePalette.accentAlt : t.colors[2];
            
            return (
              <React.Fragment key={t.id}>
                <div 
                  className={`category-theme-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    const isLight = (t.colors[0] === '#FFFFFF' || t.colors[0] === '#F4F4F4' || t.colors[0].toLowerCase().startsWith('#f'));
                    updateFormData({ 
                      theme: t.id,
                      customPrimaryColor: null,
                      themePalette: {
                        bg: t.colors[0],
                        bgSecondary: t.colors[0],
                        accent: t.colors[1],
                        accentAlt: t.colors[2],
                        text: isLight ? '#111111' : '#f0f0f5',
                        textSecondary: isLight ? '#444444' : '#9ca3af',
                        card: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
                        gradient: `linear-gradient(135deg, ${t.colors[1]}, ${t.colors[2]})`,
                        font: t.font
                      }
                    });
                  }}
                >
                  <div 
                    className="theme-thumbnail"
                    style={{ background: currentBg }}
                  >
                    <div className={`layout-skeleton skeleton-${t.skeleton}`}>
                      <div className="skel-top" style={{ background: currentAccent }} />
                      <div className="skel-bot" style={{ background: currentAccentAlt }} />
                    </div>
                  </div>
                  <div className="theme-info" style={{ position: 'relative' }}>
                    <div className="theme-name">{t.name}</div>
                    <div style={{ fontFamily: fontMap[t.font] || fontMap['sans-serif'], fontSize: '0.68rem', color: currentAccent, background: currentBg, padding: '3px 6px', borderRadius: '4px', marginBottom: 6, border: '1px solid rgba(128,128,128,0.15)' }}>
                      Aa — {t.font === 'monospace' ? 'Monospace' : t.font === 'serif' ? 'Serif' : 'Sans Serif'}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                      {t.tags?.map(tag => (
                        <span key={tag} style={{ fontSize: '0.6rem', padding: '2px 5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', color: 'var(--text-secondary)' }}>{tag}</span>
                      ))}
                    </div>

                    <div className="theme-swatches">
                      <span className="swatch" style={{ background: currentBg }} title="Background" />
                      <span className="swatch" style={{ background: currentAccent }} title="Accent" />
                      <span className="swatch" style={{ background: currentAccentAlt }} title="Secondary Accent" />
                    </div>
                  </div>
                </div>

                {/* Inline Color Customizer (Shown right next/under the selected theme) */}
                {isSelected && (
                  <div style={{ gridColumn: '1 / -1', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>🎨 Customize Theme Colors</span>
                      <button onClick={(e) => {
                          e.stopPropagation();
                          const isLight = (t.colors[0] === '#FFFFFF' || t.colors[0] === '#F4F4F4' || t.colors[0].toLowerCase().startsWith('#f'));
                          updateFormData({
                            themePalette: {
                              bg: t.colors[0], bgSecondary: t.colors[0], accent: t.colors[1], accentAlt: t.colors[2], text: isLight ? '#111111' : '#f0f0f5', textSecondary: isLight ? '#444444' : '#9ca3af', card: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', gradient: `linear-gradient(135deg, ${t.colors[1]}, ${t.colors[2]})`, font: t.font
                            }
                          });
                        }} style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                        Reset to default
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                      {/* Background Color */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: formData.themePalette?.bg, border: '1px solid rgba(255,255,255,0.2)' }} />
                        <input type="color" value={formData.themePalette?.bg || t.colors[0]} onChange={(e) => {
                          const val = e.target.value;
                          const hexToLum = (hex) => {
                            const r = parseInt(hex.slice(1,3), 16)/255, g = parseInt(hex.slice(3,5), 16)/255, b = parseInt(hex.slice(5,7), 16)/255;
                            return 0.299*r + 0.587*g + 0.114*b;
                          };
                          const isLight = hexToLum(val) > 0.5;
                          updateFormData({ themePalette: { ...formData.themePalette, bg: val, bgSecondary: val, text: isLight ? '#111111' : '#f0f0f5', textSecondary: isLight ? '#444444' : '#9ca3af', card: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)' } });
                        }} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Background</span>
                      </label>

                      {/* Accent Color */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: formData.themePalette?.accent, border: '1px solid rgba(255,255,255,0.2)' }} />
                        <input type="color" value={formData.themePalette?.accent || t.colors[1]} onChange={(e) => {
                          const val = e.target.value;
                          updateFormData({ themePalette: { ...formData.themePalette, accent: val, gradient: `linear-gradient(135deg, ${val}, ${formData.themePalette?.accentAlt || t.colors[2]})` } });
                        }} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Light Accent</span>
                      </label>

                      {/* Accent Alt Color */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: formData.themePalette?.accentAlt, border: '1px solid rgba(255,255,255,0.2)' }} />
                        <input type="color" value={formData.themePalette?.accentAlt || t.colors[2]} onChange={(e) => {
                          const val = e.target.value;
                          updateFormData({ themePalette: { ...formData.themePalette, accentAlt: val, gradient: `linear-gradient(135deg, ${formData.themePalette?.accent || t.colors[1]}, ${val})` } });
                        }} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Dark Accent</span>
                      </label>
                      
                      {/* Text Color */}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: formData.themePalette?.text, border: '1px solid rgba(255,255,255,0.2)' }} />
                        <input type="color" value={formData.themePalette?.text || '#ffffff'} onChange={(e) => {
                          updateFormData({ themePalette: { ...formData.themePalette, text: e.target.value } });
                        }} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Text Body</span>
                      </label>
                    </div>

                    {/* Typography & Animations */}
                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '12px' }}>🖋️ Typography & Animations</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {/* Font Family */}
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Font Style</span>
                          <select 
                            value={formData.themePalette?.fontFamily || ''}
                            onChange={(e) => updateFormData({ themePalette: { ...formData.themePalette, fontFamily: e.target.value } })}
                            style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                          >
                            <option value="">Theme Default (Auto)</option>
                            <option value="'Inter', sans-serif">Inter (Modern & Clean)</option>
                            <option value="'Space Grotesk', sans-serif">Space Grotesk (Techy)</option>
                            <option value="'Playfair Display', serif">Playfair Display (Elegant)</option>
                            <option value="'Fira Code', monospace">Fira Code (Developer)</option>
                            <option value="'Outfit', sans-serif">Outfit (Geometric)</option>
                          </select>
                        </label>

                        {/* Font Animation */}
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Text Entry Animation</span>
                          <select 
                            value={formData.themePalette?.fontAnimation || 'fade-up'}
                            onChange={(e) => updateFormData({ themePalette: { ...formData.themePalette, fontAnimation: e.target.value } })}
                            style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                          >
                            <option value="fade-up">Fade Up (Classic)</option>
                            <option value="blur-reveal">Blur Reveal (Modern)</option>
                            <option value="slide-right">Slide Right (Dynamic)</option>
                            <option value="zoom-out">Zoom Out (Impactful)</option>
                            <option value="3d-flip">3D Flip (Creative)</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const AMBIENT_BACKGROUNDS = [
  { id: 'aurora-waves', name: 'Aurora Waves', desc: 'Flowing neon wave lines that breathe in and out', icon: '🌊', badge: 'Mobile Friendly' },
  { id: 'morphing-blob', name: 'Morphing Blobs', desc: 'Large organic shapes slowly shift and morph', icon: '🫧', badge: 'Mobile Friendly' },
  { id: 'water-ripple', name: 'Water Ripple', desc: 'Realistic water ripple physics across the screen', icon: '💧' },
  { id: 'bokeh-orbs', name: 'Bokeh Orbs', desc: 'Soft glowing orbs drift with depth-of-field', icon: '✨', badge: 'Mobile Friendly' },
  { id: 'constellation', name: 'Constellation', desc: 'Connected stars form a drifting network', icon: '⭐', badge: 'Mobile Friendly' },
  { id: 'svg-draw', name: 'Self-Drawing Lines', desc: 'Geometric line art draws itself on load', icon: '✏️' },
  { id: 'matrix-rain', name: 'Matrix Rain', desc: 'Cascading characters with neon glow', icon: '🟢', badge: 'Iconic' },
  { id: 'neon-grid', name: 'Neon Grid', desc: 'Retro-futuristic perspective grid with glow', icon: '🔷', badge: 'Synthwave' },
  { id: 'fireflies', name: 'Fireflies', desc: 'Magical floating light particles with warm glow', icon: '🪲', badge: 'Mobile Friendly' },
];

const PHYSICS_BACKGROUNDS = [
  { id: 'webgl-fluid', name: 'WebGL Fluid', desc: 'GPU-powered fluid simulation reacting to cursor', icon: '🌀', badge: 'GPU Intensive — Best on Desktop', flagship: true },
  { id: 'lanyard-card', name: 'Lanyard Card', desc: 'ID badge drops with bouncy balls from a physics rope', icon: '🪪', badge: 'Best on Desktop', flagship: true },
  { id: 'particle-explosion', name: 'Particle Explosion', desc: 'Dense particle field explodes on click', icon: '💥' },
  { id: 'cursor-ripple', name: 'Cursor Ripple', desc: 'Mouse movement creates ripple distortions', icon: '🌊' },
  { id: 'heat-distortion', name: 'Heat Distortion', desc: 'Shimmer and haze intensifies near cursor', icon: '🔥', badge: 'GPU Intensive — Best on Desktop' },
  { id: 'depth-parallax', name: 'Depth Parallax', desc: 'Multi-layer background reacts to cursor position', icon: '🏔️' },
  { id: 'gravity-orbit', name: 'Gravitational Orbit', desc: 'Particles orbit your cursor like a black hole', icon: '🌌', badge: 'Premium' },
];

const NO_ANIMATION_BACKGROUNDS = [
  { id: 'none', name: 'Solid Color', desc: 'Minimal solid theme color', icon: '⬛' },
  { id: 'static-gradient', name: 'Soft Gradient', desc: 'Elegant linear gradient', icon: '🎨' },
  { id: 'static-grid', name: 'Subtle Grid', desc: 'Light technical grid pattern', icon: '🔲' },
  { id: 'static-dots', name: 'Dot Matrix', desc: 'Clean dotted pattern over solid', icon: '⏸️' },
];

function AnimationModeStep({ formData, updateFormData }) {
  const modes = [
    { value: 'ambient', icon: '✨', label: 'Cinematic Ambient', desc: 'Slow, graceful movements. Perfect for a professional feel.', color: '#8B5CF6', tag: 'Polished' },
    { value: 'physics', icon: '🪄', label: 'Interactive Physics', desc: 'Physics-based reactions. Reacts to every mouse move.', color: '#F97316', tag: 'Premium' },
    { value: 'no-animation', icon: '⬛', label: 'Static & Fast', desc: 'No movement. Maximum speed and accessibility.', color: '#737373', tag: 'Fast' },
  ];

  const currentMode = formData.animationMode || 'ambient';
  const backgrounds = currentMode === 'ambient' ? AMBIENT_BACKGROUNDS : currentMode === 'physics' ? PHYSICS_BACKGROUNDS : currentMode === 'no-animation' ? NO_ANIMATION_BACKGROUNDS : [];

  const handleModeSelect = (mode) => {
    const defaults = {
      'ambient': { backgroundVariant: 'aurora-waves', cursorEffect: 'default' },
      'physics': { backgroundVariant: 'webgl-fluid', cursorEffect: 'vortex' },
      'no-animation': { backgroundVariant: 'none', cursorEffect: 'default' },
    };
    updateFormData({ animationMode: mode, ...defaults[mode] });
  };

  return (
    <div className="animation-mode-step">
      {/* Primary Mode Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '30px' }}>
        {modes.map((opt) => (
          <div
            key={opt.value}
            className={`animation-main-card ${currentMode === opt.value ? 'selected' : ''}`}
            onClick={() => handleModeSelect(opt.value)}
            style={{ 
              borderColor: currentMode === opt.value ? opt.color : 'rgba(255,255,255,0.05)',
              background: currentMode === opt.value ? `${opt.color}15` : 'rgba(255,255,255,0.02)',
              boxShadow: currentMode === opt.value ? `0 0 25px ${opt.color}25` : 'none',
              '--card-accent': opt.color
            }}
          >
            <div className="card-tag">{opt.tag}</div>
            <div className="card-icon">{opt.icon}</div>
            <div className="card-label">{opt.label}</div>
            <div className="card-desc">{opt.desc}</div>
          </div>
        ))}
      </div>

      {/* Style / Background Variant Selector */}
      {backgrounds.length > 0 && (
        <div className="variant-section-container slide-up">
          <div className="section-title-bar">
            <h3 className="section-title">
              {currentMode === 'ambient' ? '🎨 Cinematic Styles' : currentMode === 'physics' ? '🎮 Physics Playgrounds' : '🖼️ Pattern Library'}
            </h3>
            <span className="section-subtitle">Click to select your preferred aesthetic</span>
          </div>

          <div className="variant-grid">
            {backgrounds.map(bg => (
              <div
                key={bg.id}
                className={`variant-card ${formData.backgroundVariant === bg.id ? 'selected' : ''}`}
                onClick={() => updateFormData({ backgroundVariant: bg.id })}
              >
                {bg.flagship && <div className="flagship-badge">FLAGSHIP</div>}
                <div className="variant-icon">{bg.icon}</div>
                <div className="variant-content">
                  <div className="variant-name">{bg.name}</div>
                  <div className="variant-desc">{bg.desc}</div>
                </div>
                {bg.badge && (
                  <span className={`perf-badge ${bg.badge.includes('GPU') ? 'high' : 'low'}`}>
                    {bg.badge.includes('GPU') ? 'GPU Core' : 'Lightweight'}
                  </span>
                )}
                {formData.backgroundVariant === bg.id && <div className="selected-glow" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ambient Sound / Audio Experience */}
      <div className="audio-control-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="audio-icon-pulse">{formData.soundEnabled ? '🎵' : '🔇'}</div>
          <div>
            <div className="audio-title">Atmospheric Presence</div>
            <div className="audio-desc">Enable subtle ambient sounds for an immersive browsing experience.</div>
          </div>
        </div>
        <div 
          className={`toggle-switch ${formData.soundEnabled ? 'on' : 'off'}`}
          onClick={() => updateFormData({ soundEnabled: !formData.soundEnabled })}
        >
          <div className="toggle-thumb" />
          <span className="toggle-label">{formData.soundEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>
      
      <style>{`
        .animation-mode-step { padding: 4px; }
        .animation-main-card { 
          position: relative; border: 1px solid; border-radius: 16px; padding: 24px; 
          cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
        }
        .animation-main-card:hover { transform: translateY(-4px); border-color: var(--card-accent); }
        .animation-main-card.selected { border-width: 2px; transform: scale(1.02); }
        .card-tag { position: absolute; top: 12px; right: 12px; font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; background: rgba(0,0,0,0.3); color: var(--card-accent); text-transform: uppercase; letter-spacing: 0.5px; }
        .card-icon { font-size: 2.5rem; margin-bottom: 8px; }
        .card-label { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; }
        .card-desc { font-size: 0.75rem; color: rgba(255,255,255,0.6); line-height: 1.5; text-align: left; }
        
        .section-title-bar { margin-bottom: 16px; border-left: 3px solid var(--accent-primary); padding-left: 12px; }
        .section-title { font-size: 1rem; color: #fff; margin: 0 0 4px; }
        .section-subtitle { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
        
        .variant-grid { display: grid; gridTemplateColumns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
        .variant-card { 
          position: relative; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); 
          border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.25s; overflow: hidden;
          display: flex; align-items: center; gap: 14px;
        }
        .variant-card:hover { background: rgba(255,255,255,0.06); transform: translateX(4px); border-color: rgba(255,255,255,0.2); }
        .variant-card.selected { background: rgba(124,58,237,0.1); border-color: #7c3aed; }
        .variant-icon { font-size: 1.8rem; }
        .variant-name { font-weight: 600; font-size: 0.85rem; color: #fff; margin-bottom: 4px; }
        .variant-desc { font-size: 0.7rem; color: rgba(255,255,255,0.5); line-height: 1.3; }
        
        .flagship-badge { position: absolute; top: 0; right: 0; font-size: 0.5rem; font-weight: 800; background: #f97316; color: #fff; padding: 2px 6px; border-bottom-left-radius: 6px; }
        .perf-badge { position: absolute; bottom: 8px; right: 8px; font-size: 0.55rem; padding: 2px 5px; border-radius: 4px; border: 1px solid; opacity: 0.7; }
        .perf-badge.high { color: #f87171; border-color: rgba(248,113,113,0.3); background: rgba(248,113,113,0.05); }
        .perf-badge.low { color: #4ade80; border-color: rgba(74,222,128,0.3); background: rgba(74,222,128,0.05); }
        
        .cursor-card { 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); 
          border-radius: 10px; padding: 12px; cursor: pointer; display: flex; align-items: center; gap:12px;
        }
        .cursor-card.selected { border-color: #06b6d4; background: rgba(6,182,212,0.1); }
        .cursor-card-icon { font-size: 1.2rem; }
        .cursor-card-name { font-weight: 600; font-size: 0.8rem; margin-bottom: 2px; }
        .cursor-card-desc { font-size: 0.65rem; color: rgba(255,255,255,0.5); }
        
        .audio-control-card { 
          margin-top: 40px; background: linear-gradient(90deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08));
          border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .audio-title { font-weight: 700; font-size: 0.95rem; color: #fff; margin-bottom: 4px; }
        .audio-desc { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
        .audio-icon-pulse { font-size: 1.5rem; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.6; transform: scale(1); } }
        
        .toggle-switch { width: 100px; height: 36px; border-radius: 20px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); position: relative; cursor: pointer; transition: all 0.3s; }
        .toggle-switch.on { background: #7c3aed; }
        .toggle-thumb { position: absolute; top: 4px; left: 4px; width: 28px; height: 28px; background: #fff; border-radius: 50%; transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
        .toggle-switch.on .toggle-thumb { transform: translateX(64px); }
        .toggle-label { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 0.7rem; font-weight: 700; transition: all 0.3s; }
        .toggle-switch.on .toggle-label { transform: translateY(-50%) translateX(-28px); color: #fff; }
        
        .selected-glow { position: absolute; inset: 0; box-shadow: inset 0 0 15px rgba(124,58,237,0.3); pointer-events: none; }
        .slide-up { animation: slideUp 0.5s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

/* ---- Avatar Card with shimmer + error fallback ---- */
function AvatarCard({ avatar, isSelected, onSelect, accentColor }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`avatar-card${isSelected ? ' selected' : ''}`}
      onClick={() => onSelect(avatar)}
      title={avatar.name}
      style={{
        border: isSelected
          ? `2px solid ${accentColor}`
          : '2px solid transparent',
        boxShadow: isSelected
          ? `0 0 16px ${accentColor}55`
          : 'none'
      }}
    >
      {/* Shimmer skeleton while loading */}
      {!loaded && !error && <div className="avatar-shimmer" />}

      {/* Static anime avatar */}
      {!error && (
        <img
          src={avatar.src}
          alt={avatar.name}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            display: loaded ? 'block' : 'none',
            width: 72,
            height: 72,
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      )}

      {/* Fallback if image fails */}
      {error && (
        <div className="avatar-error-fallback">
          <span className="avatar-initials">{avatar.name ? avatar.name[0].toUpperCase() : '?'}</span>
          <span className="avatar-error-text">Retry later</span>
        </div>
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <div className="selected-badge" style={{ background: accentColor }}>
          ✓
        </div>
      )}

      <span className="avatar-name">{avatar.name}</span>
    </div>
  );
}


function ProfileImageStep({ formData, updateFormData }) {
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  // ── Avatar Customization State ──
  const [gender, setGender] = useState('male');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const accentColor = formData.themePalette?.accent || '#7C3AED';

  // When user selects an avatar from the grid
  function handleAvatarSelect(avatar) {
    setSelectedAvatar(avatar);
    updateFormData({ profileImage: null, profileImageUrl: avatar.src });
  }

  // Switch gender — reset selection
  function handleGenderSwitch(newGender) {
    setGender(newGender);
    setSelectedAvatar(null);
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        updateFormData({ profileImage: file, profileImageUrl: data.url });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  }, [updateFormData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const removeImage = () => {
    updateFormData({ profileImage: null, profileImageUrl: '' });
    setSelectedAvatar(null);
    setShowCustomizer(false);
    setPreviewUrl(null);
    setCustomization(DEFAULT_CUSTOMIZATION);
  };

  const isDiceBearUrl = (url) => url && url.startsWith(DICEBEAR_BASE);
  const isUploadedUrl  = (url) => url && url.startsWith('/api/uploads/');

  return (
    <>
      {/* Tab toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('upload')}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: activeTab === 'upload' ? 'var(--accent-primary)' : 'var(--bg-card)', color: activeTab === 'upload' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', flex: 1, fontWeight: 500 }}
        >
          📷 Upload Image
        </button>
        <button
          onClick={() => setActiveTab('avatars')}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: activeTab === 'avatars' ? 'var(--accent-primary)' : 'var(--bg-card)', color: activeTab === 'avatars' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', flex: 1, fontWeight: 500 }}
        >
          🧑‍🎨 Choose Avatar
        </button>
      </div>

      {/* Upload tab */}
      {activeTab === 'upload' && (
        <>
          {!formData.profileImageUrl || isDiceBearUrl(formData.profileImageUrl) ? (
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              <div className="dropzone-icon"><FiUpload /></div>
              {uploading ? (
                <p className="dropzone-text">Uploading...</p>
              ) : isDragActive ? (
                <p className="dropzone-text">Drop your image here!</p>
              ) : (
                <p className="dropzone-text">
                  Drag &amp; drop your photo here, or <strong>click to browse</strong>
                  <br />
                  <small style={{ color: 'var(--text-tertiary)' }}>JPG, PNG, GIF, WebP — max 10MB</small>
                </p>
              )}
            </div>
          ) : (
            <div className="uploaded-preview">
              <img src={formData.profileImageUrl} alt="Profile" />
              <div className="uploaded-preview-info">
                <div className="uploaded-preview-name">{formData.profileImage ? formData.profileImage.name : 'Uploaded Image'}</div>
                {formData.profileImage && (
                  <div className="uploaded-preview-size">{(formData.profileImage.size / 1024).toFixed(1)} KB</div>
                )}
              </div>
              <button className="remove-upload" onClick={removeImage}>Remove</button>
            </div>
          )}
        </>
      )}

      {/* Avatar tab */}
      {activeTab === 'avatars' && (
        <div className="avatar-selector">

          {/* ── Gender Toggle ── */}
          <div className="gender-toggle">
            <button
              className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
              onClick={() => handleGenderSwitch('male')}
            >
              👨 Male
            </button>
            <button
              className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
              onClick={() => handleGenderSwitch('female')}
            >
              👩 Female
            </button>
          </div>

          {/* ── Avatar Grid — 5 per gender ── */}
          <div className="avatar-grid">
            {BASE_AVATARS[gender].map((avatar) => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                isSelected={selectedAvatar?.id === avatar.id}
                onSelect={handleAvatarSelect}
                accentColor={accentColor}
              />
            ))}
          </div>

          {formData.profileImageUrl?.startsWith('/avatars/') && (
            <button
              className="remove-upload"
              style={{ marginTop: '14px', width: '100%' }}
              onClick={removeImage}
            >
              Clear Selection
            </button>
          )}
        </div>
      )}

      <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
        💡 Tip: A professional headshot or avatar works best. It'll appear in the hero section.
      </p>
    </>
  );
}

/* ---- Projects ---- */
function ProjectsStep({ formData, updateFormData }) {
  const addProject = () => {
    updateFormData({
      projects: [...formData.projects, { title: '', description: '', link: '' }],
    });
  };

  const removeProject = (index) => {
    const updated = formData.projects.filter((_, i) => i !== index);
    updateFormData({ projects: updated.length ? updated : [{ title: '', description: '', link: '' }] });
  };

  const updateProject = (index, field, value) => {
    const updated = formData.projects.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    updateFormData({ projects: updated });
  };

  return (
    <>
      {formData.projects.map((project, i) => (
        <div key={i} className="project-input-card">
          <div className="project-input-header">
            <span className="project-input-number">Project #{i + 1}</span>
            {formData.projects.length > 1 && (
              <button className="project-remove-btn" onClick={() => removeProject(i)}>
                <FiX />
              </button>
            )}
          </div>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Project title"
              value={project.title}
              onChange={(e) => updateProject(i, 'title', e.target.value)}
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Brief description of this project..."
              value={project.description}
              onChange={(e) => updateProject(i, 'description', e.target.value)}
              style={{ minHeight: 70 }}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="https://project-link.com"
              value={project.link}
              onChange={(e) => updateProject(i, 'link', e.target.value)}
            />
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={addProject}>
        <FiPlus /> Add Another Project
      </button>
    </>
  );
}

/* ---- Skills ---- */
function SkillsStep({ formData, updateFormData }) {
  const [inputVal, setInputVal] = useState('');

  const addSkill = () => {
    const skill = inputVal.trim();
    if (skill && !formData.skills.includes(skill)) {
      updateFormData({ skills: [...formData.skills, skill] });
      setInputVal('');
    }
  };

  const removeSkill = (index) => {
    updateFormData({ skills: formData.skills.filter((_, i) => i !== index) });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'TypeScript',
    'HTML/CSS', 'Next.js', 'MongoDB', 'PostgreSQL', 'Docker',
    'Figma', 'AWS', 'Git', 'GraphQL', 'Tailwind CSS',
    'Vue.js', 'Flutter', 'Java', 'C++', 'UI/UX Design',
  ].filter(s => !formData.skills.includes(s));

  return (
    <>
      <div className="form-group">
        <label className="form-label">Add a skill</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="form-input"
            placeholder="e.g. React, Python, Figma..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-primary"
            onClick={addSkill}
            style={{ padding: '12px 20px', flexShrink: 0 }}
          >
            <FiPlus />
          </button>
        </div>
      </div>

      {formData.skills.length > 0 && (
        <div className="tags-container">
          {formData.skills.map((skill, i) => (
            <span key={i} className="tag">
              {skill}
              <button className="tag-remove" onClick={() => removeSkill(i)}>×</button>
            </span>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <label className="form-label" style={{ marginBottom: 10 }}>💡 Quick Add</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {suggestions.slice(0, 12).map((s) => (
              <button
                key={s}
                onClick={() => updateFormData({ skills: [...formData.skills, s] })}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ---- Social Links ---- */
function SocialsStep({ formData, updateFormData }) {
  const socials = [
    { key: 'github', icon: <FiGithub />, label: 'GitHub', placeholder: 'https://github.com/username' },
    { key: 'linkedin', icon: <FiLinkedin />, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { key: 'instagram', icon: <FiInstagram />, label: 'Instagram', placeholder: 'https://instagram.com/username' },
    { key: 'twitter', icon: <FiTwitter />, label: 'Twitter / X', placeholder: 'https://x.com/username' },
    { key: 'website', icon: <FiGlobe />, label: 'Website', placeholder: 'https://yourwebsite.com' },
  ];

  const updateSocial = (key, value) => {
    updateFormData({ socials: { ...formData.socials, [key]: value } });
  };

  return (
    <>
      {socials.map((s) => (
        <div key={s.key} className="social-input-row">
          <div className="social-icon">{s.icon}</div>
          <input
            className="form-input"
            placeholder={s.placeholder}
            value={formData.socials[s.key] || ''}
            onChange={(e) => updateSocial(s.key, e.target.value)}
          />
        </div>
      ))}

      <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
        💡 Only filled links will appear on your portfolio. Leave blank to skip.
      </p>
    </>
  );
}

/* ---- Contact Info ---- */
function ContactStep({ formData, updateFormData }) {
  const updateContact = (key, value) => {
    updateFormData({ contact: { ...formData.contact, [key]: value } });
  };

  return (
    <>
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
          className="form-input"
          type="email"
          placeholder="you@example.com"
          value={formData.contact.email}
          onChange={(e) => updateContact('email', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Phone Number (optional)</label>
        <input
          className="form-input"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.contact.phone}
          onChange={(e) => updateContact('phone', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Location (optional)</label>
        <input
          className="form-input"
          placeholder="San Francisco, CA"
          value={formData.contact.location}
          onChange={(e) => updateContact('location', e.target.value)}
        />
      </div>


    </>
  );
}
