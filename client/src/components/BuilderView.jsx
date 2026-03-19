import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WizardStep from './WizardStep';
import { WIZARD_STEPS } from '../config/wizardSteps';

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

  const generatePreview = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setPreviewHTML(data.html);
      }
    } catch (err) {
      console.error('Preview generation failed:', err);
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
    } finally {
      setIsDownloading(false);
    }
  };

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
        <div className="wizard-nav">
          {currentStep > 0 && (
            <button className="btn btn-secondary" onClick={handlePrev}>
              ← Back
            </button>
          )}
          {isPreviewStep ? (
            <button
              className="btn btn-success"
              onClick={handleDownload}
              disabled={isDownloading || isGenerating}
              style={{ flex: 1 }}
            >
              {isDownloading ? '⏳ Packaging...' : '📦 Download Portfolio (.zip)'}
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={(WIZARD_STEPS[currentStep].type === 'portfolioType' && !formData.portfolioType) || (WIZARD_STEPS[currentStep].type === 'themeSelection' && !formData.theme)}
            >
              {currentStep === totalSteps - 2 ? '🎉 Preview Portfolio' : 'Continue →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
