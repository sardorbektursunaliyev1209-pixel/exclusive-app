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

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    getCategories()
      .then((result) => {
        console.log(result); // F12 → Console da nomlar ko'rinadi
        setCategories(result);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="mt-5">
      <h2 className="px-4 pb-2.5 text-lg font-bold">Kategoriyalar</h2>

      <div className="flex justify-between gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[96px] w-[84px] shrink-0 animate-pulse rounded-2xl bg-black/10" />
          ))}

        {categories.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-[94px] shrink-0 rounded-2xl border bg-[var(--card)] px-1.5 py-3 text-center text-xs ${
              active === item.id ? "border-[var(--accent)]" : "border-transparent"
            }`}
          >
            <img
              src={categoryImages[item.title] || item.image}
              alt={item.title}
              className="mx-auto mb-2 h-18 w-18 object-contain"
            />
            {item.title}
          </button>
        ))}
      </div>
    </section>
  );
}