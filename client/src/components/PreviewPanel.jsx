import React, { useRef, useEffect, useState } from 'react';
import { FiMonitor, FiSmartphone, FiTablet, FiMaximize2 } from 'react-icons/fi';

export default function PreviewPanel({ html }) {
  const iframeRef = useRef(null);
  const [viewMode, setViewMode] = useState('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [html]);

  const getIframeStyle = () => {
    const base = {
      border: 'none',
      background: '#0a0a1a',
      transition: 'all 0.4s ease',
      margin: '0 auto',
      display: 'block',
    };

    switch (viewMode) {
      case 'mobile':
        return { ...base, width: '375px', height: '100%', borderRadius: '16px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' };
      case 'tablet':
        return { ...base, width: '768px', height: '100%', borderRadius: '12px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' };
      default:
        return { ...base, width: '100%', height: '100%' };
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const panel = document.querySelector('.preview-panel');
      if (panel?.requestFullscreen) panel.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="preview-panel">
      {/* Toolbar */}
      <div className="preview-toolbar">
        <button
          className={`preview-btn ${viewMode === 'desktop' ? 'active' : ''}`}
          onClick={() => setViewMode('desktop')}
          title="Desktop view"
        >
          <FiMonitor />
        </button>
        <button
          className={`preview-btn ${viewMode === 'tablet' ? 'active' : ''}`}
          onClick={() => setViewMode('tablet')}
          title="Tablet view"
        >
          <FiTablet />
        </button>
        <button
          className={`preview-btn ${viewMode === 'mobile' ? 'active' : ''}`}
          onClick={() => setViewMode('mobile')}
          title="Mobile view"
        >
          <FiSmartphone />
        </button>
        <button
          className="preview-btn"
          onClick={toggleFullscreen}
          title="Fullscreen"
        >
          <FiMaximize2 />
        </button>
      </div>

      {/* Preview */}
      {html ? (
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'stretch',
          justifyContent: 'center',
          padding: viewMode !== 'desktop' ? '20px' : 0,
          background: viewMode !== 'desktop' ? '#050510' : 'transparent',
        }}>
          <iframe
            ref={iframeRef}
            title="Portfolio Preview"
            sandbox="allow-scripts allow-same-origin"
            style={getIframeStyle()}
          />
        </div>
      ) : (
        <div className="preview-placeholder">
          <div className="preview-placeholder-icon">🖼️</div>
          <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Live Preview</p>
          <p style={{ fontSize: '0.9rem', maxWidth: 300, lineHeight: 1.6 }}>
            Start filling in your details and watch your portfolio come to life in real-time!
          </p>
        </div>
      )}
    </div>
  );
}
