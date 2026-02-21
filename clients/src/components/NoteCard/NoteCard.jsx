import React from "react";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineStar, HiOutlineArrowUturnLeft } from "react-icons/hi2";
import { getTagColor, normalizeTag } from "../../utils/tagColors";

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onToggleFavorite,
  onRestore,
  onDeletePermanently,
  isTrashView,
}) => {
  if (!note || typeof note !== "object") return null;

  const { title, snippet, updatedAt, isPinned, isFavorite, tags } = note;
  const date = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const tagList = (Array.isArray(tags) ? tags : []).map(normalizeTag).filter(Boolean);

  return (
    <article
      className="card-dark p-4 hover:bg-[var(--bg-card-hover)] transition-colors group cursor-pointer"
      onClick={() => onEdit?.(note)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1 flex-1">
          {title || "Untitled Note"}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          {isPinned && (
            <span className="text-[var(--accent)] text-xs font-medium">Pinned</span>
          )}
          {isFavorite && !isTrashView && (
            <HiOutlineStar className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden />
          )}
        </div>
      </div>
      {(snippet || note.content) && (
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
          {snippet || (note.content || "").slice(0, 120)}
        </p>
      )}
      {tagList.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tagList.map((t, i) => {
            const { label, color: colorId } = t;
            const { bg, text } = getTagColor(colorId);
            return (
              <span
                key={`${label}-${i}`}
                className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: bg, color: text }}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-muted)]">{date}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isTrashView ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore?.(note);
                }}
                className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-green-500/20 hover:text-green-500"
                aria-label="Restore note"
              >
                <HiOutlineArrowUturnLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePermanently?.(note);
                }}
                className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-red-500/20 hover:text-red-400"
                aria-label="Delete permanently"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(note);
                }}
                className={`p-1.5 rounded-md transition-colors ${
                  isFavorite
                    ? "text-amber-500 hover:bg-amber-500/20"
                    : "text-[var(--text-muted)] hover:bg-amber-500/20 hover:text-amber-500"
                }`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <HiOutlineStar className={`w-4 h-4 ${isFavorite ? "fill-amber-500" : ""}`} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(note);
                }}
                className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--accent)]"
                aria-label="Edit note"
              >
                <HiOutlinePencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(note);
                }}
                className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-red-500/20 hover:text-red-400"
                aria-label="Move to trash"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default NoteCard;
