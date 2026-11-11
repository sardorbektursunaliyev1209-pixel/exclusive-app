import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useTelegram } from "../hooks/useTelegram";

export default function PageHeader({ title, right }) {
  const navigate = useNavigate();
  const { haptic } = useTelegram();
  const hasTgBack = !!window.Telegram?.WebApp?.initData;
  const goBack = () => {
    haptic?.();
    // oldingi sahifa bo'lmasa (to'g'ridan-to'g'ri ochilgan bo'lsa), bosh sahifaga
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-3 flex items-center gap-3 bg-[var(--bg)]/90 px-4 py-3 backdrop-blur-md">
      {!hasTgBack && (
        <button
          onClick={goBack}
          aria-label="Orqaga"
          className="grid h-10 w-10 place-items-center rounded-full bg-[var(--card)] transition-transform active:scale-90"
        >
          <FaArrowLeft size={15} />
        </button>
      )}
      <h2 className="flex-1 text-lg font-bold">{title}</h2>
      {right}
    </div>
  );
}
