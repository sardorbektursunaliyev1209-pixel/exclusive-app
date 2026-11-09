import { Link } from "react-router-dom";
import { FaBoxOpen, FaMapMarkerAlt, FaHeadset, FaChevronRight } from "react-icons/fa";
import { useTelegram } from "../../hooks/useTelegram";

const menu = [
  { id: 1, title: "Buyurtmalarim", Icon: FaBoxOpen },
  { id: 2, title: "Manzillarim", Icon: FaMapMarkerAlt },
  { id: 3, title: "Yordam", Icon: FaHeadset },
];

export default function Profile({ cartCount = 0, likeCount = 0 }) {
  const { user, name, photo } = useTelegram();

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || name;

  return (
    <div className="mx-auto max-w-[560px] px-4 pt-6 pb-28">
      {/* Telegram ma'lumotlari */}
      <div className="flex flex-col items-center text-center">
        <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#db4444] to-[#ff8a5c] text-4xl font-bold text-white">
          {photo ? (
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            fullName.charAt(0).toUpperCase()
          )}
        </div>

        <h1 className="mt-3 text-xl font-bold">{fullName}</h1>
        {user?.username && <p className="text-sm text-[var(--hint)]">@{user.username}</p>}
        {user?.id && <p className="text-xs text-[var(--hint)]">ID: {user.id}</p>}
      </div>

      {/* Savat va sevimlilar soni */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link to="/cart" className="rounded-2xl bg-[var(--card)] py-4 text-center">
          <b className="block text-2xl">{cartCount}</b>
          <span className="text-sm text-[var(--hint)]">Savatda</span>
        </Link>
        <Link to="/like" className="rounded-2xl bg-[var(--card)] py-4 text-center">
          <b className="block text-2xl">{likeCount}</b>
          <span className="text-sm text-[var(--hint)]">Sevimli</span>
        </Link>
      </div>

      {/* Menyu */}
      <div className="mt-5.5 flex flex-col gap-2">
        {menu.map(({ id, title, Icon }) => (
          <button
            key={id}
            onClick={() => alert(title + " (tez orada)")}
            className="flex items-center gap-3 rounded-2xl bg-[var(--card)] px-4 py-3.5 text-left"
          >
            <Icon className="text-[var(--accent)]" size={18} />
            <span className="flex-1">{title}</span>
            <FaChevronRight size={13} className="text-[var(--hint)]" />
          </button>
        ))}
      </div>

      {!user && (
        <p className="mt-6 text-center text-xs text-[var(--hint)]">
          Brauzerda ochilgani uchun Telegram ma'lumotlari ko'rinmayapti. Telegram ichida ism va rasm chiqadi.
        </p>
      )}
    </div>
  );
}