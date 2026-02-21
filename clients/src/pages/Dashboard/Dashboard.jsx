import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import Sidebar from "../../components/Sidebar/Sidebar";
import NoteCard from "../../components/NoteCard/NoteCard";
import StatsCard from "../../components/StatsCard/StatsCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import EmptyState from "../../components/EmptyState/EmptyState";
import CreateNoteButton from "../../components/CreateNoteButton/CreateNoteButton";
import NoteEditorModal from "../../components/NoteEditorModal/NoteEditorModal";
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineStar, HiOutlineTrash, HiOutlineSun, HiOutlineMoon, HiOutlineUser } from "react-icons/hi2";
import { normalizeTag } from "../../utils/tagColors";
import { useTheme } from "../../utils/ThemeContext";

const STORAGE_KEY = "noteforge-notes";

const loadNotes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((n) => n != null && typeof n === "object");
  } catch {
    return [];
  }
};

const saveNotes = (notes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (_) {}
};

const matchSearch = (note, q) => {
  if (!q) return true;
  const match =
    (note.title || "").toLowerCase().includes(q) ||
    (note.snippet || "").toLowerCase().includes(q) ||
    (note.content || "").toLowerCase().includes(q) ||
    (Array.isArray(note.tags) &&
      note.tags.some((t) => {
        const { label } = normalizeTag(t) || {};
        return (label || "").toLowerCase().includes(q);
      }));
  return match;
};

const sortNotes = (list) =>
  [...list].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
  });

