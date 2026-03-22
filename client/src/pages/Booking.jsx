import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle, Car, CreditCard, Shield, RefreshCw, MessageCircle, Calendar } from 'lucide-react';
import { useCars, formatINR } from '../context/CarContext';
import './Booking.css';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars } = useCars();
  const car = cars.find(c => (c._id && String(c._id) === id) || (c.id && String(c.id) === id)) || cars[0];

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '',
    license: '', pickupDate: '', returnDate: '',
  });

  useEffect(() => {
    // Auto-fill dates from search
    const storedPickup = localStorage.getItem('drivemate_pickup_date');
    const storedReturn = localStorage.getItem('drivemate_return_date');
    if (storedPickup || storedReturn) {
      setForm(prev => ({
        ...prev,
        pickupDate: storedPickup || '',
        returnDate: storedReturn || ''
      }));
    }
  }, []);

  const days = form.pickupDate && form.returnDate
    ? Math.max(1, Math.ceil((new Date(form.returnDate) - new Date(form.pickupDate)) / 86400000))
    : 3;

  const total = car.pricePerDay * days;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookingData = {
      carId: car.id,
      carName: car.name,
      ...form,
      days,
      totalCost: total
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await res.json();

      if (res.ok) {
        // Build the WhatsApp message with all booking details
        const msg = [
          `🚗 *New Car Rental Request — DriveMate*`,
          ``,
          `*Car:* ${car.name} (${car.category})`,
          `*Pickup Date:* ${form.pickupDate}`,
          `*Return Date:* ${form.returnDate}`,
          `*Duration:* ${days} day${days > 1 ? 's' : ''}`,
          `*Total Cost:* ${formatINR(total)}`,
          ``,
          `*Customer Details*`,
          `*Name:* ${form.fullName}`,
          `*Phone:* ${form.phone}`,
          `*Driving Licence:* ${form.license}`,
          ``,
          `_Booking ID: ${data.booking._id}_`,
        ].join('\n');

        // Open WhatsApp with pre-filled message using the number from backend
        const waUrl = `https://wa.me/${data.ownerWhatsApp}?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
        navigate('/confirmation');
      } else {
        alert('Booking failed: ' + (data.message || 'Server error'));
      }
    } catch (err) {
      alert('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <div className="container">
        <h1 className="booking-title">Complete Your <span className="gradient-text">Rental</span></h1>
        <p className="booking-sub">Fill in your details — your request will be sent directly via WhatsApp</p>

        <form className="booking-layout" onSubmit={handleSubmit}>
          {/* Summary Card */}
          <div className="booking-summary card">
            <h3 className="summary-title">Rental Summary</h3>
            <div className="summary-car">
              <img src={car.image} alt={car.name} className="summary-car-img" />
              <div>
                <div className="sc-name">{car.name}</div>
                <div className="sc-dates">{days} day{days > 1 ? 's' : ''} rental</div>
              </div>
            </div>
            <div className="summary-lines">
              <div className="sl-row">
                <span>{formatINR(car.pricePerDay)}/day × {days} day{days > 1 ? 's' : ''}</span>
                <span>{formatINR(total)}</span>
              </div>
              <div className="sl-divider"></div>
              <div className="sl-row sl-total">
                <span>Total</span>
                <span className="sl-total-amount">{formatINR(total)}</span>
              </div>
            </div>

            {/* How it works banner */}
            <div className="wa-info-box">
              <MessageCircle size={20} className="wa-icon" />
              <div>
                <div className="wa-info-title">Booking via WhatsApp</div>
                <div className="wa-info-sub">Submit this form and your booking request will be sent to the owner via WhatsApp. They will confirm availability.</div>
              </div>
            </div>

            <div className="trust-badges">
              {[
                { icon: <RefreshCw size={15} />, label: 'Free Cancellation' },
                { icon: <CheckCircle size={15} />, label: 'Instant WhatsApp Confirm' },
                { icon: <Shield size={15} />, label: 'Safe & Trusted' },
              ].map(b => (
                <div key={b.label} className="trust-badge">
                  <span className="tb-icon">{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="booking-form-area">
            <div className="card form-card">
              <h3 className="form-section-title"><Car size={18} /> Renter Details</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input name="fullName" placeholder="Arjun Sharma" value={form.fullName} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label>Phone Number *</label>
                  <input name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label>Email Address</label>
                  <input name="email" type="email" placeholder="arjun@example.com" value={form.email} onChange={handleChange} />
                </div>
                <div className="form-field full-width">
                  <label>Home Address *</label>
                  <input name="address" placeholder="House No., Street, City, State – PIN" value={form.address} onChange={handleChange} required />
                </div>
                <div className="form-field full-width">
                  <label>Driving Licence Number *</label>
                  <input name="license" placeholder="MH-2020-XXXXXXXXX" value={form.license} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="card form-card">
              <h3 className="form-section-title"><Calendar size={18} /> Rental Dates</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Pickup Date *</label>
                  <input name="pickupDate" type="date" value={form.pickupDate} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-field">
                  <label>Return Date *</label>
                  <input name="returnDate" type="date" value={form.returnDate} onChange={handleChange} required min={form.pickupDate || new Date().toISOString().split('T')[0]} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary pay-btn">
              <MessageCircle size={18} />
              Send Booking Request on WhatsApp
            </button>
            <p className="wa-note">Clicking this will open WhatsApp with your booking details pre-filled. The owner will contact you to confirm.</p>
          </div>
        </form>
      </div>
    </main>
  );
}
