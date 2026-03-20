import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WizardStep from './WizardStep';
import { WIZARD_STEPS } from '../config/wizardSteps';
import { generatePortfolioHTML } from '../utils/portfolioGenerator';
import html2pdf from 'html2pdf.js';

export default function BuilderView({ formData, updateFormData, saveDraft }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [previewHTML, setPreviewHTML] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const totalSteps = WIZARD_STEPS.length;
  const isPreviewStep = WIZARD_STEPS[currentStep]?.type === 'preview';

  // Check for prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && formData.animationMode !== 'no-animation') {
      updateFormData({ animationMode: 'no-animation', backgroundVariant: 'none', cursorEffect: 'default' });
    }
  }, []);

  // Generate preview when entering the preview step
  useEffect(() => {
    if (isPreviewStep) {
      generatePreview();
    }
  }, [currentStep]);

  const generatePreview = () => {
    setIsGenerating(true);
    try {
      // Local generation — no more API calls for preview!
      const html = generatePortfolioHTML(formData);
      setPreviewHTML(html);
    } catch (err) {
      console.error('Preview generation failed:', err);
      // Generate a minimal fallback preview
      setPreviewHTML(`<!DOCTYPE html><html><head><style>
        body { background: #0a0a1a; color: #fff; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 40px; }
        h1 { font-size: 2rem; margin-bottom: 12px; background: linear-gradient(135deg, #7c3aed, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: #888; max-width: 400px; line-height: 1.6; }
      </style></head><body>
        <div>
          <h1>Preview Unavailable</h1>
          <p>Local generation failed. Please try refreshing.</p>
          <p style="margin-top:16px;font-size:0.8rem;color:#555;">Error: ${err.message}</p>
        </div>
      </body></html>`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      // Auto-save draft on step advance
      if (saveDraft) {
        saveDraft({ ...formData, _lastStep: currentStep + 1 });
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 2000);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      // Save draft after download too
      if (saveDraft) saveDraft(formData);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate your portfolio. ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadHTML = async () => {
    setIsDownloading(true);
    try {
      let finalData = { ...formData };
      if (finalData.profileImageUrl && !finalData.profileImageUrl.startsWith('data:')) {
        try {
          const res = await fetch(finalData.profileImageUrl);
          const blob = await res.blob();
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          finalData.profileImageUrl = base64;
        } catch (e) {
          console.error('Failed to convert avatar to base64', e);
        }
      }
      
      const html = generatePortfolioHTML(finalData);
      const fileBlob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(formData.name || 'portfolio').replace(/\s+/g, '_')}_portfolio.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadResume = async () => {
    setIsDownloading(true);
    try {
      const div = document.createElement('div');
      div.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #111;">
          <h1 style="font-size: 32px; margin-bottom: 5px;">${formData.name || 'Resume'}</h1>
          <p style="font-size: 16px; color: #555; margin-bottom: 20px;">${formData.bio || ''}</p>
          ${formData.email ? `<p style="font-size: 14px;"><strong>Email:</strong> ${formData.email}</p>` : ''}
          
          <h2 style="font-size: 20px; border-bottom: 2px solid #ccc; padding-bottom: 5px; margin-top: 30px;">About</h2>
          <p style="font-size: 14px; color: #444; line-height: 1.6;">${formData.about || 'N/A'}</p>
          
          <h2 style="font-size: 20px; border-bottom: 2px solid #ccc; padding-bottom: 5px; margin-top: 30px;">Skills</h2>
          <p style="font-size: 14px; color: #444;">${(formData.skills && formData.skills.length > 0) ? formData.skills.join(', ') : 'None listed'}</p>

          <h2 style="font-size: 20px; border-bottom: 2px solid #ccc; padding-bottom: 5px; margin-top: 30px;">Projects</h2>
          ${(formData.projects && formData.projects.length > 0) ? formData.projects.map(p => `
            <div style="margin-bottom: 15px;">
              <h3 style="font-size: 16px; margin-bottom: 5px;">${p.title}</h3>
              <p style="font-size: 14px; color: #555; margin-bottom: 4px;">${p.description}</p>
              ${p.link ? `<a href="${p.link}" style="font-size: 12px; color: #0066cc;">${p.link}</a>` : ''}
            </div>
          `).join('') : '<p style="font-size:14px;color:#555;">None listed</p>'}
        </div>
      `;
      const opt = {
        margin:       1,
        filename:     `${(formData.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(div).save();
    } catch (err) {
      console.error('Resume download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getValidationMessage = () => {
    const type = WIZARD_STEPS[currentStep]?.type;
    if (type === 'name' && (!formData.name || !formData.name.trim())) return '⚠️ Please enter your name to continue.';
    if (type === 'portfolioType' && !formData.portfolioType) return '⚠️ Please select a category.';
    if (type === 'themeSelection' && !formData.theme) return '⚠️ Please select a theme.';
    if (type === 'projects' && (!formData.projects || formData.projects.length === 0)) return '⚠️ Please add at least one project.';
    return null;
  };
  const valError = getValidationMessage();


  return (
    <div className={`builder-layout ${isPreviewStep ? 'preview-mode' : ''}`}>
      {/* Save Toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              zIndex: 9999, background: 'rgba(5,150,105,0.95)', color: '#fff',
              padding: '10px 20px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
            }}
          >
            ✓ Draft saved
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wizard Panel */}
      <div className={`wizard-panel ${isPreviewStep ? 'wizard-panel-full' : ''}`}>
        {/* Brand Bar */}
        <div className="brand-bar">
          <div className="brand-logo">P</div>
          <span className="brand-name">PortfolioCraft</span>
          <span className="brand-tag">Builder</span>
        </div>

        {/* Step Indicators */}
        <div className="step-indicator">
          {WIZARD_STEPS.map((_, i) => (
            <div
              key={i}
              className={`step-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
              onClick={() => handleStepClick(i)}
              title={WIZARD_STEPS[i].title}
            />
          ))}
        </div>

        {/* Wizard Content */}
        <div className="wizard-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WizardStep
                step={WIZARD_STEPS[currentStep]}
                stepIndex={currentStep}
                totalSteps={totalSteps}
                formData={formData}
                updateFormData={updateFormData}
                previewHTML={previewHTML}
                isGenerating={isGenerating}
                onRegenerate={generatePreview}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="wizard-nav" style={{ flexWrap: 'wrap' }}>
          {currentStep > 0 && (
            <button className="btn btn-secondary" onClick={handlePrev}>
              ← Back
            </button>
          )}
          {valError && !isPreviewStep && (
            <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 500, margin: 'auto' }}>
              {valError}
            </span>
          )}
          {isPreviewStep ? (
            <div style={{ display: 'flex', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={handleDownloadHTML}
                disabled={isDownloading || isGenerating}
                style={{ flex: 1, minWidth: '120px' }}
              >
                {isDownloading ? '⏳...' : '📥 Download Portfolio'}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleDownloadResume}
                disabled={isDownloading || isGenerating}
                style={{ flex: 1, background: '#3b82f6', borderColor: '#2563eb', minWidth: '120px' }}
              >
                {isDownloading ? '⏳...' : '📄 Get CV (.pdf)'}
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={!!valError}
              style={{ marginLeft: valError ? '0' : 'auto' }}
            >
              {currentStep === totalSteps - 2 ? '🎉 Preview Portfolio' : 'Continue →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
