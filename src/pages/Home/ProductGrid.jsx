import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { Product } from "../../services/product";
import { baseUrl } from "../../services/config";

const getImg = (pictures) => {
  let pic = pictures;
  if (Array.isArray(pic)) pic = pic[0];
  if (pic && typeof pic === "object") pic = pic.image || pic.picture || pic.url;
  if (!pic) return "";
  return pic.startsWith("http") ? pic : baseUrl + pic;
};

const toCard = (p) => ({
  id: p.id,
  title: p.title,
  img: getImg(p.pictures),
  price: Number(p.discount_price || p.price),
  oldPrice: p.discount_price ? Number(p.price) : null,
  rating: Math.round(p.stars || 0),
  reviews: p.review_quantity || 0,
  category: p.category || p.category_id || null,
});

function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--card)] animate-pulse shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
      {/* Rasm joyi */}
      <div className="m-2 h-[130px] rounded-xl bg-gray-200 dark:bg-gray-700/50" />

      {/* Kontent */}
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3">
        {/* Sarlavha (2 qator) */}
        <div className="space-y-1">
          <div className="h-3.5 w-full rounded bg-gray-200 dark:bg-gray-700/50" />
          <div className="h-3.5 w-3/4 rounded bg-gray-200 dark:bg-gray-700/50" />
        </div>

        {/* Yulduzchalar */}
        <div className="flex gap-1 pt-1">
          <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700/50" />
        </div>

        {/* Narx */}
        <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700/50" />

        {/* Savatga tugmasi */}
        <div className="mt-auto h-9 w-full rounded-xl bg-gray-200 dark:bg-gray-700/50" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  onAdd,
  cart = [],
  decreaseQty,
  likes = [],
  onLike,
  query = "",
  category = null,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    setError(null);
    Product()
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.data)
          ? data.data
          : [];
        setProducts(list.map(toCard));
      })
      .catch((err) => {
        console.error("Mahsulotlarni olishda xato:", err);
        setError(err.message || "Server bilan aloqa uzildi");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const matchQuery = (p.title || "").toLowerCase().includes(q);
    const matchCategory = category ? p.category === category : true;
    return matchQuery && matchCategory;
  });

  return (
    <section className="mt-5">
      <h2 className="px-4 pb-2.5 text-lg font-bold">
        {q ? "Qidiruv natijalari" : "Bugungi takliflar"}
      </h2>

      <div className="grid grid-cols-2 gap-3 px-4">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}

        {!loading &&
          filtered.map((p) => (
            <Card
              key={p.id}
              product={p}
              qty={cart.find((x) => x.id === p.id)?.quantity || 0}
              liked={likes.some((x) => x.id === p.id)}
              onLike={onLike}
              onAdd={onAdd}
              decreaseQty={decreaseQty}
            />
          ))}
      </div>

      {error && !loading && (
        <div className="mx-4 my-6 rounded-2xl bg-red-50 p-4 text-center dark:bg-red-950/20">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Mahsulotlarni yuklab bo'lmadi ({error})
          </p>
          <button
            onClick={loadProducts}
            className="mt-3 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-white shadow transition-transform active:scale-95"
          >
            Qayta yuklash
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="px-4 py-10 text-center text-[var(--hint)]">
          Hozircha mahsulotlar mavjud emas
        </p>
      )}

      {!loading && !error && products.length > 0 && filtered.length === 0 && (
        <p className="px-4 py-10 text-center text-[var(--hint)]">
          Hech narsa topilmadi
        </p>
      )}
    </section>
  );
}
