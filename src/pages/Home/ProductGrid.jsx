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

// Backend maydonlarini kartaga mos shaklga o'tkazadi
const toCard = (p) => ({
  id: p.id,
  title: p.title,
  img: getImg(p.pictures),
  price: Number(p.discount_price || p.price),
  oldPrice: p.discount_price ? Number(p.price) : null,
  rating: Math.round(p.stars || 0),
  reviews: p.review_quantity || 0,
});

export default function ProductGrid({ onAdd, likes, onLike }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Product().then((data) => setProducts(data.map(toCard)));
  }, []);

  return (
    <section className="mt-5">
      <h2 className="px-4 pb-2.5 text-lg font-bold">Bugungi takliflar</h2>

      <div className="grid grid-cols-2 gap-3 px-4">
        {products.map((p) => (
          <Card
            key={p.id}
            product={p}
            liked={likes.some((x) => x.id === p.id)}
            onLike={onLike}
            onAdd={onAdd}
          />
        ))}
      </div>
    </section>
  );
}