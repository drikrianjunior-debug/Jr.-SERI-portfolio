import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isOpen, setIsOpen }) {
  // Mise à jour des menuItems pour correspondre aux ID de SectionsContainer_6.jsx
  const menuItems = [
    { label: "Principes x Objectifs", id: "principes-objectifs" },
    { label: "Diplômes + Formations", id: "diplomes-formations" },
    { label: "Expérience • Réalisations", id: "experience-realisations" },
    { label: "Contact ♦ Devis", id: "contact-devis" }
  ];

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* BOUTON DECLENCHEUR FIXE */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2.5rem',
          left: '2rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: 500,
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
          padding: '10px',
          pointerEvents: 'auto'
        }}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }} style={{ width: '26px', height: '1.5px', backgroundColor: '#fff' }} />
        <motion.div animate={{ opacity: isOpen ? 0 : 0.4 }} style={{ width: '18px', height: '1.5px', backgroundColor: '#fff' }} />
        <motion.div animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -9 : 0 }} style={{ width: '26px', height: '1.5px', backgroundColor: '#fff' }} />
      </button>

      {/* PANNEAU DE NAVIGATION LATÉRAL */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(3, 2, 8, 0.6)',
                backdropFilter: 'blur(15px)',
                zIndex: 400, pointerEvents: 'auto'
              }}
            />

            <motion.div
  initial={{ x: '-100%' }}
  animate={{ x: 0 }}
  exit={{ x: '-100%' }}
  transition={{ type: 'spring', damping: 28, stiffness: 220 }}
  style={{
    position: 'fixed',
    top: 0, 
    left: 0, 
    // Changement ici : on occupe 100% sur mobile, 400px sur desktop
    width: '100%', 
    maxWidth: '400px', 
    height: '100vh',
    backgroundColor: '#090810',
    borderRight: '1px solid rgba(255, 255, 255, 0.03)',
    // Ajustement dynamique du padding pour mobile
    padding: '7rem 2rem 2rem 2rem', 
    display: 'flex',
    flexDirection: 'column',
    zIndex: 450, 
    pointerEvents: 'auto', 
    boxSizing: 'border-box'
  }}
>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', opacity: 0.3, letterSpacing: '2px' }}>MENU</span>
                
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      // Le lien "Contact • Devis" utilise maintenant la couleur d'accent
                      color: item.id === 'contact-devis' ? '#c5a059' : '#ffffff',
                      fontSize: '1.3rem',
                      fontFamily: '"Syne", sans-serif',
                      textAlign: 'left',
                      cursor: 'pointer',
                      opacity: 0.8,
                      fontWeight: '400'
                    }}
                  >
                    <motion.div whileHover={{ x: 10, opacity: 1 }}>{item.label}</motion.div>
                  </button>
                ))}
              </div>
              
              <div style={{ marginTop: 'auto', fontFamily: 'monospace', fontSize: '0.65rem', opacity: 0.2 }}>
                &copy; {new Date().getFullYear()} Junior SERI. Tous droits réservés.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}