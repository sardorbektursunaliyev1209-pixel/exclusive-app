import { FaTrash } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";

export default function Cart({ cart, onRemove }) {
  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-[560px] px-4 pb-24">
        <PageHeader title="Savat" />
        <div className="py-20 text-center text-[var(--hint)]">
          Savat hozircha bo'sh
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px] px-4 pb-44">
      <PageHeader title="Savat" />

      <div className="flex flex-col gap-3">
        {cart.map((x) => (
          <div key={x.id} className="flex items-center gap-3 rounded-2xl bg-[var(--card)] p-3">
            <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-xl bg-[var(--bg)]">
              {x.img && <img src={x.img} alt={x.title} className="max-h-[80%] max-w-[80%] object-contain" />}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-sm leading-tight">{x.title}</h2>
              <b className="text-[15px]">${(x.price * x.quantity).toFixed(2)}</b>
              <div className="text-xs text-[var(--hint)]">Soni: {x.quantity}</div>
            </div>

            <button onClick={() => onRemove(x.id)} aria-label="O'chirish" className="p-2 text-[var(--hint)]">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="fixed bottom-[68px] left-1/2 w-full max-w-[560px] -translate-x-1/2 bg-[var(--card)] px-4 py-3">
        <div className="mb-2 flex justify-between text-base">
          <span>Jami</span>
          <b>${total.toFixed(2)}</b>
        </div>
        <button className="w-full rounded-xl bg-[var(--accent)] py-3 font-bold text-white">Buyurtma berish</button>
      </div>
    </div>
  );
}