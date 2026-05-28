import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Fonction magique pour créer une texture de rond blanc parfait avec des bords doux
const createCircleTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Dessin d'un dégradé radial (du blanc pur au transparent)
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

export default function Bubbles({ mouse }) {
  const count = 300;
  const pointsRef = useRef();

  // 1. Génération de la texture circulaire unique
  const circleTexture = useMemo(() => createCircleTexture(), []);

  // 2. Génération des positions et des dynamiques
  const [positions, dynamics] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const dyn = [];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;     // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;  // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;  // Z

      dyn.push({
        speed: 0.01 + Math.random() * 0.02,
        swaySpeed: 0.5 + Math.random() * 1.5,
        swayAmp: 0.002 + Math.random() * 0.005,
        seed: Math.random() * 100
      });
    }
    return [pos, dyn];
  }, []);

  // 3. Animation à chaque frame
  useFrame(({ clock }) => {
    console.log("Animation en cours..."); // Si ce message ne s'affiche pas, le composant n'est pas rendu
    if (!pointsRef.current) return;

    const time = clock.getElapsedTime();
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      y -= dynamics[i].speed;
      x += Math.sin(time * dynamics[i].swaySpeed + dynamics[i].seed) * dynamics[i].swayAmp;

      const targetMouseX = mouse.current.x * 4;
      const targetMouseY = mouse.current.y * 3;
      
      const dx = x - targetMouseX;
      const dy = y - targetMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 1.0) {
        const force = (1.0 - distance) * 0.05;
        x += (dx / distance) * force;
        y += (dy / distance) * force;
      }

      if (y < -4) {
        y = 4;
        x = (Math.random() - 0.5) * 10;
      }

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}                        // Légèrement agrandi pour bien voir la rondeur
        color="#ffffff"
        map={circleTexture}                // Injecte notre texture ronde !
        transparent={true}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}