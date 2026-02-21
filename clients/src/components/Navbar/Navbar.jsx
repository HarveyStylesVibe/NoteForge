import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineSun, HiOutlineMoon, HiOutlineUserPlus, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { useAuth } from "../../utils/AuthContext";
import { useTheme } from "../../utils/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, getInitials: getAuthInitials } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    navigate("/");
    logout();
  };

  const initials = getAuthInitials(user);

  return (
    <div className="flex items-center justify-between py-4 px-10 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
      <Link to="/" className="text-[var(--text-primary)] font-semibold text-xl hover:text-[var(--text-link-hover)] transition">
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
            className="text-[var(--text-secondary)] hover:text-[var(--text-link-hover)] transition font-medium"
          >
            {user?.name?.trim() || (user?.email && user.email.split("@")[0]) || "Dashboard"}
          </Link>
        )}
        {location.pathname !== "/login" && location.pathname !== "/signup" && !isAuthenticated && (
          <>
            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-link-hover)] transition">Login</Link>
            <Link to="/signup" className="text-[var(--text-secondary)] hover:text-[var(--text-link-hover)] transition">Signup</Link>
          </>
        )}
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              className="w-9 h-9 rounded-full bg-[var(--accent)] text-white font-semibold text-sm flex items-center justify-center hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition-opacity"
              aria-label="Profile menu"
              aria-expanded={dropdownOpen}
            >
              {initials}
            </button>
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-lg z-50"
                role="menu"
              >
                <Link
                  to="/signup"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-link-hover)] transition-colors"
                  role="menuitem"
                >
                  <HiOutlineUserPlus className="w-4 h-4 shrink-0" />
                  Add account
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                  role="menuitem"
                >
                  <HiOutlineArrowRightOnRectangle className="w-4 h-4 shrink-0" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;