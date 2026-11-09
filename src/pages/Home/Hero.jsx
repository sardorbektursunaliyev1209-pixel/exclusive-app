import { useEffect, useRef, useState } from 'react';

const DELAY = 4000;

const slides = [
  {
    badge: 'Yangi',
    small: 'iPhone 14 seriyasi',
    title: 'Voucher bilan chegirma',
    btn: 'Xarid qilish',
    stat: '10%',
    statLabel: 'gacha',
    bg: 'from-[#0f172a] via-[#1e1b4b] to-[#6d28d9]',
  },
  {
    badge: 'Yozgi aksiya',
    small: 'Barcha kiyimlarga',
    title: 'Mavsum yakunlanmoqda',
    btn: 'Ko‘rish',
    stat: '50%',
    statLabel: 'chegirma',
    bg: 'from-[#7f1d1d] via-[#db4444] to-[#ff8a5c]',
  },
  {
    badge: 'Bepul',
    small: 'Tezkor yetkazish',
    title: 'Katta buyurtmalarga',
    btn: 'Boshlash',
    stat: '$140',
    statLabel: 'dan oshsa',
    bg: 'from-[#052e16] via-[#047857] to-[#34d399]',
  },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const startX = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setI((p) => (p + 1) % slides.length), DELAY);
    return () => clearTimeout(t);
  }, [i]);

  const go = (n) => setI((n + slides.length) % slides.length);

  const onTouchStart = (e) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(diff) > 40) go(diff < 0 ? i + 1 : i - 1);
  };

  const { badge, small, title, btn, stat, statLabel, bg } = slides[i];

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`relative mx-4 mt-4 min-h-[190px] overflow-hidden rounded-[24px] bg-gradient-to-br ${bg} p-5 text-white shadow-lg transition-all duration-500`}
    >
      {/* Orqa fon yorug'liklari */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 left-1/3 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

      {/* Matn */}
      <div
        key={i}
        className="relative z-10"
        style={{ animation: 'heroFadeUp 0.5s ease both' }}
      >
        <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-sm">
          {badge}
        </span>
        <small className="mt-2 block text-[13px] opacity-80">{small}</small>
        <h3 className="mb-4 mt-1 max-w-[58%] text-[21px] font-extrabold leading-tight">
          {title}
        </h3>
        <button className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black shadow-md transition-transform active:scale-95">
          {btn} →
        </button>
      </div>

      {/* O'ngdagi katta raqam kompozitsiyasi */}
      <div
        key={`s${i}`}
        className="pointer-events-none absolute right-4 top-1/2 z-10 grid h-[128px] w-[128px] -translate-y-1/2 place-items-center"
        style={{ animation: 'heroFadeUp 0.6s ease both' }}
      >
        {/* Tashqi halqa */}
        <div className="absolute inset-0 rounded-full border border-dashed border-white/40 [animation:spin_18s_linear_infinite]" />
        {/* Ichki shisha doira */}
        <div className="absolute inset-3 rounded-full border border-white/25 bg-white/10 shadow-[inset_0_0_24px_rgba(255,255,255,0.15)] backdrop-blur-sm" />
        {/* Raqam */}
        <div className="relative text-center leading-none">
          <div className="text-[34px] font-black tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
            {stat}
          </div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider opacity-80">
            {statLabel}
          </div>
        </div>
      </div>

      {/* Progress indikator */}
      <div className="absolute bottom-3 left-5 z-10 flex gap-1.5">
        {slides.map((_, k) => (
          <button
            key={k}
            onClick={() => go(k)}
            aria-label={`${k + 1}-slayd`}
            className="relative h-[6px] w-6 overflow-hidden rounded-full bg-white/30"
          >
            {k === i && (
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{ animation: `heroBar ${DELAY}ms linear forwards` }}
              />
            )}
            {k < i && <span className="absolute inset-0 rounded-full bg-white" />}
          </button>
        ))}
      </div>
    </div>
  );
}