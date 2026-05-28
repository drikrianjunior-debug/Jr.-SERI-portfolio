import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const createParticleTexture = (type) => {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  if (type === 'rain') {
    ctx.fillStyle = 'white';
    ctx.fillRect(30, 0, 4, 64); // Forme de goutte allongée
  } else {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
};

export default function Rain({ mouse, weather, isNight }) {
  const isRain = weather === 'rain';
  const count = isRain ? 1200 : 300;
  const pointsRef = useRef();
  const texture = useMemo(() => createParticleTexture(isRain ? 'rain' : 'circle'), [isRain]);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      spd[i] = isRain ? 0.2 + Math.random() * 0.3 : 0.02 + Math.random() * 0.02;
    }
    return [pos, spd];
  }, [count, isRain]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const mX = mouse.current.x * 5;
    const mY = mouse.current.y * 5;

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);

      // Mouvement vers le bas
      y -= speeds[i];
      if (y < -5) { y = 5; x = (Math.random() - 0.5) * 20; }

      // Force de répulsion au survol (à modifier pour augmenter l'effet)
      const dx = x - mX;
      const dy = y - mY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.7) { // Rayon d'action
        const force = (1.7 - dist) * 0.4; // Intensité de l'écartement
        x += (dx / dist) * force;
        y += (dy / dist) * force;
      }

      posAttr.setX(i, x);
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={isRain ? 0.1 : 0.5}
        color={isNight ? "#fff" : "#ffffff"}
        map={texture}
        transparent={true}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}