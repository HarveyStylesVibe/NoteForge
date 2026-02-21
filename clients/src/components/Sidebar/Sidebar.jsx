import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineDocumentText, HiOutlineStar, HiOutlineTrash, HiOutlineCog } from "react-icons/hi2";

const navItems = [
  { path: "/dashboard", label: "All Notes", icon: HiOutlineDocumentText },
  { path: "/dashboard/favorites", label: "Favorites", icon: HiOutlineStar },
  { path: "/dashboard/trash", label: "Trash", icon: HiOutlineTrash },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] min-h-[calc(100vh-4rem)]">
      <nav className="p-3 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-link-hover)]"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-3 border-t border-[var(--border-subtle)]">
        <Link
          to="/dashboard/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            location.pathname.endsWith("/settings")
              ? "bg-[var(--accent-muted)] text-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-link-hover)]"
          }`}
        >
          <HiOutlineCog className="w-5 h-5 shrink-0" />
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
