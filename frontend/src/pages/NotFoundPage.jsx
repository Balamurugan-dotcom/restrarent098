import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Utensils } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="section" style={{ textAlign: 'center', padding: '6rem 1.5rem', background: '#FFFDF9' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#FFF3E0',
            color: '#E65100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Utensils size={40} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: '#64748B', lineHeight: '1.6', marginBottom: '2rem' }}>
          Sorry, we couldn't find the page you're looking for. Maybe you'd like to explore our mouthwatering Bangalore menu instead?
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} /> Home Page
          </Link>
          <Link to="/menu" className="btn btn-outline">
            <Utensils size={18} /> Explore Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
