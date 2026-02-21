import React, { useState, useEffect } from "react";
import { HiXMark, HiOutlineTag, HiOutlineBookmark } from "react-icons/hi2";
import { TAG_COLORS, getTagColor, normalizeTag } from "../../utils/tagColors";

const NoteEditorModal = ({ open, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagColorId, setTagColorId] = useState(TAG_COLORS[0].id);

  useEffect(() => {
    if (open) {
      if (note) {
        setTitle(note.title || "");
        setContent(note.content ?? note.snippet ?? "");
        setIsPinned(!!note.isPinned);
        setTags((Array.isArray(note.tags) ? note.tags : []).map(normalizeTag).filter(Boolean));
      } else {
        setTitle("");
        setContent("");
        setIsPinned(false);
        setTags([]);
      }
      setTagInput("");
      setTagColorId(TAG_COLORS[0].id);
    }
  }, [open, note]);

  const handleAddTag = (e) => {
    e?.preventDefault();
    const label = tagInput.trim();
    if (!label) return;
    const normalized = tags.map(normalizeTag).filter(Boolean);
    if (normalized.some((t) => t.label.toLowerCase() === label.toLowerCase())) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, { label, color: tagColorId }]);
    setTagInput("");
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const snippet = content.trim().slice(0, 120) || "";
    const payload = {
      id: note?.id || `note-${Date.now()}`,
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      snippet,
      updatedAt: new Date().toISOString(),
      isPinned: !!isPinned,
      isFavorite: note?.isFavorite ?? false,
      isDeleted: note?.isDeleted ?? false,
      deletedAt: note?.deletedAt,
      tags: tags.map((t) => (typeof t === "string" ? { label: t, color: TAG_COLORS[0].id } : t)),
    };
    onSave(payload);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl card-dark border border-[var(--border-subtle)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 p-4 border-b border-[var(--border-subtle)] shrink-0">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {note ? "Edit note" : "New note"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="input-dark w-full px-4 py-2.5"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={8}
              className="input-dark w-full px-4 py-2.5 resize-y min-h-[160px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPinned((p) => !p)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isPinned
                  ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <HiOutlineBookmark className="w-4 h-4" />
              {isPinned ? "Pinned" : "Pin note (optional)"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Tags (optional – for search)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((t, i) => {
                const { label, color: colorId } = typeof t === "string" ? { label: t, color: TAG_COLORS[0].id } : t;
                const { bg, text } = getTagColor(colorId);
                return (
                  <span
                    key={`${label}-${i}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-[var(--border-subtle)]"
                    style={{ backgroundColor: bg, color: text }}
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => removeTag(i)}
                      className="ml-0.5 hover:opacity-80"
                      aria-label={`Remove tag ${label}`}
                    >
                      <HiXMark className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
                placeholder="Add tag..."
                className="input-dark flex-1 min-w-[120px] px-3 py-2 text-sm"
              />
              <div className="flex items-center gap-1" title="Tag color">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setTagColorId(c.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      tagColorId === c.id ? "border-[var(--text-primary)] scale-110" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.text }}
                    aria-label={`Color ${c.id}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-muted)] transition-colors disabled:opacity-50 disabled:pointer-events-none text-sm font-medium"
              >
                <HiOutlineTag className="w-4 h-4" />
                Add tag
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-[var(--border-subtle)] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-glow px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditorModal;
