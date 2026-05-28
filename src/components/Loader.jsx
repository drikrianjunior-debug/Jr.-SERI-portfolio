import React from 'react';

export default function Loader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: ' linear-gradient(180deg, #080a14 0%, #0E1428 100%)', // Noir profond
      color: '#c5a059' // Or
    }}>
      {/* Vous pouvez ajouter votre logo ici si vous le souhaitez */}
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #333',
        borderTop: '5px solid #c5a059',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ marginTop: '1rem', fontFamily: 'sans-serif' }}>Jr. SERI by H&Dev...</p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}