import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Objective = ({ title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '2rem 0',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Titre toujours visible */}
      <motion.h2 
        animate={{ color: isHovered ? 'var(--accent)' : 'var(--text-h)' }}
        style={{ fontFamily: 'var(--heading)', fontSize: '2rem', margin: 0 }}
      >
        {title}
      </motion.h2>

      {/* Texte au survol */}
      <AnimatePresence>
        {isHovered && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ 
              fontFamily: 'var(--mono)', 
              fontSize: '0.8rem', 
              marginTop: '1rem',
              color: 'var(--text)',
              maxWidth: '500px'
            }}
          >
            {description}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};