import { useNavigate } from 'react-router-dom';
import { FaSearch, FaRegHeart, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useTelegram } from '../hooks/useTelegram';

function IconButton({ label, count = 0, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-[var(--bg)] transition-transform active:scale-90"
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-[var(--card)]">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

export default function Navbar({ query, onQuery, cartCount = 0, likeCount = 0 }) {
  const { name, photo, haptic } = useTelegram();
  const navigate = useNavigate();

  const go = (path) => {
    haptic?.();
    navigate(path);
  };

  const displayName = name || 'Mehmon';

  return (
    <header className="sticky top-0 z-40 rounded-b-[24px] bg-[var(--card)]/90 px-4 pb-3 pt-3.5 shadow-[0_6px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="rounded-full bg-gradient-to-br from-[#db4444] to-[#ff8a5c] p-[2px]">
          <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[var(--card)] bg-gradient-to-br from-[#db4444] to-[#ff8a5c] text-lg font-bold text-white">
            {photo ? (
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
        </div>

        {/* Salomlashish */}
        <div className="min-w-0 flex-1 leading-tight">
          <small className="text-[12px] text-[var(--hint)]">Xush kelibsiz 👋</small>
          <b className="block truncate text-[17px]">{displayName}</b>
        </div>

        {/* Tugmalar */}
        <IconButton label="Sevimlilar" count={likeCount} onClick={() => go('/like')}>
          <FaRegHeart size={18} />
        </IconButton>
        <IconButton label="Savat" count={cartCount} onClick={() => go('/cart')}>
          <FaShoppingCart size={18} />
        </IconButton>
      </div>

      {/* Qidiruv */}
      <label className="mt-3 flex h-11 items-center gap-2.5 rounded-[14px] bg-[var(--bg)] px-3.5 text-[var(--hint)] ring-2 ring-transparent transition-all focus-within:bg-[var(--card)] focus-within:ring-[var(--accent)]/40">
        <FaSearch size={14} />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Nima izlayapsiz?"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--hint)]"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQuery('')}
            aria-label="Tozalash"
            className="grid h-5 w-5 place-items-center rounded-full bg-[var(--hint)]/30 text-[var(--text)]"
          >
            <FaTimes size={10} />
          </button>
        )}
      </label>
    </header>
  );
}