import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import PageHeader from "../../components/PageHeader";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Telegram ichida chiroyli xabar, brauzerda oddiy alert
const notify = (text) => {
  const tg = window.Telegram?.WebApp;
  if (tg?.showAlert && tg.isVersionAtLeast?.("6.2")) tg.showAlert(text);
  else alert(text);
};

export default function Cart({ cart, onRemove, onClear }) {
  const [sending, setSending] = useState(false);

  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);

  const handleOrder = async () => {
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    const addresses = JSON.parse(localStorage.getItem("addresses") || "[]");

    if (!profile.phone || addresses.length === 0) {
      notify("Avval Profilda telefon raqam va manzilni kiriting");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(API_URL + "/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          name: profile.name,
          phone: "+998" + profile.phone,
          address: addresses[0].text,
          userId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
        }),
      });

      if (!res.ok) throw new Error("Server xatosi");

      onClear?.();
      notify("Buyurtmangiz qabul qilindi ✓");
    } catch (e) {
      console.error(e);
      notify("Xatolik bo'ldi, qayta urinib ko'ring");
    } finally {
      setSending(false);
    }
  };

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
          <div
            key={x.id}
            className="flex items-center gap-3 rounded-2xl bg-[var(--card)] p-3"
          >
            <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-xl bg-[var(--bg)]">
              {x.img && (
                <img
                  src={x.img}
                  alt={x.title}
                  className="max-h-[80%] max-w-[80%] object-contain"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-sm leading-tight">{x.title}</h2>
              <b className="text-[15px]">${(x.price * x.quantity).toFixed(2)}</b>
              <div className="text-xs text-[var(--hint)]">Soni: {x.quantity}</div>
            </div>

            <button
              onClick={() => onRemove(x.id)}
              aria-label="O'chirish"
              className="p-2 text-[var(--hint)]"
            >
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
        <button
          onClick={handleOrder}
          disabled={sending}
          className="w-full rounded-xl bg-[var(--accent)] py-3 font-bold text-white disabled:opacity-60"
        >
          {sending ? "Yuborilmoqda..." : "Buyurtma berish"}
        </button>
      </div>
    </div>
  );
}