import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaHeadset,
  FaChevronRight,
  FaUserEdit,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaPhoneAlt,
  FaCity,
  FaStar,
} from "react-icons/fa";
import { useTelegram } from "../../hooks/useTelegram";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import Sheet from "../../components/Sheet";
import HelpSheet from "../../components/HelpSheet";

const CITIES = [
  "Toshkent",
  "Samarqand",
  "Buxoro",
  "Andijon",
  "Namangan",
  "Farg'ona",
  "Qarshi",
  "Nukus",
];
const ADDRESS_TAGS = ["Uy", "Ish", "Boshqa"];

// Dizaynni brauzerda Premium holatida ko'rish uchun vaqtincha true qiling.
// Tayyor bo'lgach albatta false qilib qo'ying.
const PREVIEW_PREMIUM = false;

// Karta fonini to'liq qoplaydigan yulduzchalar naqshi
const STAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><g fill="white" fill-opacity="0.16"><path d="M18 6l3 6.1 6.7 1-4.9 4.7 1.2 6.7L18 21.3l-6 3.2 1.2-6.7-4.9-4.7 6.7-1z"/><path d="M54 42l3 6.1 6.7 1-4.9 4.7 1.2 6.7L54 57.3l-6 3.2 1.2-6.7-4.9-4.7 6.7-1z"/></g></svg>`;
const STAR_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(STAR_SVG)}")`;

// Karta fonidagi suzib yuruvchi bezaklar (faqat fon, matn ustiga chiqmaydi)
const FLOATERS = [
  { icon: "🎁", top: "8%", right: "6%", size: 22, delay: "0s" },
  { icon: "💎", top: "36%", right: "15%", size: 20, delay: "0.6s" },
  { icon: "🔮", top: "56%", right: "5%", size: 20, delay: "1.2s" },
  { icon: "✨", top: "10%", right: "26%", size: 16, delay: "1.8s" },
];

// 901234567 -> +998 90 123 45 67
const formatPhone = (d) => {
  if (!d) return "";
  const p = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)];
  return "+998 " + p.filter(Boolean).join(" ");
};

const inputCls =
  "w-full rounded-xl bg-[var(--bg)] px-3.5 py-3 text-[15px] outline-none ring-2 ring-transparent transition focus:ring-[var(--accent)]/40";

