import { NavLink } from "react-router-dom";
import { FaHome, FaThLarge, FaShoppingCart, FaRegHeart, FaUser } from "react-icons/fa";
import { useTelegram } from "../hooks/useTelegram";

export default function BottomNav({ cartCount = 0, likeCount = 0 }) {
  const { haptic } = useTelegram();

  const tabs = [
    { to: "/", title: "Bosh sahifa", Icon: FaHome },
    { to: "/catalog", title: "Katalog", Icon: FaThLarge },
    { to: "/cart", title: "Savat", Icon: FaShoppingCart, badge: cartCount },
    { to: "/like", title: "Sevimli", Icon: FaRegHeart, badge: likeCount },
    { to: "/profile", title: "Profil", Icon: FaUser },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 flex w-full max-w-[560px] -translate-x-1/2 border-t border-black/5 bg-[var(--card)] px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      {tabs.map(({ to, title, Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={haptic}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 text-[11px] ${
              isActive ? "font-bold text-[var(--accent)]" : "text-[var(--hint)]"
            }`
          }
        >
          <span className="relative">
            <Icon size={20} />
            {badge > 0 && (
              <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
          </span>
          {title}
        </NavLink>
      ))}
    </nav>
  );
}