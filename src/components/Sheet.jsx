import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function Sheet({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        style={{ animation: "fadeIn 0.2s ease both" }}
      />

      <div
        className="relative max-h-[88vh] w-full max-w-[560px] overflow-y-auto rounded-t-3xl bg-[var(--card)] px-4 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]"
        style={{ animation: "sheetUp 0.28s ease both" }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--hint)]/40" />

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="grid h-9 w-9 place-items-center rounded-full bg-[var(--bg)]"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}