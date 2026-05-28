import React from 'react';

export default function HeroText() {
return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '85%',
      maxWidth: '850px',
      textAlign: 'center',
      pointerEvents: 'none'
    }}>
      {/* Image de présentation */}
      <img 
        src="/im1.jpeg" 
        alt="Junior SERI"
        style={{
          width: '150px',            // Taille adaptée
          height: '150px',           // Taille adaptée
          borderRadius: '50%',       // Format rond pour plus de douceur
          objectFit: 'cover',        // Maintient les proportions du visage
          border: '2px solid #c5a059', // Rappel de votre couleur Or
          marginBottom: '1.5rem',
          boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
          opacity: 0.9
        }}
      />

      <h1 className="cinzel-title">
        Junior SERI,
      </h1>

      <p style={{ 
        fontFamily: '"Inter", sans-serif', 
        fontSize: '0.7rem', 
        opacity: 0.9, 
        letterSpacing: '1px', 
        lineHeight: '1.6'
      }}>
        DEVELOPPEUR <br />
        SITES WEB, APPLICATIONS WEB, APPLICATION MOBILE...
      </p>
    </div>
  );
}