const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notes, setNotes] = useState(loadNotes);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const pathname = location.pathname || "";
  const isTrash = pathname.endsWith("/trash");
  const isFavorites = pathname.endsWith("/favorites");
  const isSettings = pathname.endsWith("/settings");

  const baseList = useMemo(() => {
    if (isTrash) return notes.filter((n) => n.isDeleted);
    if (isFavorites) return notes.filter((n) => !n.isDeleted && n.isFavorite);
    return notes.filter((n) => !n.isDeleted);
  }, [notes, isTrash, isFavorites]);

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q ? baseList.filter((n) => matchSearch(n, q)) : baseList;
    return isTrash ? [...list].sort((a, b) => new Date(b.deletedAt || 0) - new Date(a.deletedAt || 0)) : sortNotes(list);
  }, [baseList, search, isTrash]);

  const handleCreateNote = () => {
    setEditingNote(null);
    setEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleSaveNote = (payload) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === payload.id);
      const next = idx >= 0 ? [...prev] : [payload, ...prev];
      if (idx >= 0) next[idx] = payload;
      else next[0] = payload;
      return next;
    });
    setEditorOpen(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (note) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === note.id ? { ...n, isDeleted: true, deletedAt: new Date().toISOString() } : n
      )
    );
  };

  const handleRestoreNote = (note) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, isDeleted: false, deletedAt: undefined } : n))
    );
  };

  const handleDeletePermanently = (note) => {
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
  };

  const handleToggleFavorite = (note) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  };

  const activeNotesCount = notes.filter((n) => !n.isDeleted).length;
  const favoritesCount = notes.filter((n) => !n.isDeleted && n.isFavorite).length;
  const trashCount = notes.filter((n) => n.isDeleted).length;

  const displayName = user?.name?.trim() || (user?.email && user.email.split("@")[0]) || "";

  const greeting = () => {
    const hour = new Date().getHours();
    let timeWord = "Good evening";
    if (hour < 12) timeWord = "Good morning";
    else if (hour < 18) timeWord = "Good afternoon";
    return displayName ? `${timeWord}, ${displayName}` : timeWord;
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] bg-[var(--bg-primary)]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {isSettings ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">
                  Manage your appearance and account.
                </p>
              </div>

              <div className="space-y-6 max-w-xl">
                <section className="card-dark p-5 rounded-xl border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
                      {theme === "dark" ? (
                        <HiOutlineMoon className="w-5 h-5 text-[var(--accent)]" />
                      ) : (
                        <HiOutlineSun className="w-5 h-5 text-[var(--accent)]" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-[var(--text-primary)]">Appearance</h2>
                      <p className="text-sm text-[var(--text-muted)]">Choose light or dark theme.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                        theme === "light"
                          ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                          : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <HiOutlineSun className="w-4 h-4" />
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                        theme === "dark"
                          ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                          : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <HiOutlineMoon className="w-4 h-4" />
                      Dark
                    </button>
                  </div>
                </section>

                <section className="card-dark p-5 rounded-xl border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center">
                      <HiOutlineUser className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-[var(--text-primary)]">Account</h2>
                      <p className="text-sm text-[var(--text-muted)]">Your signed-in account details.</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    {user?.name && (
                      <div>
                        <span className="text-[var(--text-muted)] block mb-0.5">Name</span>
                        <span className="text-[var(--text-primary)]">{user.name}</span>
                      </div>
                    )}
                    {user?.email && (
                      <div>
                        <span className="text-[var(--text-muted)] block mb-0.5">Email</span>
                        <span className="text-[var(--text-primary)]">{user.email}</span>
                      </div>
                    )}
                    {!user?.name && !user?.email && (
                      <p className="text-[var(--text-muted)]">No account details available.</p>
                    )}
                  </div>
                </section>

                <section className="card-dark p-5 rounded-xl border border-[var(--border-subtle)]">
                  <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Data & storage</h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Your notes are stored locally in this browser. Sign out or clear site data will remove them. Future versions may support cloud sync.
                  </p>
                </section>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    {greeting()}
                  </h1>
                  <p className="text-[var(--text-muted)] text-sm mt-0.5">
                    Here’s your notes at a glance.
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 sm:max-w-xs">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search notes or tags..." />
                  </div>
                  <CreateNoteButton onClick={handleCreateNote} label="New note" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <StatsCard
                  label={isTrash ? "In trash" : "Total notes"}
                  value={isTrash ? trashCount : activeNotesCount}
                  icon={isTrash ? HiOutlineTrash : HiOutlineDocumentText}
                  accent
                />
                <StatsCard
                  label={isFavorites ? "Favorites" : "Updated recently"}
                  value={
                    isFavorites
                      ? favoritesCount
                      : notes.filter((n) => {
                          if (n.isDeleted) return false;
                          const d = new Date(n.updatedAt);
                          return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
                        }).length
                  }
                  icon={isFavorites ? HiOutlineStar : HiOutlineClock}
                />
              </div>

              <section>
                <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-4">
                  {isTrash
                    ? "Trash"
                    : isFavorites
                      ? "Favorites"
                      : filteredNotes.length
                        ? "Your notes"
                        : "Notes"}
                </h2>
                {filteredNotes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                        onToggleFavorite={handleToggleFavorite}
                        onRestore={handleRestoreNote}
                        onDeletePermanently={handleDeletePermanently}
                        isTrashView={isTrash}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title={
                      search
                        ? "No matching notes"
                        : isTrash
                          ? "Trash is empty"
                          : isFavorites
                            ? "No favorites yet"
                            : "You don't have any notes yet"
                    }
                    message={
                      search
                        ? "Try a different search or create a new note."
                        : isTrash
                          ? "Deleted notes will appear here. You can restore or delete them permanently."
                          : isFavorites
                            ? "Star notes from All Notes to see them here."
                            : "Create your first note to capture your ideas. Click the button below to get started."
                    }
                    onAction={search || isTrash || isFavorites ? undefined : handleCreateNote}
                    actionLabel="Create your first note"
                  />
                )}
              </section>
            </>
          )}
        </div>
      </main>
      {!isSettings && <CreateNoteButton onClick={handleCreateNote} variant="floating" />}

      <NoteEditorModal
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingNote(null);
        }}
        note={editingNote}
        onSave={handleSaveNote}
      />
    </div>
  );
};

export default Dashboard;
