import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';

const API_BASE = API_BASE_URL;

const CarContext = createContext(null);

export function CarProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await fetch(`${API_BASE}/cars`);
      const data = await res.json();
      
      const serverBase = API_BASE.replace('/api', '');
      
      // Normalize _id to id, isAvailable to available, and fix image URLs
      setCars(data.map(c => ({ 
        ...c, 
        id: c._id, 
        available: c.isAvailable,
        image: c.image && c.image.startsWith('/uploads') ? `${serverBase}${c.image}` : c.image
      })));
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('dm_admin_token')}`
  });

  const addCar = async (carData) => {
    try {
      const res = await fetch(`${API_BASE}/cars`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(carData)
      });
      if (res.ok) fetchCars();
    } catch (error) {
      console.error('Failed to add car:', error);
    }
  };

  const removeCar = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/cars/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) fetchCars();
    } catch (error) {
      console.error('Failed to remove car:', error);
    }
  };

  const updateCar = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/cars/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await fetchCars();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update car:', error);
      return false;
    }
  };

  const toggleAvailability = async (id) => {
    const car = cars.find(c => c.id === id);
    if (!car) return false;
    return updateCar(id, { isAvailable: !car.isAvailable });
  };

  return (
    <CarContext.Provider value={{ cars, loading, addCar, removeCar, updateCar, toggleAvailability, refreshCars: fetchCars }}>
      {children}
    </CarContext.Provider>
  );
}


export const useCars = () => useContext(CarContext);

// Helper to format INR
export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

