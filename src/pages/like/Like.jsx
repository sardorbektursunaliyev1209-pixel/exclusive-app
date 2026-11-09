import { FaHeart } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";

export default function Like({ likes, onLike, onAdd }) {
  if (likes.length === 0) {
    return (
      <div className="mx-auto max-w-[560px] px-4 pb-24">
        <PageHeader title="Sevimlilar" />
        <div className="py-20 text-center text-[var(--hint)]">
          Sevimlilar hozircha bo'sh
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px] px-4 pb-28">
      <PageHeader title="Sevimlilar" />

      <div className="flex flex-col gap-3">
        {likes.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-2xl bg-[var(--card)] p-3"
          >
            <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-xl bg-[var(--bg)]">
              {item.img && (
                <img
                  src={item.img}
                  alt={item.title}
                  className="max-h-[80%] max-w-[80%] object-contain"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-sm leading-tight">{item.title}</h2>
              <b className="text-[15px]">${item.price}</b>
              <div>
                <button
                  onClick={() => onAdd(item)}
                  className="mt-1 rounded-lg bg-black px-3 py-1 text-xs font-bold text-white"
                >
                  Savatga
                </button>
              </div>
            </div>

            <button
              onClick={() => onLike(item)}
              aria-label="Sevimlilardan o'chirish"
              className="p-2"
            >
              <FaHeart size={18} className="text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}