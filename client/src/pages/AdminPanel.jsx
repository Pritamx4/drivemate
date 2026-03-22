import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, Trash2, Eye, EyeOff, LogOut, LayoutDashboard, Star, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { useCars, formatINR } from '../context/CarContext';
import { adminLogout } from '../components/PrivateRoute';
import './AdminPanel.css';

const CATEGORIES = ['Sedan', 'SUV', 'Hatchback', 'Sports', 'Electric', 'Luxury'];
const TRANSMISSIONS = ['Auto', 'Manual'];
const FUELS = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

const EMPTY_FORM = {
  name: '', category: 'SUV', pricePerDay: '', seats: '', fuel: 'Petrol',
  transmission: 'Auto', image: '/cars/scorpio_n.png',
  desc: '', tags: '', mileageLimit: '300 km/day', minAge: 21,
};

export default function AdminPanel() {
  const { cars, loading, addCar, removeCar, toggleAvailability } = useCars();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState('all'); // all, available, unavailable, bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dm_admin_token')}`
        }
      });
      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dm_admin_token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setForm({ ...form, image: data.url });
        setUploading(false);
      } else {
        alert(data.message || 'Upload failed');
        setUploading(false);
      }
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert('Upload failed');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dm_admin_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
        showSuccess(`✅ Booking marked as ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    const newCar = {
      ...form,
      pricePerDay: parseInt(form.pricePerDay),
      seats: parseInt(form.seats),
      minAge: parseInt(form.minAge),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    await addCar(newCar);
    setForm(EMPTY_FORM);
    setShowAdd(false);
    showSuccess('✅ Car added successfully!');
  };

  const handleRemove = async (id) => {
    await removeCar(id);
    setDeleteConfirm(null);
    showSuccess('🗑️ Car removed from fleet.');
  };

  const filteredCars = cars.filter(c => {
    if (activeTab === 'available') return c.isAvailable;
    if (activeTab === 'unavailable') return !c.isAvailable;
    return true;
  });

  const stats = {
    total: cars.length,
    available: cars.filter(c => c.isAvailable).length,
    unavailable: cars.filter(c => !c.isAvailable).length,
  };

  const bookingStats = {
    pending: bookings.filter(b => b.status === 'Pending' || !b.status).length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="as-logo">
          <Car size={22} />
          <span>Drive<span className="accent">Mate</span></span>
        </div>
        <nav className="as-nav">
          <button className={`as-nav-item ${activeTab !== 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('all')}><LayoutDashboard size={18} /> Dashboard</button>
          <button className={`as-nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => { setActiveTab('bookings'); fetchBookings(); }}><Star size={18} /> Bookings</button>
          <button className="as-nav-item" onClick={() => navigate('/')}><Car size={18} /> View Site</button>
        </nav>
        <button className="as-logout" onClick={() => { adminLogout(); navigate('/admin-login'); }}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="admin-mobile-nav">
        <button className={`am-nav-item ${activeTab !== 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('all')}><LayoutDashboard size={20} /></button>
        <button className={`am-nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => { setActiveTab('bookings'); fetchBookings(); }}><Star size={20} /></button>
        <button className="am-nav-item" onClick={() => navigate('/')}><Car size={20} /></button>
        <button className="am-nav-item am-logout-btn" onClick={() => { adminLogout(); navigate('/admin-login'); }}>
          <LogOut size={20} />
        </button>
      </div>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>{activeTab === 'bookings' ? 'Booking Logs' : 'Fleet Dashboard'}</h1>
            <p>{activeTab === 'bookings' ? 'Track all customer rental requests' : 'Manage your rental car fleet'}</p>
          </div>
          {activeTab !== 'bookings' && (
            <button className="btn-primary" onClick={() => setShowAdd(true)}>
              <Plus size={18} /> Add New Car
            </button>
          )}
        </div>

        {successMsg && <div className="admin-success">{successMsg}</div>}

        {/* Stats */}
        <div className="admin-stats" style={{ gridTemplateColumns: activeTab === 'bookings' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)' }}>
          {activeTab === 'bookings' ? [
            { label: 'Pending', value: bookingStats.pending, icon: <Star size={22} />, color: 'amber' },
            { label: 'Confirmed', value: bookingStats.confirmed, icon: <ShieldCheck size={22} />, color: 'blue' },
            { label: 'Completed', value: bookingStats.completed, icon: <CheckCircle size={22} />, color: 'green' },
            { label: 'Cancelled', value: bookingStats.cancelled, icon: <XCircle size={22} />, color: 'red' },
          ].map(s => (
            <div key={s.label} className={`stat-card card stat-${s.color}`}>
              <div className="sc-icon">{s.icon}</div>
              <div className="sc-info">
                <div className="sc-value">{s.value}</div>
                <div className="sc-label">{s.label}</div>
              </div>
            </div>
          ))
            : [
              { label: 'Total Cars', value: stats.total, icon: <Car size={22} />, color: 'blue' },
              { label: 'Pending Bookings', value: bookingStats.pending, icon: <Star size={22} />, color: 'amber' },
              { label: 'Unavailable', value: stats.unavailable, icon: <EyeOff size={22} />, color: 'red' },
            ].map(s => (
              <div key={s.label} className={`stat-card card stat-${s.color}`}>
                <div className="sc-icon">{s.icon}</div>
                <div className="sc-info">
                  <div className="sc-value">{s.value}</div>
                  <div className="sc-label">{s.label}</div>
                </div>
              </div>
            ))}
        </div>

        <div className="admin-tabs">
          {activeTab !== 'bookings' ? (
            [['all', 'All Cars'], ['available', 'Available'], ['unavailable', 'Unavailable']].map(([key, label]) => (
              <button key={key} className={`tab-btn ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}>{label} ({key === 'all' ? stats.total : key === 'available' ? stats.available : stats.unavailable})</button>
            ))
          ) : (
            <button className="tab-btn active">All Booking Requests ({bookings.length})</button>
          )}
        </div>


        {/* Conditional Content: Table or Booking Log */}
        {activeTab === 'bookings' ? (
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Car</th>
                  <th>Rental Dates</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td className="car-cell"><div className="car-cell-name">#{b._id.slice(-6).toUpperCase()}</div></td>
                    <td>
                      <div>
                        <div className="car-cell-name">{b.fullName}</div>
                        <div className="car-cell-sub">{b.phone}</div>
                      </div>
                    </td>
                    <td><div className="car-cell-name">{b.carName}</div></td>
                    <td>
                      <div>
                        <div className="car-cell-name">{b.pickupDate}</div>
                        <div className="car-cell-sub">{b.days} days</div>
                      </div>
                    </td>
                    <td className="price-cell">{formatINR(b.totalCost)}</td>
                    <td>
                      <select
                        className={`status-select ${b.status?.toLowerCase() || 'pending'}`}
                        value={b.status || 'Pending'}
                        onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && !bookingsLoading && <div className="table-empty">No booking requests found.</div>}
            {bookingsLoading && <div className="table-empty">Loading bookings...</div>}
          </div>
        ) : (
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Category</th>
                  <th>Price/Day</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map(car => (
                  <tr key={car.id} className={!car.isAvailable ? 'row-unavail' : ''}>
                    <td className="car-cell">
                      <img src={car.image} alt={car.name} className="table-car-img" />
                      <div>
                        <div className="car-cell-name">{car.name}</div>
                        <div className="car-cell-sub">{car.seats} seats · {car.fuel} · {car.transmission}</div>
                      </div>
                    </td>
                    <td><span className="badge">{car.category}</span></td>
                    <td className="price-cell">{formatINR(car.pricePerDay)}</td>
                    <td>
                      <span className="rating-cell">
                        <Star size={13} fill="#f5a623" color="#f5a623" />
                        {car.rating > 0 ? car.rating : 'New'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${car.isAvailable ? 'avail' : 'unavail'}`}>
                        {car.isAvailable ? '● Available' : '● Unavailable'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className={`icon-btn ${car.isAvailable ? 'hide-btn' : 'show-btn'}`}
                        title={car.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                        onClick={() => { toggleAvailability(car.id); showSuccess(`${car.name} marked as ${car.isAvailable ? 'unavailable' : 'available'}.`); }}
                      >
                        {car.isAvailable ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button className="icon-btn delete-btn" title="Remove Car"
                        onClick={() => setDeleteConfirm(car.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCars.length === 0 && !loading && (
              <div className="table-empty">No cars in this category.</div>
            )}
            {loading && <div className="table-empty">Loading fleet...</div>}
          </div>
        )}

      </main>

      {/* Add Car Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal-box card">
            <h2>Add New Rental Car</h2>
            <form onSubmit={handleAddCar} className="add-car-form">
              <div className="modal-grid">
                <div className="modal-field">
                  <label>Car Name *</label>
                  <input placeholder="e.g. Toyota Fortuner" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="modal-field">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Price per Day (₹) *</label>
                  <input type="number" placeholder="e.g. 5000" value={form.pricePerDay}
                    onChange={e => setForm({ ...form, pricePerDay: e.target.value })} required min={500} />
                </div>
                <div className="modal-field">
                  <label>Seats *</label>
                  <input type="number" placeholder="5" value={form.seats}
                    onChange={e => setForm({ ...form, seats: e.target.value })} required min={2} max={9} />
                </div>
                <div className="modal-field">
                  <label>Fuel Type</label>
                  <select value={form.fuel} onChange={e => setForm({ ...form, fuel: e.target.value })}>
                    {FUELS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Transmission</label>
                  <select value={form.transmission} onChange={e => setForm({ ...form, transmission: e.target.value })}>
                    {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Min. Driver Age</label>
                  <input type="number" value={form.minAge}
                    onChange={e => setForm({ ...form, minAge: e.target.value })} min={18} max={30} />
                </div>
                <div className="modal-field">
                  <label>Mileage Limit</label>
                  <input placeholder="300 km/day" value={form.mileageLimit}
                    onChange={e => setForm({ ...form, mileageLimit: e.target.value })} />
                </div>
                <div className="modal-field modal-full">
                  <label>Car Image {uploading && '(Uploading...)'}</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ flex: 1 }}
                    />
                    {form.image && (
                      <div className="image-preview" style={{ height: '60px', width: '80px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img
                          src={form.image.startsWith('http') ? form.image : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${form.image}`}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-field modal-full">
                  <label>Description</label>
                  <textarea placeholder="Brief description of this rental car..." value={form.desc}
                    onChange={e => setForm({ ...form, desc: e.target.value })} rows={3} />
                </div>
                <div className="modal-field modal-full">
                  <label>Features (comma-separated)</label>
                  <input placeholder="GPS, Bluetooth, Sunroof" value={form.tags}
                    onChange={e => setForm({ ...form, tags: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn-primary"><Plus size={16} /> Add Car</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box card confirm-box">
            <div className="confirm-icon"><Trash2 size={32} /></div>
            <h2>Remove This Car?</h2>
            <p>This car will be permanently removed from the rental fleet. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleRemove(deleteConfirm)}>Remove Car</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