export default function Profile({ cartCount = 0, likeCount = 0 }) {
  const { user, name, photo, haptic } = useTelegram();

  // Telegram Premium foydalanuvchisimi
  const isPremium = PREVIEW_PREMIUM || !!user?.is_premium;

  const [profile, setProfile] = useLocalStorage("profile", {
    name: "",
    phone: "",
    city: "",
  });
  const [addresses, setAddresses] = useLocalStorage("addresses", []);

  const [sheet, setSheet] = useState(null); // 'edit' | 'address' | 'help' | null
  const [toast, setToast] = useState("");

  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState({});

  const [tag, setTag] = useState("Uy");
  const [addrText, setAddrText] = useState("");

  const tgName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    name ||
    "Mehmon";
  const fullName = profile.name || tgName;

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2000);
  };

  const openEdit = () => {
    haptic?.();
    setDraft({ ...profile, name: profile.name || tgName });
    setErrors({});
    setSheet("edit");
  };

  const saveProfile = () => {
    const e = {};
    if (draft.name.trim().length < 2) e.name = "Ism kamida 2 ta harf bo'lsin";
    if (draft.phone && draft.phone.length !== 9)
      e.phone = "Telefon raqami to'liq emas";
    setErrors(e);
    if (Object.keys(e).length) return;

    setProfile({ ...draft, name: draft.name.trim() });
    setSheet(null);
    showToast("Profil saqlandi ✓");
  };

  const addAddress = () => {
    if (addrText.trim().length < 5) {
      showToast("Manzilni to'liqroq yozing");
      return;
    }
    setAddresses((prev) => [
      ...prev,
      { id: Date.now(), tag, text: addrText.trim() },
    ]);
    setAddrText("");
    showToast("Manzil qo'shildi ✓");
  };

  const removeAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const openHelp = () => {
    haptic?.();
    setSheet("help");
  };

  const menu = [
    {
      id: 1,
      title: "Buyurtmalarim",
      hint: "Tez orada",
      Icon: FaBoxOpen,
      onClick: () => showToast("Buyurtmalar tez orada"),
    },
    {
      id: 2,
      title: "Manzillarim",
      hint: addresses.length ? `${addresses.length} ta` : "Qo'shish",
      Icon: FaMapMarkerAlt,
      onClick: () => {
        haptic?.();
        setSheet("address");
      },
    },
    {
      id: 3,
      title: "Yordam",
      hint: "",
      Icon: FaHeadset,
      onClick: openHelp,
    },
  ];

  return (
    <div className="mx-auto max-w-[560px] px-4 pb-28 pt-6">
      {/* Bezak animatsiyalari */}
      <style>{`
        @keyframes premiumFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes premiumShine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes starDrift {
          to { background-position: 72px 72px; }
        }
      `}</style>

      {/* Yuqori karta */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8a44d6] via-[#a45fe2] to-[#bb7cea] p-5 text-white shadow-lg">
        {/* Butun fonni qoplovchi yulduzchalar naqshi */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: STAR_PATTERN,
            backgroundSize: "72px 72px",
            animation: "starDrift 40s linear infinite",
          }}
        />

        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/25 blur-2xl" />

        {/* Fondagi suzib yuruvchi bezaklar */}
        {FLOATERS.map((f, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute grid select-none place-items-center rounded-full bg-white/15"
            style={{
              top: f.top,
              right: f.right,
              width: f.size * 1.7,
              height: f.size * 1.7,
              fontSize: f.size,
              boxShadow: "0 0 18px rgba(255,255,255,0.35)",
              animation: `premiumFloat 3.2s ease-in-out ${f.delay} infinite`,
            }}
          >
            {f.icon}
          </span>
        ))}

        <div className="relative flex items-center gap-4">
          <div
            className={`rounded-full p-[2px] ${
              isPremium
                ? "bg-gradient-to-br from-[#6d8bff] via-[#b46cff] to-[#ff8ad8]"
                : "bg-white/30"
            }`}
          >
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#db4444] to-[#ff8a5c] text-3xl font-bold">
              {photo ? (
                <img src={photo} alt="" className="h-full w-full object-cover" />
              ) : (
                fullName.charAt(0).toUpperCase()
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-1.5 text-xl font-extrabold">
              <span className="truncate">{fullName}</span>
              {isPremium && (
                <span
                  title="Telegram Premium"
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#6d8bff] to-[#b46cff] text-white"
                >
                  <FaStar size={11} />
                </span>
              )}
            </h1>
            {user?.username && (
              <p className="text-sm opacity-80">@{user.username}</p>
            )}
            {isPremium && (
              <span
                className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                style={{
                  background:
                    "linear-gradient(90deg, #6d8bff, #b46cff, #ff8ad8, #6d8bff)",
                  backgroundSize: "200% 100%",
                  animation: "premiumShine 3s linear infinite",
                }}
              >
                Premium
              </span>
            )}
            {profile.phone && (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs opacity-80">
                <FaPhoneAlt size={10} /> {formatPhone(profile.phone)}
              </p>
            )}
            {profile.city && (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs opacity-80">
                <FaCity size={10} /> {profile.city}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={openEdit}
          className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-black transition-transform active:scale-[0.98]"
        >
          <FaUserEdit /> Profilni tahrirlash
        </button>
      </div>

      {/* Statistika */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          to="/cart"
          className="rounded-2xl bg-[var(--card)] py-4 text-center transition-transform active:scale-[0.98]"
        >
          <b className="block text-2xl">{cartCount}</b>
          <span className="text-sm text-[var(--hint)]">Savatda</span>
        </Link>
        <Link
          to="/like"
          className="rounded-2xl bg-[var(--card)] py-4 text-center transition-transform active:scale-[0.98]"
        >
          <b className="block text-2xl">{likeCount}</b>
          <span className="text-sm text-[var(--hint)]">Sevimli</span>
        </Link>
      </div>

      {/* Menyu */}
      <div className="mt-5 flex flex-col gap-2">
        {menu.map(({ id, title, hint, Icon, onClick }) => (
          <button
            key={id}
            onClick={onClick}
            className="flex items-center gap-3 rounded-2xl bg-[var(--card)] px-4 py-3.5 text-left transition-transform active:scale-[0.98]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
              <Icon size={16} />
            </span>
            <span className="flex-1 font-medium">{title}</span>
            {hint && <span className="text-xs text-[var(--hint)]">{hint}</span>}
            <FaChevronRight size={12} className="text-[var(--hint)]" />
          </button>
        ))}
      </div>

      {!user && (
        <p className="mt-6 text-center text-xs text-[var(--hint)]">
          Brauzerda ochilgani uchun Telegram ma'lumotlari ko'rinmayapti.
          Telegram ichida ism va rasm chiqadi.
        </p>
      )}

      {/* Tahrirlash oynasi */}
      <Sheet
        open={sheet === "edit"}
        title="Profilni tahrirlash"
        onClose={() => setSheet(null)}
      >
        <div className="flex flex-col gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-[var(--hint)]">Ism</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Ismingiz"
              maxLength={40}
              className={inputCls}
            />
            {errors.name && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.name}
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-[var(--hint)]">
              Telefon
            </span>
            <div className="flex items-center gap-2 rounded-xl bg-[var(--bg)] px-3.5 ring-2 ring-transparent transition focus-within:ring-[var(--accent)]/40">
              <span className="text-[15px] text-[var(--hint)]">+998</span>
              <input
                value={draft.phone}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    phone: e.target.value.replace(/\D/g, "").slice(0, 9),
                  })
                }
                inputMode="numeric"
                placeholder="90 123 45 67"
                className="w-full bg-transparent py-3 text-[15px] outline-none"
              />
            </div>
            {errors.phone && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.phone}
              </span>
            )}
          </label>

          <div>
            <span className="mb-1.5 block text-sm text-[var(--hint)]">
              Shahar
            </span>
            <div className="flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDraft({ ...draft, city: c })}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                    draft.city === c
                      ? "bg-[var(--accent)] font-bold text-white"
                      : "bg-[var(--bg)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={saveProfile}
            className="mt-1 w-full rounded-xl bg-[var(--accent)] py-3 font-bold text-white transition-transform active:scale-[0.98]"
          >
            Saqlash
          </button>
        </div>
      </Sheet>

      {/* Manzillar oynasi */}
      <Sheet
        open={sheet === "address"}
        title="Manzillarim"
        onClose={() => setSheet(null)}
      >
        <div className="flex flex-col gap-2">
          {addresses.length === 0 && (
            <p className="py-4 text-center text-sm text-[var(--hint)]">
              Hozircha manzil yo'q
            </p>
          )}

          {addresses.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-2xl bg-[var(--bg)] p-3"
            >
              <FaCheckCircle className="shrink-0 text-[var(--accent)]" />
              <div className="min-w-0 flex-1">
                <b className="text-sm">{a.tag}</b>
                <p className="text-sm text-[var(--hint)]">{a.text}</p>
              </div>
              <button
                onClick={() => removeAddress(a.id)}
                aria-label="O'chirish"
                className="grid h-9 w-9 place-items-center rounded-full text-red-600"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-black/5 pt-4">
          <span className="mb-2 block text-sm font-bold">Yangi manzil</span>

          <div className="mb-3 flex gap-2">
            {ADDRESS_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                  tag === t
                    ? "bg-[var(--accent)] font-bold text-white"
                    : "bg-[var(--bg)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            value={addrText}
            onChange={(e) => setAddrText(e.target.value)}
            placeholder="Ko'cha, uy, xonadon"
            className={inputCls}
          />

          <button
            onClick={addAddress}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 font-bold text-white transition-transform active:scale-[0.98]"
          >
            <FaPlus size={12} /> Manzil qo'shish
          </button>
        </div>
      </Sheet>

      {/* Yordam oynasi */}
      <HelpSheet open={sheet === "help"} onClose={() => setSheet(null)} />

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-black/85 px-4 py-2 text-sm text-white shadow-lg"
          style={{ animation: "toastIn 0.25s ease both" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}