// WelcomeScreen.jsx — CSS-only, zero WebGL footprint
// Replaced Three.js canvas with pure CSS animations to prevent WebGL context exhaustion
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function WelcomeScreen({ onStart, hasDraft, onResumeDraft }) {
  const canvasRef = useRef(null);

  // Lightweight canvas particle effect — uses 2D context, NOT WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create lightweight particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const ACCENT = '#7c3aed';
    const ACCENT2 = '#06b6d4';

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      particles.forEach((a, i) => {
        particles.forEach((b, j) => {
          if (i >= j) return;
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? ACCENT2 : ACCENT;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="welcome-screen">
      {/* CSS-only background layers */}
      <div className="welcome-bg-gradient" />
      <div className="welcome-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Particle canvas — 2D only */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 1,
        }}
      />

      {/* Content */}
      <motion.div
        className="welcome-content"
        style={{ position: 'relative', zIndex: 2 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.span
          className="welcome-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          ✨ AI-Powered Builder
        </motion.span>

        <motion.h1
          className="welcome-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          PortfolioCraft
        </motion.h1>

        <motion.p
          className="welcome-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Build a stunning animated portfolio website in minutes.
          Our intelligent builder guides you step-by-step to create
          something truly impressive.
        </motion.p>

        <motion.div
          style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="welcome-btn"
            onClick={onStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {hasDraft ? 'Start Fresh →' : 'Start Building →'}
          </motion.button>
          {hasDraft && (
            <motion.button
              style={{
                padding: '16px 36px', borderRadius: '9999px',
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(124,58,237,0.4)', color: '#a78bfa',
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.25s',
              }}
              onClick={onResumeDraft}
              whileHover={{ scale: 1.05, borderColor: '#7c3aed' }}
              whileTap={{ scale: 0.98 }}
            >
              📂 Resume Draft
            </motion.button>
          )}
        </motion.div>

        <motion.div
          className="welcome-features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div className="welcome-feature">
            <span className="welcome-feature-icon">🎨</span> Custom Themes
          </div>
          <div className="welcome-feature">
            <span className="welcome-feature-icon">🧊</span> 3D Animations
          </div>
          <div className="welcome-feature">
            <span className="welcome-feature-icon">📱</span> Fully Responsive
          </div>
          <div className="welcome-feature">
            <span className="welcome-feature-icon">⚡</span> Export & Deploy
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .welcome-screen {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0a0a1a;
        }
        .welcome-bg-gradient {
          position: absolute; inset: 0; z-index: 0;
          background: 
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(6,182,212,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 70% 80%, rgba(236,72,153,0.08) 0%, transparent 60%);
        }
        .welcome-bg-orbs { position: absolute; inset: 0; z-index: 0; }
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.2;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: #7c3aed;
          top: -100px; left: -100px;
          animation: drift 20s ease-in-out infinite alternate;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: #06b6d4;
          bottom: -100px; right: -100px;
          animation: drift 25s ease-in-out infinite alternate-reverse;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: #ec4899;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse-orb 8s ease-in-out infinite alternate;
        }
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 40px); }
        }
        @keyframes pulse-orb {
          0% { opacity: 0.05; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0.15; transform: translate(-50%, -50%) scale(1.3); }
        }
      `}</style>
    </div>
  );
}
