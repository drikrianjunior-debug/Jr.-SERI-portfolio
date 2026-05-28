import React from 'react';

export default function Header() {
  return (
    <header style={{
      position: 'absolute',
      top: '2.5rem', left: '0.45rem', right: '3rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      pointerEvents: 'auto'
    }}>
      <div  className="cinzel-title" style={{ fontSize: '1.4rem', color : 'white', fontWeight: '540', letterSpacing: '-0.5px' }}>
        JR. SERI
      </div>

 
    </header>
  );
}