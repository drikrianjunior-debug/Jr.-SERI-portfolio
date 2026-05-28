import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';

import Rain from './components/Canvas3D/Rain';           
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HeroText from './components/HeroText';
import SectionsContainer from './components/SectionsContainer';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

import './index.css'; 

export default function App() {
  const mouse = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // États initialisés à null pour laisser l'API déterminer la valeur réelle
  const [weatherCondition, setWeatherCondition] = useState(null); 
  const [themeMode, setThemeMode] = useState('day-clear');

  useEffect(() => {
    async function fetchLocalWeather() {
      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        const locationData = await ipResponse.json();
        const { latitude, longitude } = locationData;

        if (latitude && longitude) {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
          );
          const weatherData = await weatherResponse.json();
          
          const current = weatherData.current_weather || weatherData.current;
          const weatherCode = current ? (current.weathercode ?? current.weather_code) : 0;
          
          const localHour = new Date().getHours();
          const isNight = localHour < 6 || localHour >= 18; 

          let condition = 'clear';
          if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
            condition = 'rain';
          } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
            condition = 'snow';
          }

          setWeatherCondition(condition);
          setThemeMode(isNight ? 'night' : `day-${condition}`);
        }
      } catch (error) {
        console.error("Erreur météo:", error);
        setWeatherCondition('clear');
        setThemeMode('day-clear');
      }
    }

    fetchLocalWeather();
  }, []);

  const handleMouseMove = (e) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  const handleScroll = (e) => {
    setShowBackToTop(e.target.scrollTop > window.innerHeight * 0.5);
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 } // 0.2s entre chaque icône
  }
};

const iconVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className={`app-container ${themeMode}`}
      style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      
{/* SCÈNE GRAPHISME 3D */}
<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1, pointerEvents: 'none' }}>
  <Canvas camera={{ position: [0, 0, 3.5] }}>
    <ambientLight intensity={1.5} />
    
    {/* Rendu dynamique basé sur l'état météo */}
    {weatherCondition === 'rain' && (
      <Rain 
  mouse={mouse} 
  weather={weatherCondition} 
  isNight={themeMode === 'night'} 
/>
    )}
  </Canvas>
</div>

      {/* RESTE DE L'INTERFACE */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 110, pointerEvents: 'none' }}>
        <Header />
        <div className="credits-text" style={{
          position: 'absolute', bottom: '2.5rem', right: '0.35rem',
          textAlign: 'right', fontFamily: ' Inter, sans-serif', fontSize: '0.55rem', opacity: 0, letterSpacing: '0.5px'
        }}>
          <div style={{ color: 'white', position: 'absolute', top: '10px', left: '10px', zIndex: 999 }}>
  {weatherCondition || "En attente..."}
</div>
          <div>{themeMode.toUpperCase()} ({weatherCondition?.toUpperCase() || 'LOADING...'})</div>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />


        <AnimatePresence>
  {showBackToTop && (
    <motion.div
      // L'animation commence à 50px sur la droite et invisible
      initial={{ opacity: 0, x: 50 }} 
      // Elle arrive à sa position d'origine (x:0) et devient opaque
      animate={{ opacity: 1, x: 0 }} 
      // Animation douce
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: 'fixed', bottom: '7rem', right: '2.7rem',
        display: 'flex', flexDirection: 'column', gap: '0.8rem',
        zIndex: 300
      }}
    >
      <a href="https://www.facebook.com/profile.php?id=100006488679303" target="_blank" rel="noreferrer" style={{ color: '#c5a059', fontSize: '1.4rem' }}>
        <FaFacebook />
      </a>
      <a href="https://www.instagram.com/josephseri/" target="_blank" rel="noreferrer" style={{ color: '#c5a059', fontSize: '1.4rem' }}>
        <FaInstagram />
      </a>
      <a href="https://wa.me/2250759128035" target="_blank" rel="noreferrer" style={{ color: '#c5a059', fontSize: '1.4rem' }}>
  <FaWhatsapp />
</a>
    </motion.div>
  )}
</AnimatePresence>



      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="back-to-top-btn"
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem',
              background: 'none', padding: '0.6rem 1rem', borderRadius: '4px',
              cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.65rem',
              zIndex: 300, pointerEvents: 'auto', letterSpacing: '1px'
            }}
            whileHover={{ scale: 1.05 }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="smooth-scroll-container" 
        style={{ position: 'relative', zIndex: 2, width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden', background: 'transparent' }}
      >
        <div style={{ width: '100%', height: '100vh', position: 'relative', background: 'transparent' }}>
          <HeroText />
        </div>
        <div style={{ background: 'transparent' }}>
          <SectionsContainer />
        </div>
      </div>
    </div>
  );
}