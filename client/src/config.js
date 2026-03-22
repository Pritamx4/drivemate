/**
 * Drive Mate – Site Config
 * Session constants are stored here. All sensitive values (credentials, keys)
 * have been securely moved to the backend.
 */

export const SESSION_KEY = 'dm_admin_session';
export const SESSION_EXPIRY_HOURS = 8;

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
