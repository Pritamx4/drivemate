import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Users, Fuel, Zap, Bluetooth, MapPin, Camera, Thermometer, Wind, Calendar } from 'lucide-react';
import { useCars, formatINR } from '../context/CarContext';
import './CarDetail.css';

const EXTRA_FEATURES = [
  { icon: <Bluetooth size={18} />, label: 'Bluetooth' },
  { icon: <MapPin size={18} />, label: 'GPS Navigation' },
  { icon: <Camera size={18} />, label: 'Parking Camera' },
  { icon: <Thermometer size={18} />, label: 'Heated Seats' },
  { icon: <Wind size={18} />, label: 'Climate Control' },
  { icon: <Zap size={18} />, label: 'Fast Charge' },
];

const REVIEWS = [
  { name: 'Arjun Sharma', rating: 5, date: 'Feb 2024', text: 'Amazing rental experience! The car was in perfect condition and the pick-up process was super smooth. Will use Drive Mate again!' },
  { name: 'Priya Mehta', rating: 5, date: 'Jan 2024', text: 'Booked the Porsche Cayenne for a weekend trip to Goa. Incredible car, zero issues, and the return process was effortless.' },
  { name: 'Rohan Kapoor', rating: 4, date: 'Dec 2023', text: 'Great selection of premium rental cars. Competitive pricing and very helpful support team. Highly recommend!' },
];

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars } = useCars();
  const car = cars.find(c => (c._id && String(c._id) === id) || (c.id && String(c.id) === id));
  const [pickup, setPickup] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const days = pickup && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickup)) / 86400000))
    : 1;

  const totalAmount = car.pricePerDay * days;

  if (!car) return <div style={{ padding: '120px 24px', textAlign: 'center' }}>Car not found.</div>;

  return (
    <main className="detail-page">
      <div className="container">
        <div className="breadcrumb">
          <button onClick={() => navigate('/')}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/cars')}>Rent a Car</button>
          <span>/</span>
          <span className="bc-current">{car.name}</span>
        </div>

        {car.isAvailable === false && (
          <div className="unavail-banner">
            ⚠️ This car is currently unavailable for rental. Please check back later or browse other cars.
          </div>
        )}

        <div className="detail-layout">
          {/* Left */}
          <div className="detail-left">
            <div className="detail-car-showcase card">
              <span className="badge detail-cat">{car.category}</span>
              <img src={car.image} alt={`Rent ${car.name}`} className="detail-car-real-img" />
            </div>

            <div className="card detail-desc">
              <h3>About This Rental</h3>
              <p>{car.desc}</p>
              <div className="rental-meta">
                <span>📅 Min. age: {car.minAge}+</span>
                <span>🛣️ {car.mileageLimit}</span>
                <span>🔄 Free cancellation 24h before</span>
              </div>
            </div>

            <div className="card detail-features-card">
              <h3>Included Features</h3>
              <div className="features-list">
                {EXTRA_FEATURES.map(f => (
                  <div key={f.label} className="feature-item">
                    <span className="feat-icon">{f.icon}</span>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="detail-right">
            <div className="card detail-info-card">
              <div className="detail-header">
                <div>
                  <h1 className="detail-car-name">{car.name}</h1>
                  <div className="detail-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.floor(car.rating) ? '#f5a623' : 'transparent'} color="#f5a623" />
                    ))}
                    <span>{car.rating}</span>
                    <span className="review-count">({car.reviews} reviews)</span>
                  </div>
                </div>
                <div className="detail-price-tag">
                  <span className="dp-price">{formatINR(car.pricePerDay)}</span>
                  <span className="dp-per">/day</span>
                </div>
              </div>

              <div className="specs-grid">
                {[
                  { icon: <Users size={20} />, label: 'Seats', val: car.seats },
                  { icon: <Zap size={20} />, label: 'Trans.', val: car.transmission },
                  { icon: <Fuel size={20} />, label: 'Fuel', val: car.fuel },
                  { icon: <MapPin size={20} />, label: 'Mileage', val: car.mileageLimit },
                ].map(s => (
                  <div key={s.label} className="spec-box">
                    <div className="spec-icon">{s.icon}</div>
                    <div>
                      <div className="spec-label">{s.label}</div>
                      <div className="spec-val">{s.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="date-pickers">
                <div className="date-field">
                  <label><Calendar size={15} /> Pickup Date</label>
                  <input type="date" value={pickup} onChange={e => setPickup(e.target.value)} />
                </div>
                <div className="date-field">
                  <label><Calendar size={15} /> Return Date</label>
                  <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                </div>
              </div>

              <div className="price-summary">
                <div className="ps-row">
                  <span>{formatINR(car.pricePerDay)}/day × {days} day{days > 1 ? 's' : ''}</span>
                  <span>{formatINR(totalAmount)}</span>
                </div>
                <div className="ps-row total"><span>Total</span><span>{formatINR(totalAmount)}</span></div>
              </div>

              <button className="btn-primary book-car-btn" disabled={car.isAvailable === false}
                onClick={() => car.isAvailable !== false && navigate(`/booking/${car._id || car.id}`)}>
                {car.isAvailable !== false ? '🚀 Book This Rental' : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </div>

        <section className="reviews-section">
          <h2>Customer <span className="gradient-text">Reviews</span></h2>
          <div className="reviews-grid">
            {REVIEWS.map(r => (
              <div key={r.name} className="review-card card">
                <div className="rv-header">
                  <div className="rv-avatar">{r.name[0]}</div>
                  <div>
                    <div className="rv-name">{r.name}</div>
                    <div className="rv-date">{r.date}</div>
                  </div>
                  <div className="rv-rating">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={13} fill="#f5a623" color="#f5a623" />)}
                  </div>
                </div>
                <p className="rv-text">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
