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
    <div
      style={{ paddingTop: "calc(var(--safe-top) + 1.5rem)" }}
      className="mx-auto max-w-[560px] px-4 pb-28"
    >
      {/* Yuqori karta */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#6d28d9] p-5 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />

        <div className="relative flex items-center gap-4">
          <div className="rounded-full bg-white/30 p-[2px]">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#db4444] to-[#ff8a5c] text-3xl font-bold">
              {photo ? (
                <img src={photo} alt="" className="h-full w-full object-cover" />
              ) : (
                fullName.charAt(0).toUpperCase()
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-extrabold">{fullName}</h1>
            {user?.username && (
              <p className="text-sm opacity-80">@{user.username}</p>
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