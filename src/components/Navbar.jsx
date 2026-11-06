import { FaSearch, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useTelegram } from '../hooks/useTelegram';

export default function Navbar({ query, onQuery }) {
  const { name, photo } = useTelegram();

  return (
    <header className="bg-[var(--card)] px-4 pt-3.5 pb-3 rounded-b-[22px]">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full shrink-0 overflow-hidden grid place-items-center text-white text-lg font-bold bg-gradient-to-br from-[#db4444] to-[#ff8a5c]">
          {photo ? <img src={photo} alt="" className="w-full h-full object-cover" /> : name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <small className="text-[13px] text-[var(--hint)]">Xush kelibsiz</small>
          <b className="block text-[17px] truncate">{name}</b>
        </div>

        <button className="w-[42px] h-[42px] rounded-[14px] bg-[var(--bg)] grid place-items-center" aria-label="Sevimlilar">
          <FaRegHeart size={18} />
        </button>
        <button className="w-[42px] h-[42px] rounded-[14px] bg-[var(--bg)] grid place-items-center" aria-label="Savat">
          <FaShoppingCart size={18} />
        </button>
      </div>

      <label className="mt-3 flex items-center gap-2 h-11 px-3.5 rounded-[14px] bg-[var(--bg)] text-[var(--hint)]">
        <FaSearch />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Nima izlayapsiz?"
          className="flex-1 min-w-0 bg-transparent outline-none text-[var(--text)]"
        />
      </label>
    </header>
  );
}