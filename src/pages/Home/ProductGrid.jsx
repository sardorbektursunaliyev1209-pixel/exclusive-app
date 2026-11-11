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
});

export default function ProductGrid({
  onAdd,
  cart = [],
  decreaseQty,
  likes = [],
  onLike,
  query = "",
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Product()
      .then((data) => setProducts(data.map(toCard)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = products.filter((p) =>
    (p.title || "").toLowerCase().includes(q),
  );

  return (
    <section className="mt-5">
      <h2 className="px-4 pb-2.5 text-lg font-bold">
        {q ? "Qidiruv natijalari" : "Bugungi takliflar"}
      </h2>

      <div className="grid grid-cols-2 gap-3 px-4">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[290px] animate-pulse rounded-2xl bg-[var(--hint)]/15"
            />
          ))}

        {filtered.map((p) => (
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

      {!loading && products.length > 0 && filtered.length === 0 && (
        <p className="px-4 py-10 text-center text-[var(--hint)]">
          Hech narsa topilmadi
        </p>
      )}
    </section>
  );
}