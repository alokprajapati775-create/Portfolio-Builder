import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function FloatingSphere({ position, color, size, speed, distort }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
  });
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[size, 1]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          distort={distort}
          speed={2}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({ position, color, size }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.2;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
      <mesh ref={ref} position={position}>
        <torusGeometry args={[size, size * 0.3, 16, 32]} />
        <meshPhongMaterial color={color} transparent opacity={0.12} wireframe />
      </mesh>
    </Float>
  );
}

function Particles() {
  const ref = useRef();
  const count = 200;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30;
  }
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = state.clock.elapsedTime * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#7c3aed" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} color="#7c3aed" intensity={0.8} />
      <pointLight position={[-10, -10, -5]} color="#06b6d4" intensity={0.5} />

      <FloatingSphere position={[-3, 2, -2]} color="#7c3aed" size={1.2} speed={1.5} distort={0.4} />
      <FloatingSphere position={[3, -1, -3]} color="#06b6d4" size={0.9} speed={1.2} distort={0.3} />
      <FloatingSphere position={[1, 3, -4]} color="#ec4899" size={0.7} speed={1.8} distort={0.5} />
      <FloatingSphere position={[-2, -2, -1]} color="#7c3aed" size={0.5} speed={2} distort={0.3} />

      <FloatingTorus position={[4, 1, -3]} color="#06b6d4" size={0.8} />
      <FloatingTorus position={[-4, -1, -2]} color="#7c3aed" size={0.6} />

      <Particles />
    </>
  );
}

export default function WelcomeScreen({ onStart, hasDraft, onResumeDraft }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-bg">
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ 
            antialias: true, 
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true 
          }}
          onCreated={({ gl }) => {
            const handleContextLost = (event) => {
              event.preventDefault();
              console.warn('WebGL context lost in WelcomeScreen');
            };
            const handleContextRestored = () => {
              console.log('WebGL context restored in WelcomeScreen');
            };
            
            gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
            gl.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

            // Clean up listeners when component unmounts
            return () => {
              gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
              gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
            };
          }}
        >
          <Scene />
        </Canvas>
      </div>

      <motion.div
        className="welcome-content"
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
    </div>
  );
}
