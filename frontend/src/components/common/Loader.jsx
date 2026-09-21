import React from 'react';

const Loader = ({ message = 'Loading dishes...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          border: '3.5px solid #FED7AA',
          borderTopColor: '#E65100',
          borderRadius: '50%',
          animation: 'spinLoader 0.8s linear infinite',
          marginBottom: '1rem',
        }}
      />
      <style>{`@keyframes spinLoader { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#64748B', fontWeight: 500, fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
};

export default Loader;
