import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaImage,
  FaMinus,
  FaPlus,
  FaTruck,
  FaCheckCircle,
  FaUndoAlt,
} from "react-icons/fa";
import PageHeader from "../../components/PageHeader";
import { useTelegram } from "../../hooks/useTelegram";
import { Product } from "../../services/product";
import { baseUrl } from "../../services/config";
import { money } from "../../utils/format";

const fullUrl = (u) => (u && u.startsWith("http") ? u : u ? baseUrl + u : "");

const getImages = (pictures) => {
  const list = Array.isArray(pictures) ? pictures : pictures ? [pictures] : [];
  return list
    .map((p) =>
      typeof p === "object" && p ? p.image || p.picture || p.url : p,
    )
    .filter(Boolean)
    .map(fullUrl);
};

const toDetail = (p) => ({
  id: p.id,
  title: p.title,
  images: getImages(p.pictures),
  img: getImages(p.pictures)[0] || "",
  price: Number(p.discount_price || p.price),
  oldPrice: p.discount_price ? Number(p.price) : null,
  rating: Math.round(p.stars || 0),
  reviews: p.review_quantity || 0,
  description: p.description || p.desc || "",
});

export default function ProductDetail({
  cart = [],
  likes = [],
  onAdd,
  onLike,
  decreaseQty,
}) {
  const { id } = useParams();
  const { haptic } = useTelegram();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const galleryRef = useRef(null);

  useEffect(() => {
    Product()
      .then((data) => {
        const found = data.find((p) => String(p.id) === String(id));
        setItem(found ? toDetail(found) : null);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  const onScroll = () => {
    const el = galleryRef.current;
    if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[560px] px-4 pb-44">
        <PageHeader title="Mahsulot" />
        <div className="h-[300px] animate-pulse rounded-3xl bg-[var(--hint)]/15" />
        <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-[var(--hint)]/15" />
        <div className="mt-3 h-8 w-1/2 animate-pulse rounded bg-[var(--hint)]/15" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-[560px] px-4 pb-24">
        <PageHeader title="Mahsulot" />
        <p className="py-20 text-center text-[var(--hint)]">
          Mahsulot topilmadi
        </p>
      </div>
    );
  }

  const qty = cart.find((x) => x.id === item.id)?.quantity || 0;
  const liked = likes.some((x) => x.id === item.id);
  const discount = item.oldPrice
    ? Math.round((1 - item.price / item.oldPrice) * 100)
    : 0;

  const add = () => {
    onAdd(item);
    haptic?.();
  };
  const minus = () => {
    decreaseQty(item.id);
    haptic?.();
  };

  return (
    <div className="mx-auto max-w-[560px] px-4 pb-48">
      <PageHeader title="Mahsulot" />

      {/* Galereya */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--card)]">
        <div
          ref={galleryRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
        >
          {item.images.length ? (
            item.images.map((src, i) => (
              <div
                key={i}
                className="grid h-[320px] w-full shrink-0 snap-center place-items-center p-6"
              >
                <img
                  src={src}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))
          ) : (
            <div className="grid h-[320px] w-full place-items-center">
              <FaImage size={56} className="text-[var(--hint)] opacity-40" />
            </div>
          )}
        </div>

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-xl bg-[var(--accent)] px-3 py-1 text-sm font-bold text-white shadow-md">
            -{discount}%
          </span>
        )}

        <button
          onClick={() => {
            onLike({
              id: item.id,
              title: item.title,
              img: item.img,
              price: item.price,
            });
            haptic?.();
          }}
          aria-label="Sevimli"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[var(--card)] shadow-md transition-transform active:scale-90"
        >
          {liked ? (
            <FaHeart size={17} className="text-red-600" />
          ) : (
            <FaRegHeart size={17} />
          )}
        </button>

        {item.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {item.images.map((_, i) => (
              <span
                key={i}
                className={`h-[6px] rounded-full transition-all ${
                  i === slide
                    ? "w-5 bg-[var(--accent)]"
                    : "w-[6px] bg-[var(--hint)]/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ma'lumot */}
      <div className="mt-4 rounded-3xl bg-[var(--card)] p-4">
        <h1 className="text-lg font-bold leading-snug">{item.title}</h1>

        <div className="mt-2 flex items-center gap-1 text-sm">
          {[1, 2, 3, 4, 5].map((n) => (
            <FaStar
              key={n}
              className={
                n <= item.rating ? "text-yellow-500" : "text-gray-400/50"
              }
            />
          ))}
          <span className="ml-1.5 text-[var(--hint)]">
            {item.reviews} ta sharh
          </span>
        </div>

        <div className="mt-4 flex items-end gap-2">
          <b className="text-2xl font-extrabold text-[var(--accent)]">
            {money(item.price)}
          </b>
          {item.oldPrice && (
            <span className="pb-0.5 text-sm text-[var(--hint)] line-through">
              {money(item.oldPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3  grid grid-cols-3 gap-2 text-center text-[11px]">
        {[
          [<FaTruck color="red" />, "Tez yetkazish"],
          [<FaCheckCircle color="green" />, "Sifat kafolati"],
          [<FaUndoAlt color="blue"/>, "Qaytarish mumkin"],
        ].map(([icon, text]) => (
          <div key={text} className="rounded-2xl bg-[var(--card)] px-2 py-3 flex flex-col items-center gap-2">
            <div className="text-xl ">{icon}</div>
            <div className="mt-1 text-[var(--hint)]">{text}</div>
          </div>
        ))}
      </div>

      {/* Tavsif */}
      {item.description && (
        <div className="mt-3 rounded-3xl bg-[var(--card)] p-4">
          <h2 className="mb-2 font-bold">Tavsif</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--hint)]">
            {item.description}
          </p>
        </div>
      )}

      {/* Pastki panel */}
      <div className="fixed bottom-[68px] left-1/2 z-40 w-full max-w-[560px] -translate-x-1/2 rounded-t-3xl bg-[var(--card)]/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="text-xs text-[var(--hint)]">Narxi</div>
            <b className="block truncate text-base">{money(item.price)}</b>
          </div>

          {qty === 0 ? (
            <button
              onClick={add}
              className="ml-auto flex-1 rounded-2xl bg-[var(--accent)] py-3.5 font-bold text-white shadow-[0_8px_18px_rgba(219,68,68,0.35)] transition-transform active:scale-[0.97]"
            >
              Savatga qo'shish
            </button>
          ) : (
            <div className="ml-auto flex flex-1 items-center justify-between rounded-2xl bg-[var(--accent)] text-white">
              <button
                onClick={minus}
                aria-label="Kamaytirish"
                className="grid h-12 w-14 place-items-center active:scale-90"
              >
                <FaMinus size={13} />
              </button>
              <span className="text-base font-bold">{qty}</span>
              <button
                onClick={add}
                aria-label="Ko'paytirish"
                className="grid h-12 w-14 place-items-center active:scale-90"
              >
                <FaPlus size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}