// WelcomeScreen.jsx — Premium CSS-3D Edition (no Three.js/WebGL)
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function TiltCard({ children, style = {}, className = '' }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(600px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.04)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: 'transform 0.25s ease', ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

export default function WelcomeScreen({ onStart, hasDraft, onResumeDraft }) {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Starfield canvas — 2D only
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let stars = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 220 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    let mx = canvas.width / 2, my = canvas.height / 2;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.pulse += 0.02;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
        const glow = Math.sin(s.pulse) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${s.alpha * glow})`;
        ctx.fill();
      });
      // Draw connections near mouse
      stars.forEach((a, i) => {
        stars.forEach((b, j) => {
          if (i >= j) return;
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            const dmx = (a.x + b.x) / 2 - mx, dmy = (a.y + b.y) / 2 - my;
            const md = Math.sqrt(dmx * dmx + dmy * dmy);
            if (md < 300) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(124,58,237,${(1 - d / 100) * 0.2 * (1 - md / 300)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  };

  const features = [
    { icon: '🎨', title: 'Custom Themes', desc: '50+ premium palettes' },
    { icon: '🧊', title: '3D Animations', desc: 'WebGL & Physics engines' },
    { icon: '📱', title: 'Fully Responsive', desc: 'Mobile-first design' },
    { icon: '⚡', title: 'Instant Export', desc: 'Download & deploy' },
  ];

  return (
    <div className="welcome-screen" onMouseMove={handleMouseMove}>
      {/* Animated gradient background mesh */}
      <div className="ws-mesh" style={{
        background: `
          radial-gradient(ellipse 80% 80% at ${20 + mousePos.x * 15}% ${30 + mousePos.y * 15}%, rgba(124,58,237,0.2) 0%, transparent 60%),
          radial-gradient(ellipse 70% 60% at ${70 + mousePos.x * 10}% ${20 + mousePos.y * 10}%, rgba(6,182,212,0.15) 0%, transparent 55%),
          radial-gradient(ellipse 50% 70% at ${60 - mousePos.x * 12}% ${70 - mousePos.y * 10}%, rgba(236,72,153,0.12) 0%, transparent 50%)
        `,
        transition: 'background 0.1s linear',
      }} />

      {/* CSS orbs */}
      <div className="ws-orbs">
        <div className="ws-orb ws-orb-1" />
        <div className="ws-orb ws-orb-2" />
        <div className="ws-orb ws-orb-3" />
        <div className="ws-orb ws-orb-4" />
      </div>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="ws-canvas" />

      {/* Main content */}
      <div className="ws-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.div
            className="ws-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <span className="ws-badge-dot" />
            AI-Powered Portfolio Builder
          </motion.div>

          {/* 3D Title */}
          <motion.div
            className="ws-title-wrap"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
          >
            <h1 className="ws-title" style={{
              transform: `perspective(800px) rotateX(${(mousePos.y - 0.5) * -6}deg) rotateY(${(mousePos.x - 0.5) * 6}deg)`,
              transition: 'transform 0.12s ease',
            }}>
              Portfolio<span className="ws-title-accent">Craft</span>
            </h1>
          </motion.div>

          <motion.p
            className="ws-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            Build a <strong>stunning, animated</strong> portfolio in minutes.
            <br />Choose from WebGL, Physics, and Cinematic effects.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="ws-cta-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <TiltCard>
              <motion.button
                className="ws-btn-primary"
                onClick={onStart}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="ws-btn-shimmer" />
                {hasDraft ? 'Start Fresh' : 'Start Building'} <span className="ws-btn-arrow">→</span>
              </motion.button>
            </TiltCard>
            {hasDraft && (
              <motion.button
                className="ws-btn-secondary"
                onClick={onResumeDraft}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                📂 Resume Draft
              </motion.button>
            )}
          </motion.div>

          {/* 3D Feature Cards */}
          <motion.div
            className="ws-features"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, staggerChildren: 0.1 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <TiltCard className="ws-feature-card">
                  <div className="ws-feature-icon">{f.icon}</div>
                  <div className="ws-feature-title">{f.title}</div>
                  <div className="ws-feature-desc">{f.desc}</div>
                  <div className="ws-feature-glow" />
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="ws-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {[['15+', 'Animation Styles'], ['50+', 'Color Themes'], ['100%', 'Free Export']].map(([n, l]) => (
              <div key={l} className="ws-stat">
                <div className="ws-stat-num">{n}</div>
                <div className="ws-stat-label">{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .welcome-screen {
          position: relative; min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; background: #06060e;
        }
        .ws-mesh { position:absolute;inset:0;z-index:0; }
        .ws-orbs { position:absolute;inset:0;z-index:0;overflow:hidden; }
        .ws-orb { position:absolute;border-radius:50%;filter:blur(120px); }
        .ws-orb-1 { width:60vmax;height:60vmax;background:#7c3aed;opacity:0.12;top:-15%;left:-10%;animation:wsOrb1 22s ease-in-out infinite alternate; }
        .ws-orb-2 { width:50vmax;height:50vmax;background:#06b6d4;opacity:0.1;bottom:-15%;right:-10%;animation:wsOrb2 28s ease-in-out infinite alternate-reverse; }
        .ws-orb-3 { width:35vmax;height:35vmax;background:#ec4899;opacity:0.07;top:40%;left:40%;animation:wsOrb3 18s ease-in-out infinite alternate; }
        .ws-orb-4 { width:25vmax;height:25vmax;background:#7c3aed;opacity:0.15;top:20%;right:20%;animation:wsOrb1 14s ease-in-out infinite alternate-reverse; }
        @keyframes wsOrb1 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(5%,8%) scale(1.1)} }
        @keyframes wsOrb2 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(-6%,-5%) scale(1.15)} }
        @keyframes wsOrb3 { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(4%,-6%) scale(0.9)} }
        .ws-canvas { position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none; }
        .ws-content { position:relative;z-index:2;text-align:center;padding:40px 24px;max-width:900px;width:100%; }
        
        .ws-badge { display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border-radius:999px;background:rgba(124,58,237,0.12);border:1px solid rgba(124,58,237,0.3);color:#a78bfa;font-size:0.85rem;font-weight:600;letter-spacing:0.5px;margin-bottom:32px;backdrop-filter:blur(10px); }
        .ws-badge-dot { width:8px;height:8px;border-radius:50%;background:#7c3aed;box-shadow:0 0 10px #7c3aed;animation:wsBadgePulse 2s infinite; }
        @keyframes wsBadgePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        
        .ws-title-wrap { margin-bottom:24px; }
        .ws-title {
          font-family:'Space Grotesk',sans-serif;
          font-size:clamp(4.5rem,12vw,9rem);
          font-weight:700;
          line-height:0.9;
          display:inline-block;
          background:linear-gradient(135deg,#fff 0%,#c4b5fd 40%,#7c3aed 70%,#06b6d4 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          filter:drop-shadow(0 0 40px rgba(124,58,237,0.3));
          will-change:transform;
        }
        .ws-title-accent { -webkit-text-fill-color:transparent; }
        
        .ws-subtitle { font-size:1.25rem;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:48px;max-width:560px;margin-left:auto;margin-right:auto; }
        .ws-subtitle strong { color:rgba(255,255,255,0.9); }
        
        .ws-cta-row { display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:60px; }
        .ws-btn-primary {
          position:relative;overflow:hidden;
          padding:18px 44px;border-radius:14px;border:none;
          background:linear-gradient(135deg,#7c3aed,#5b21b6);
          color:#fff;font-family:'Space Grotesk',sans-serif;font-size:1.1rem;font-weight:700;
          cursor:pointer;letter-spacing:0.3px;
          box-shadow:0 8px 30px rgba(124,58,237,0.4),inset 0 1px 0 rgba(255,255,255,0.15);
          transition:box-shadow 0.3s;
        }
        .ws-btn-primary:hover { box-shadow:0 12px 40px rgba(124,58,237,0.6),inset 0 1px 0 rgba(255,255,255,0.15); }
        .ws-btn-shimmer { position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transform:translateX(-100%);animation:wsShimmer 3s infinite; }
        @keyframes wsShimmer { 0%{transform:translateX(-100%)} 60%{transform:translateX(100%)} 100%{transform:translateX(100%)} }
        .ws-btn-arrow { display:inline-block;transition:transform 0.2s; }
        .ws-btn-primary:hover .ws-btn-arrow { transform:translateX(4px); }
        .ws-btn-secondary { padding:18px 36px;border-radius:14px;background:rgba(255,255,255,0.05);border:1px solid rgba(124,58,237,0.3);color:#a78bfa;font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:600;cursor:pointer;backdrop-filter:blur(10px);transition:all 0.25s; }
        .ws-btn-secondary:hover { background:rgba(124,58,237,0.1);border-color:rgba(124,58,237,0.6); }
        
        .ws-features { display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:50px;max-width:800px;margin-left:auto;margin-right:auto; }
        @media(max-width:700px){.ws-features{grid-template-columns:repeat(2,1fr);}}
        .ws-feature-card {
          position:relative;overflow:hidden;
          padding:24px 18px;border-radius:16px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          backdrop-filter:blur(16px);
          cursor:default;
          transition:border-color 0.3s,background 0.3s,box-shadow 0.3s;
        }
        .ws-feature-card:hover { border-color:rgba(124,58,237,0.4);background:rgba(124,58,237,0.06);box-shadow:0 8px 30px rgba(124,58,237,0.15); }
        .ws-feature-glow { position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(124,58,237,0.15),transparent 70%);opacity:0;transition:opacity 0.3s; }
        .ws-feature-card:hover .ws-feature-glow { opacity:1; }
        .ws-feature-icon { font-size:2rem;margin-bottom:12px;display:block; }
        .ws-feature-title { font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:0.9rem;color:#fff;margin-bottom:4px; }
        .ws-feature-desc { font-size:0.75rem;color:rgba(255,255,255,0.45); }
        
        .ws-stats { display:flex;gap:40px;justify-content:center; }
        .ws-stat-num { font-family:'Space Grotesk',sans-serif;font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#7c3aed,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
        .ws-stat-label { font-size:0.75rem;color:rgba(255,255,255,0.4);margin-top:2px; }
      `}</style>
    </div>
  );
}
