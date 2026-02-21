import React, { createContext, useState, useContext } from "react";

// Create the context for authentication
const AuthContext = createContext();

// Get 2-letter initials from name ("John Doe" -> "JD") or email ("john@x.com" -> "JO")
export const getInitials = (user) => {
  if (!user) return "?";
  if (user.name && user.name.trim()) {
    const parts = user.name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (user.email && user.email.trim()) {
    const prefix = user.email.split("@")[0] || "";
    return prefix.slice(0, 2).toUpperCase() || "?";
  }
  return "?";
};

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Login function – pass { name, email } from signup or { email } from login
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData && typeof userData === "object" ? userData : null);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getInitials }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);