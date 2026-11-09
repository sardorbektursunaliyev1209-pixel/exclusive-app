import { useState } from "react";
import { FaHeart, FaRegHeart, FaStar, FaImage } from "react-icons/fa";
import { useTelegram } from "../hooks/useTelegram";

export default function Card({ product, liked, onLike, onAdd }) {
  const { id, title, img, price, oldPrice, rating, reviews } = product;
  const [added, setAdded] = useState(false);
  const { haptic } = useTelegram();

  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;

  const handleAdd = () => {
    onAdd(product);
    haptic();
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--card)]">
      <div className="relative m-2 flex h-[130px] items-center justify-center rounded-xl bg-[var(--bg)]">
        {img ? (
          <img src={img} alt={title} loading="lazy" className="max-h-[80%] max-w-[80%] object-contain" />
        ) : (
          <FaImage size={36} className="text-[var(--hint)] opacity-50" />
        )}

        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-lg bg-[var(--accent)] px-2 py-0.5 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}

        <button
          onClick={() => { onLike(product); haptic(); }}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-[var(--card)]"
          aria-label="Sevimli"
        >
          {liked ? <FaHeart size={15} className="text-red-600" /> : <FaRegHeart size={15} />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 pb-3">
        <h2 className="line-clamp-2 h-9 text-sm leading-tight">{title}</h2>

        <div className="flex items-center gap-0.5 text-xs">
          {[1, 2, 3, 4, 5].map((n) => (
            <FaStar key={n} className={n <= rating ? "text-yellow-500" : "text-gray-400/50"} />
          ))}
          <span className="ml-1 text-[var(--hint)]">({reviews})</span>
        </div>

        <div className="text-[15px] font-extrabold">
          ${price}
          {oldPrice && (
            <span className="ml-1.5 text-xs font-normal text-[var(--hint)] line-through">${oldPrice}</span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className={`mt-auto rounded-xl py-2.5 text-sm font-bold text-white ${added ? "bg-green-600" : "bg-black"}`}
        >
          {added ? "Qo'shildi" : "Savatga qo'shish"}
        </button>
      </div>
    </div>
  );
}