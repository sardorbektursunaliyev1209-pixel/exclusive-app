import { NavLink } from 'react-router-dom';
import { FaHome, FaThLarge, FaShoppingCart, FaRegHeart, FaUser } from 'react-icons/fa';
import { useTelegram } from '../hooks/useTelegram';

const tabs = [
  { to: '/', title: 'Bosh sahifa', Icon: FaHome },
  { to: '/catalog', title: 'Katalog', Icon: FaThLarge },
  { to: '/cart', title: 'Savat', Icon: FaShoppingCart },
  { to: '/like', title: 'Sevimli', Icon: FaRegHeart },
  { to: '/profile', title: 'Profil', Icon: FaUser },
];

export default function BottomNav() {
  const { haptic } = useTelegram();

  return (
    <nav className="fixed bottom-0 left-1/2 flex w-full max-w-[560px] -translate-x-1/2 border-t border-black/5 bg-[var(--card)] px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
      {tabs.map(({ to, title, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={haptic}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 text-[11px] ${
              isActive ? 'font-bold text-[var(--accent)]' : 'text-[var(--hint)]'
            }`
          }
        >
          <Icon size={20} />
          {title}
        </NavLink>
      ))}
    </nav>
  );
}