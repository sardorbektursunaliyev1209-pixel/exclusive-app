import { FaHeart, FaRegHeart, FaStar, FaImage } from "react-icons/fa";
import { useTelegram } from "../hooks/useTelegram";
import { useNavigate } from "react-router-dom";

export default function Card({
  product,
  qty = 0,
  liked,
  onLike,
  onAdd,
  decreaseQty,
}) {
  const { title, img, price, oldPrice, rating, reviews } = product;
  const { haptic } = useTelegram();
  const navigate = useNavigate();
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;

  const handleAdd = () => {
    onAdd(product);
    haptic?.();
  };

  const handleDecrease = () => {
    decreaseQty(product.id);
    haptic?.();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-[var(--card)]">
      <div
        onClick={() => {
          navigate(`/product/${product.id}`);
        }}
        className="relative m-2 flex h-[130px] cursor-pointer items-center justify-center rounded-xl bg-[var(--bg)]"
      >
        {img ? (
          <img
            src={img}
            alt={title}
            loading="lazy"
            className="max-h-[80%] max-w-[80%] object-contain"
          />
        ) : (
          <FaImage size={36} className="text-[var(--hint)] opacity-50" />
        )}

        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-lg bg-[var(--accent)] px-2 py-0.5 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(product);
            haptic?.();
          }}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-[var(--card)]"
          aria-label="Sevimli"
        >
          {liked ? (
            <FaHeart size={15} className="text-red-600" />
          ) : (
            <FaRegHeart size={15} />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3 pb-3">
        <h2
          onClick={() => navigate(`/product/${product.id}`)}
          className="line-clamp-2 h-9 cursor-pointer text-sm leading-tight"
        >
          {title}
        </h2>

        <div className="flex items-center gap-0.5 text-xs">
          {[1, 2, 3, 4, 5].map((n) => (
            <FaStar
              key={n}
              className={n <= rating ? "text-yellow-500" : "text-gray-400/50"}
            />
          ))}
          <span className="ml-1 text-[var(--hint)]">({reviews})</span>
        </div>

        <div className="text-[15px] font-extrabold">
          ${price}
          {oldPrice && (
            <span className="ml-1.5 text-xs font-normal text-[var(--hint)] line-through">
              ${oldPrice}
            </span>
          )}
        </div>

        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className="mt-auto rounded-xl bg-[var(--btn,#000)] py-2.5 text-sm font-bold text-[var(--btn-text,#fff)] transition-transform active:scale-[0.97]"
          >
            Savatga qo'shish
          </button>
        ) : (
          <div className="mt-auto flex items-center justify-between rounded-xl bg-[var(--btn,#000)] text-[var(--btn-text,#fff)]">
            <button
              onClick={handleDecrease}
              aria-label="Kamaytirish"
              className="grid h-10 w-12 place-items-center text-lg font-bold active:scale-90"
            >
              −
            </button>
            <span className="text-sm font-bold">{qty}</span>
            <button
              onClick={handleAdd}
              aria-label="Ko'paytirish"
              className="grid h-10 w-12 place-items-center text-lg font-bold active:scale-90"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
