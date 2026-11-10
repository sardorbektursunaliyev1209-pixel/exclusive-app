import { useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaTelegramPlane,
  FaRegCopy,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useTelegram } from "../hooks/useTelegram";

const ADMIN_USERNAME = "rslvic_7";
const ADMIN_PHONE = "+998936766616"; 
const ADMIN_PHONE_VIEW = "+998 93 855 12 09"; 

export default function HelpSheet({ open, onClose }) {
  const { haptic } = useTelegram();
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const copy = async () => {
    haptic?.();
    try {
      await navigator.clipboard.writeText(ADMIN_PHONE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setNote("Nusxalab bo'lmadi, raqamni qo'lda yozib oling");
    }
  };

  const call = () => {
    haptic?.();
    window.location.href = `tel:${ADMIN_PHONE}`;
  };

  const writeTelegram = () => {
    haptic?.();
    const tg = window.Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/${ADMIN_USERNAME}`);
    } else {
      setNote("Bu tugma faqat Telegram ichida ishlaydi");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
        style={{ animation: "fadeIn 0.2s ease both" }}
      />

      <div
        className="relative w-full max-w-[560px] overflow-hidden rounded-t-[28px] bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#6d28d9] px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] text-white"
        style={{ animation: "sheetUp 0.28s ease both" }}
      >
        {/* Yorug' dog'lar */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#db4444]/25 blur-3xl" />

        <div className="relative">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/30" />

          <button
            onClick={onClose}
            aria-label="Yopish"
            className="absolute right-0 top-0 grid h-9 w-9 place-items-center rounded-full bg-white/10 backdrop-blur-sm"
          >
            <FaTimes size={14} />
          </button>

          {/* Ikonka */}
          <div className="relative mx-auto mt-2 grid h-28 w-28 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full border border-white/20" />
            <span className="absolute inset-3 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm" />
            <span className="relative grid h-[72px] w-[72px] place-items-center rounded-full bg-gradient-to-br from-[#db4444] to-[#ff8a5c] shadow-[0_10px_24px_rgba(219,68,68,0.45)]">
              <FaPhoneAlt size={26} />
            </span>
            <span className="absolute -right-2 top-3 rounded-full bg-green-500 px-2 py-0.5 text-[11px] font-extrabold shadow-md">
              24/7
            </span>
          </div>

          <h3 className="mt-4 text-center text-2xl font-extrabold">Yordam xizmati</h3>
          <p className="mt-1 text-center text-sm text-white/70">
            Savollaringiz bo'lsa, hoziroq bog'laning
          </p>

          {/* Raqam */}
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
            <b className="text-xl tracking-wide">{ADMIN_PHONE_VIEW}</b>
            <button
              onClick={copy}
              aria-label="Nusxalash"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 transition-transform active:scale-90"
            >
              {copied ? (
                <FaCheck className="text-green-400" />
              ) : (
                <FaRegCopy />
              )}
            </button>
          </div>

          {/* Tugmalar */}
          <button
            onClick={call}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 font-bold text-black shadow-lg transition-transform active:scale-[0.98]"
          >
            <FaPhoneAlt size={14} /> Qo'ng'iroq qilish
          </button>

          <button
            onClick={writeTelegram}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 py-3.5 font-bold backdrop-blur-md transition-transform active:scale-[0.98]"
          >
            <FaTelegramPlane size={16} /> Telegramda yozish
          </button>

          {note && (
            <p className="mt-3 text-center text-xs text-white/70">{note}</p>
          )}
        </div>
      </div>
    </div>
  );
}