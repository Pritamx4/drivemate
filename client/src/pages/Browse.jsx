import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Fuel, Users, Zap, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCars, formatINR } from '../context/CarContext';
import './Browse.css';

const CATEGORIES = ['All', 'SUV', 'Hatchback'];

export default function Browse() {
  const navigate = useNavigate();
  const { cars } = useCars();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [transmission, setTransmission] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filtered = cars
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || c.category === activeCategory;
      const matchPrice = c.pricePerDay <= maxPrice;
      const matchTrans = transmission === 'All' || c.transmission === transmission;
      const matchAvail = showUnavailable ? true : c.available;
      return matchSearch && matchCat && matchPrice && matchTrans && matchAvail;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'Price: High to Low') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'Rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <main className="browse-page">
      <div className="browse-header">
        <div className="container">
          <h1>Rent a <span className="gradient-text">Premium Car</span></h1>
          <p>{filtered.length} vehicles available for rent</p>
        </div>
      </div>

      <div className="container browse-layout">
        {/* Sidebar */}
        <aside className={`sidebar card ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
          <h3 className="sidebar-title" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
            <span><SlidersHorizontal size={18} /> Filters</span>
            <span className="mobile-only accordion-icon">
              {isMobileFilterOpen ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </h3>

          <div className="filter-content">
            <div className="filter-group">
            <label>Car Type</label>
            <div className="category-pills">
              {CATEGORIES.map(cat => (
                <button key={cat} className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Max Rent: <span className="price-val">{formatINR(maxPrice)}/day</span></label>
            <input type="range" min={2000} max={15000} step={500} value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)} className="price-slider" />
            <div className="price-range-labels"><span>₹2,000</span><span>₹15,000</span></div>
          </div>

          <div className="filter-group">
            <label>Transmission</label>
            <div className="radio-group">
              {['All', 'Auto', 'Manual'].map(t => (
                <label key={t} className="form-check">
                  <input type="radio" name="trans" value={t} checked={transmission === t}
                    onChange={() => setTransmission(t)} />
                  <span className="radio-custom"></span>
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="form-check">
              <input type="checkbox" checked={showUnavailable}
                onChange={e => setShowUnavailable(e.target.checked)} />
              <span className="checkbox-custom"></span>
              <span>Show unavailable</span>
            </label>
          </div>

            <button className="btn-primary w-full"
              onClick={() => { setActiveCategory('All'); setMaxPrice(15000); setTransmission('All'); }}>
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Cars Grid */}
        <div className="cars-area">
          <div className="cars-topbar">
            <div className="search-input-wrap">
              <Search size={17} className="si-icon" />
              <input type="text" placeholder="Search by car name..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating'].map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="no-results">
              <span>🔍</span>
              <h3>No cars found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="cars-grid">
              {filtered.map(car => (
                <div key={car.id} className={`car-card card ${!car.available ? 'unavailable' : ''}`}>
                  <div className="car-image-wrap">
                    <img src={car.image} alt={`Rent ${car.name}`} className="car-grid-img" />
                    <span className="badge car-cat-badge">{car.category}</span>
                    {!car.available && <div className="unavailable-overlay">Currently Unavailable</div>}
                  </div>
                  <div className="car-card-body">
                    <div className="car-card-top">
                      <h3>{car.name}</h3>
                      <span className="car-rating"><Star size={13} fill="#f5a623" color="#f5a623" /> {car.rating} ({car.reviews})</span>
                    </div>
                    <div className="car-specs">
                      <span><Users size={14} /> {car.seats}</span>
                      <span><Fuel size={14} /> {car.fuel}</span>
                      <span><Zap size={14} /> {car.transmission}</span>
                    </div>
                    <div className="car-tags">
                      {(car.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <div className="car-card-footer">
                      <div className="car-price">{formatINR(car.pricePerDay)}<span>/day</span></div>
                      <button className="btn-primary" disabled={!car.available}
                        onClick={() => car.available && navigate(`/cars/${car.id}`)}>
                        Rent <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
