import { useState } from 'react';
import { FaTshirt, FaLaptop, FaFemale, FaUserTie, FaPuzzlePiece } from 'react-icons/fa';

const categories = [
  { id: 1, title: 'Kiyim', Icon: FaTshirt },
  { id: 2, title: 'Elektronika', Icon: FaLaptop },
  { id: 3, title: 'Ayollar kiyimi', Icon: FaFemale },
  { id: 4, title: 'Erkaklar kiyimi', Icon: FaUserTie },
  { id: 5, title: 'Bolalar o‘yinchog‘i', Icon: FaPuzzlePiece },
];

export default function Categories() {
  const [active, setActive] = useState(null);

  return (
    <section className="mt-5">
      <h2 className="px-4 pb-2.5 text-lg font-bold">Kategoriyalar</h2>
      <div className="flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {categories.map(({ id, title, Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-[84px] shrink-0 rounded-2xl border bg-[var(--card)] px-1.5 py-3 text-center text-xs ${
              active === id ? 'border-[var(--accent)]' : 'border-transparent'
            }`}
          >
            <Icon size={28} className="mx-auto mb-2" />
            {title}
          </button>
        ))}
      </div>
    </section>
  );
}