import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { useAuth } from "../../utils/AuthContext";
import { useTheme } from "../../utils/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <div className="flex items-center justify-between py-4 px-10 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
      <Link to="/" className="text-[var(--text-primary)] font-semibold text-xl">
        NoteForge
      </Link>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? (
            <HiOutlineSun className="w-5 h-5" />
          ) : (
            <HiOutlineMoon className="w-5 h-5" />
          )}
        </button>
        {isAuthenticated && (
          <Link
            to="/dashboard"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition font-medium"
          >
            Dashboard
          </Link>
        )}
        {location.pathname !== "/login" && location.pathname !== "/signup" && !isAuthenticated && (
          <>
            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">Login</Link>
            <Link to="/signup" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">Signup</Link>
          </>
        )}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition text-sm font-medium"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;