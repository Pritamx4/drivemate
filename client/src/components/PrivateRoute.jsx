export const TOKEN_KEY = 'dm_admin_token';

/**
 * Checks if the admin token exists.
 * In a real app, you could also verify/decode the JWT here.
 */
export function isAdminLoggedIn() {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function adminLogin(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function adminLogout() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Route guard — redirects to /admin-login if not authenticated.
 * Wrap any admin route with this component.
 */
export default function PrivateRoute({ children }) {
  return isAdminLoggedIn() ? children : <Navigate to="/admin-login" replace />;
}
