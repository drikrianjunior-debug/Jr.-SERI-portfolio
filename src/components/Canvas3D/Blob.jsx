import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Vertex Shader corrigé : On utilise un algorithme de bruit 3D plus agressif pour "froisser" la matière
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vNoise;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  // Algorithme de bruit de Perlin 3D pour un effet organique fidèle à la vidéo
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  
  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 sig = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= sig.x; p1 *= sig.y; p2 *= sig.z; p3 *= sig.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Fréquence et intensité du bruit ajustées pour correspondre aux petites vagues de la vidéo
    vec3 noisePos = position * 1.8 + vec3(uTime * 0.6);
    
    // On ajoute l'influence de la souris directement dans la perturbation du bruit
    noisePos.xy += uMouse * 0.4;
    
    float noise = snoise(noisePos) * 0.35;
    vNoise = noise;
    
    // Déformation de la position le long des normales
    vec3 newPosition = position + normal * noise;
    
    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vViewPosition = -modelViewPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewPosition;
  }
`;

// 2. Fragment Shader corrigé : Ajout de l'effet de brillance translucide sur les bords (Fresnel)
const fragmentShader = `
  varying vec2 vUv;
  varying float vNoise;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    // Éclairage de type Fresnel (brillance translucide sur le contour des vagues)
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

    // Couleurs exactes du modèle : Violet d'ambiance et reflets néon magenta/bleu électrique
    vec3 deepPurple = vec3(0.08, 0.02, 0.25);
    vec3 neonNeon = vec3(0.45, 0.1, 1.0);
    vec3 highlightColor = vec3(0.7, 0.3, 1.0); // Éclat lumineux

    // Mixage des couches de couleurs en fonction du relief (bruit) et de l'angle de vue (fresnel)
    vec3 color = mix(deepPurple, neonNeon, vNoise + 0.4);
    color += fresnel * highlightColor * 1.2;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function Blob({ mouse }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
      
      // Amortissement (Lerp) pour que le mouvement soit fluide et élastique quand la souris bouge
      meshRef.current.material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouse.current.x, mouse.current.y),
        0.08
      );
      
      // Légère rotation constante automatique pour donner de la vie au liquide
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

 // Détecter si l'écran est petit pour réduire le rayon du Blob
const isMobile = window.innerWidth < 768;

return (
  <mesh ref={meshRef}>
    {/* Rayon de 0.9 sur mobile au lieu de 1.4 pour qu'il reste parfaitement proportionné derrière le texte */}
    <sphereGeometry args={[isMobile ? 0.9 : 1.4, 128, 128]} />
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
      }}
    />
  </mesh>
);
}