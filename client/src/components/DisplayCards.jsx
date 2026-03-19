// DisplayCards.jsx — 3D Scroll Animation & Front Pop Effect
// Pure React + framer-motion, zero WebGL, zero Tailwind
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

function DisplayCard({
  icon = '✨',
  title = 'Featured',
  description = 'Discover amazing content',
  subtitle = '',
  index = 0,
  isSelected = false,
  isBack = false,
  onClick,
  accentColor = '#7c3aed',
  accentAlt = '#06b6d4',
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!isSelected || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    setTilt({ x: rx, y: ry });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const selectedAnim = {
    x: 0, y: -60, scale: 1.12, rotateX: tilt.x, rotateY: tilt.y, rotateZ: 0,
    zIndex: 50,
    filter: 'grayscale(0%) brightness(1.05)',
  };

  const backAnim = {
    x: index * 28, y: index * 18, scale: 1 - index * 0.04,
    rotateX: 4, rotateY: -2, rotateZ: -6,
    zIndex: 10 - index,
    filter: `grayscale(${index * 35}%) brightness(${1 - index * 0.12})`,
  };

  const defaultAnim = {
    x: index * 28, y: index * 18, rotateZ: -6, scale: 1,
    zIndex: 10 - index, rotateX: 0, rotateY: 0,
    filter: index > 0 ? 'grayscale(80%)' : 'grayscale(0%)',
  };

  const anim = isSelected ? selectedAnim : isBack ? backAnim : defaultAnim;

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={false}
      animate={anim}
      transition={{
        type: 'spring', stiffness: 280, damping: 22, mass: 0.7,
        delay: isSelected ? 0 : index * 0.05,
      }}
      whileHover={!isSelected ? {
        y: (index * 18) - 10,
        filter: 'grayscale(0%)',
        transition: { duration: 0.2 },
      } : {}}
      style={{
        gridArea: '1 / 1',
        position: 'relative',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        width: '340px', height: '160px',
        padding: '20px 24px',
        borderRadius: '16px',
        border: isSelected ? `2px solid ${accentColor}66` : '2px solid rgba(255,255,255,0.08)',
        background: isSelected
          ? 'rgba(124,58,237,0.12)'
          : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        cursor: isSelected ? 'default' : 'pointer',
        userSelect: 'none',
        overflow: 'hidden',
        boxShadow: isSelected
          ? `0 30px 70px ${accentColor}44, 0 0 0 1px ${accentColor}33 inset`
          : '0 4px 20px rgba(0,0,0,0.2)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glossy shine sweep on selection */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, x: -400 }}
          animate={{ opacity: [0, 0.35, 0], x: 400 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transform: 'skewX(-20deg)',
            pointerEvents: 'none', zIndex: 10,
          }}
        />
      )}

      {/* Glow ring */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute', inset: '-3px',
            borderRadius: '18px',
            background: `linear-gradient(135deg, ${accentColor}, ${accentAlt})`,
            zIndex: -1, filter: 'blur(8px)', opacity: 0.5,
          }}
        />
      )}

      {/* Gradient fade on right */}
      <div style={{
        position: 'absolute', right: 0, top: 0, width: '50%', height: '100%',
        background: `linear-gradient(to left, ${isSelected ? 'rgba(124,58,237,0.15)' : 'rgba(6,6,14,0.8)'}, transparent)`,
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Top row — icon + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px', borderRadius: '50%',
          background: `${accentColor}22`, fontSize: '1rem',
        }}>
          {icon}
        </span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: '1.05rem',
          color: isSelected ? '#fff' : accentColor,
        }}>
          {title}
        </span>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '1.15rem', fontWeight: 600,
        color: isSelected ? '#fff' : 'rgba(255,255,255,0.85)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        zIndex: 2,
      }}>
        {description}
      </p>

      {/* Subtitle */}
      <p style={{
        fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', zIndex: 2,
      }}>
        {subtitle}
      </p>

      {/* Selected badge */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', bottom: '-28px', left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.72rem', color: accentColor,
            whiteSpace: 'nowrap', fontWeight: 600,
          }}
        >
          ✦ Selected
        </motion.div>
      )}
    </motion.div>
  );
}

export default function DisplayCards({
  cards = [],
  onSelect,
  selectedValue,
  accentColor = '#7c3aed',
  accentAlt = '#06b6d4',
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync with external selectedValue
  React.useEffect(() => {
    if (selectedValue !== undefined) {
      const idx = cards.findIndex(c => c.id === selectedValue);
      setSelectedIndex(idx >= 0 ? idx : null);
    }
  }, [selectedValue, cards]);

  const handleClick = (index) => {
    if (isAnimating) return;

    if (selectedIndex === index) {
      setIsAnimating(true);
      setSelectedIndex(null);
      setTimeout(() => setIsAnimating(false), 500);
      return;
    }

    setIsAnimating(true);
    setSelectedIndex(index);
    if (onSelect) onSelect(cards[index]);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div style={{ position: 'relative', perspective: '1000px', perspectiveOrigin: 'center' }}>
      {/* Click-outside dismissal */}
      {selectedIndex !== null && (
        <div
          onClick={() => { setSelectedIndex(null); }}
          style={{ position: 'fixed', inset: 0, zIndex: 5 }}
        />
      )}

      {/* Card stack */}
      <div style={{
        display: 'grid', placeItems: 'center',
        transformStyle: 'preserve-3d',
        minHeight: '220px', minWidth: '340px',
        position: 'relative', zIndex: 10,
      }}>
        {cards.map((card, index) => {
          const isSelected = selectedIndex === index;
          let stackIdx = index;
          if (selectedIndex !== null && !isSelected) {
            const remaining = cards.filter((_, i) => i !== selectedIndex);
            stackIdx = remaining.findIndex((_, i) => {
              const origIdx = i >= selectedIndex ? i + 1 : i;
              return origIdx === index;
            });
            if (stackIdx < 0) stackIdx = index;
          }

          return (
            <DisplayCard
              key={card.id || index}
              icon={card.icon}
              title={card.title || card.name}
              description={card.description || card.desc}
              subtitle={card.subtitle || card.badge || ''}
              index={selectedIndex !== null && !isSelected ? stackIdx : index}
              isSelected={isSelected}
              isBack={selectedIndex !== null && !isSelected}
              onClick={() => handleClick(index)}
              accentColor={accentColor}
              accentAlt={accentAlt}
            />
          );
        })}
      </div>

      {/* Hint text */}
      <motion.p
        animate={{ opacity: selectedIndex !== null ? 0.35 : 0.55 }}
        style={{
          textAlign: 'center', fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)', marginTop: '40px',
        }}
      >
        {selectedIndex !== null
          ? 'Click again or outside to deselect'
          : 'Click a card to select'}
      </motion.p>
    </div>
  );
}
