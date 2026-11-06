import { useEffect, useState } from 'react';
import { FaMobileAlt, FaTshirt, FaTruck } from 'react-icons/fa';

const slides = [
  { small: 'iPhone 14 seriyasi', title: 'Voucher bilan 10% gacha chegirma', btn: 'Xarid qilish', Icon: FaMobileAlt },
  { small: 'Yozgi aksiya', title: 'Barcha kiyimlarga 50% chegirma', btn: 'Ko‘rish', Icon: FaTshirt },
  { small: 'Bepul yetkazish', title: '$140 dan oshgan buyurtmalarga', btn: 'Boshlash', Icon: FaTruck },
];

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  const { small, title, btn, Icon } = slides[i];

  return (
    <div className="relative mx-4 mt-4 min-h-[170px] overflow-hidden rounded-[20px] bg-black p-5 text-white">
      <small className="opacity-80">{small}</small>
      <h3 className="mt-2 mb-4 max-w-[65%] text-[24px] font-bold leading-tight">{title}</h3>
      <button className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black">{btn} →</button>

      <Icon className="absolute right-5 top-1/2 -translate-y-1/2 text-white/90" size={84} />

      <div className="absolute bottom-3 left-5 flex gap-1.5">
        {slides.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            className={`h-[7px] rounded-full ${k === i ? 'w-[18px] bg-[var(--accent)]' : 'w-[7px] bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}