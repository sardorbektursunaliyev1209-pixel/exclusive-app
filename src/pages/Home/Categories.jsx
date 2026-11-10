import { useEffect, useState } from "react";
import { getCategories } from "../../services/product";

// Kalit = backenddagi kategoriya nomi, qiymat = sizning rasmingiz
const categoryImages = {
  "Kiyim": "/category-img/kiyimla.png",
  "Elektronika": "/category-img/elektronika.png",
  "Ayollar kiyimi": "/category-img/ayollar.png",
  "Erkaklar kiyimi": "/category-img/E-kiyimi.png",
  "Bolalar oyinchog'i": "/category-img/B-oyinchiqlar.png",
};

export default function Categories({ active, onSelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((result) => setCategories(result || []))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between px-4 pb-3">
        <h2 className="text-lg font-bold">Kategoriyalar</h2>
        {active !== null && (
          <button
            onClick={() => onSelect(null)}
            className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-bold text-[var(--accent)] transition-transform active:scale-95"
          >
            Tozalash
          </button>
        )}
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[118px] w-[92px] shrink-0 animate-pulse rounded-3xl bg-[var(--hint)]/15"
            />
          ))}

        {categories.map((item) => {
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(isActive ? null : item.id)}
              className={`group flex w-[92px] shrink-0 snap-start flex-col items-center gap-2 rounded-3xl px-2 pb-3 pt-3 text-center transition-all duration-300 active:scale-95 ${
                isActive
                  ? "scale-[1.04] bg-gradient-to-br from-[#db4444] to-[#ff8a5c] text-white shadow-[0_10px_22px_rgba(219,68,68,0.35)]"
                  : "bg-[var(--card)] shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
              }`}
            >
              <span
                className={`grid h-[64px] w-[64px] place-items-center rounded-full transition-colors duration-300 ${
                  isActive ? "bg-white/25" : "bg-[var(--bg)]"
                }`}
              >
                <img
                  src={categoryImages[item.title] || item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-[42px] w-[42px] object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </span>

              <span className="line-clamp-2 min-h-[30px] text-[12px] font-semibold leading-tight">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}