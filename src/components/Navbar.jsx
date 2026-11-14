import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaTimes,
  FaMapMarkerAlt,
  FaChevronDown,
} from "react-icons/fa";
import { useTelegram } from "../hooks/useTelegram";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Navbar({ query, onQuery, autoFocus = false }) {
  const { name, photo, haptic } = useTelegram();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [profile] = useLocalStorage("profile", {
    name: "",
    phone: "",
    city: "",
  });

  const displayName = profile.name || name || "Mehmon";

  return (
    <header className="sticky top-0 z-40 rounded-b-[28px] bg-[var(--card)]/90 px-4 pb-4 pt-3.5 shadow-[0_8px_28px_rgba(0,0,0,0.07)] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          onClick={() => haptic?.()}
          className="rounded-full bg-gradient-to-br from-[#db4444] to-[#ff8a5c] p-[2px] transition-transform active:scale-95"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[var(--card)] bg-gradient-to-br from-[#db4444] to-[#ff8a5c] text-lg font-bold text-white">
            {photo ? (
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
        </Link>

        <div className="min-w-0 flex-1 leading-tight">
          <small className="text-[12px] text-[var(--hint)]">
            Xush kelibsiz 👋
          </small>
          <b className="block truncate text-[17px]">{displayName}</b>
        </div>

        <Link
          to="/profile"
          onClick={() => haptic?.()}
          className="flex max-w-[140px] items-center gap-1.5 rounded-full bg-[var(--bg)] py-2 pl-2.5 pr-3 text-[13px] font-medium transition-transform active:scale-95"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
            <FaMapMarkerAlt size={11} />
          </span>
          <span className="truncate">{profile.city || "Shahar tanlang"}</span>
          <FaChevronDown size={9} className="shrink-0 text-[var(--hint)]" />
        </Link>
      </div>

      <label className="mt-3.5 flex h-12 items-center gap-3 rounded-2xl bg-[var(--bg)] px-4 text-[var(--hint)] ring-2 ring-transparent transition-all focus-within:bg-[var(--card)] focus-within:ring-[var(--accent)]/40">
        <FaSearch size={15} />
        <input
          autoFocus={autoFocus}
          readOnly={!onQuery}
          onClick={() => {
            if (pathname !== "/search") navigate("/search");
          }}
          value={query ?? ""}
          onChange={(e) => onQuery?.(e.target.value)}
          placeholder="Nima izlayapsiz?"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--hint)]"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQuery?.("")}
            aria-label="Tozalash"
            className="grid h-6 w-6 place-items-center rounded-full bg-[var(--hint)]/25 text-[var(--text)]"
          >
            <FaTimes size={10} />
          </button>
        )}
      </label>
    </header>
  );
}
