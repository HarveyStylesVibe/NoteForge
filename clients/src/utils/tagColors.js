/** Tag color options – work in both light and dark theme */
export const TAG_COLORS = [
  { id: "blue", bg: "rgba(59, 130, 246, 0.2)", text: "#2563eb" },
  { id: "green", bg: "rgba(34, 197, 94, 0.2)", text: "#15803d" },
  { id: "amber", bg: "rgba(245, 158, 11, 0.2)", text: "#b45309" },
  { id: "rose", bg: "rgba(244, 63, 94, 0.2)", text: "#be123c" },
  { id: "violet", bg: "rgba(139, 92, 246, 0.2)", text: "#6d28d9" },
];

export const getTagColor = (colorId) => {
  const c = TAG_COLORS.find((x) => x.id === colorId);
  return c || TAG_COLORS[0];
};

/** Normalize tag to { label, color } */
export const normalizeTag = (t) => {
  if (typeof t === "string") return { label: t, color: TAG_COLORS[0].id };
  if (t && typeof t === "object" && t.label) return { label: t.label, color: t.color || TAG_COLORS[0].id };
  return null;
};
