import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Search, MessageCircle } from 'lucide-react';
import './Confirmation.css';

const CONFETTI_COLORS = ['#00d4ff', '#0080ff', '#25D366', '#ffffff', '#0052cc'];

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: p.color,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

export default function Confirmation() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="confirmation-page">
      <Confetti />
      <div className="container conf-container">
        <div className={`conf-card card ${show ? 'show' : ''}`} style={{ maxWidth: '500px', padding: '60px 40px', textAlign: 'center' }}>
          
          <div className="check-circle" style={{ 
            margin: '0 auto 30px', 
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            boxShadow: '0 0 40px rgba(37, 211, 102, 0.4)'
          }}>
            <MessageCircle size={48} strokeWidth={2} color="white" />
          </div>

          <h1 className="conf-title" style={{ fontSize: '28px', marginBottom: '16px' }}>
            Request Sent!
          </h1>
          
          <p className="conf-sub" style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            We have forwarded your booking details to the owner via WhatsApp.
          </p>

          <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--card-border)',
            padding: '24px',
            borderRadius: '16px',
            margin: '30px 0',
            textAlign: 'left'
          }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '15px' }}>What happens next?</h3>
            <ul style={{ color: '#d1d1d1', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>The owner will review your dates and requested vehicle.</li>
              <li style={{ marginBottom: '8px' }}>You will receive a reply directly on WhatsApp.</li>
              <li>Wait for their confirmation on pricing and pickup instructions before making any payments.</li>
            </ul>
          </div>

          <div className="conf-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => navigate('/cars')} style={{ flex: 1 }}>
              <Search size={17} />
              Browse More Cars
            </button>
          </div>

          <button className="back-home-link" onClick={() => navigate('/')} style={{ marginTop: '24px', display: 'inline-block' }}>
            ← Back to Homepage
          </button>
        </div>
      </div>
    </main>
  );
}
