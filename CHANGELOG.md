# 📋 Loyiha O'zgarishlar Tarixi va AI / Dasturchilar uchun Qo'llanma
**Loyiha:** ExcusiveApp (Telegram Mini App E-Commerce)  
**Sana:** 2026-11-14  
**Holat:** Telegram Fullscreen rejimi va u bilan bog'liq vizual xatolar to'liq olib tashlandi va tozalandi.

---

## 1. 📌 Loyiha Haqida Qisqacha (Context for Future AIs)

Ushbu loyiha **Telegram Mini App (TMA)** sifatida ishlovchi internet-do'kon veb-ilovasi.

- **Frontend:** React 19, Vite 8, Tailwind CSS v4, React Router DOM v7, React Icons.
- **Backend / Bot:** Node.js (Express) + grammY Telegram Bot (`bot.js`).
- **Arxitektura:** 
  - Mobil formatga moslangan markaziy konteyner: `mx-auto max-w-[560px]`.
  - Yuqorida `sticky top-0` navigatsiya (`Navbar.jsx` bosh sahifada, `PageHeader.jsx` ichki sahifalarda).
  - Pastda `fixed bottom-0` navigatsiya (`BottomNav.jsx`).
  - Ma'lumotlar localStorage orqali saqlanadi (`useLocalStorage.js`), Telegram WebApp API bilan integratsiya qilingan (`useTelegram.js`).

---

## 2. ⚠️ Muammo Tahlili (Root Cause Analysis)

### Nima yuz bergan edi?
1. Loyihada Telegram WebApp 8.0 versiyasidagi `tg.requestFullscreen()` va `tg.disableVerticalSwipes()` funksiyalari yoqilgan.
2. Fullscreen (telefon to'liq ekrani) rejimida Telegram interfeysi va telefon status bari (soat, batareya, dinamik orol/chuqurcha) sahifa elementlari ustiga chiqib ketgan.
3. Buni to'g'rilash uchun loyihaga `--safe-top` CSS o'zgaruvchisi kiritilib, `Navbar.jsx`, `PageHeader.jsx` va `Profile.jsx` ga sun'iy inline `paddingTop` berilgan.
4. Shunga qaramay bosh sahifada oraliq to'g'ri chiqmagani sababli `Home.jsx` dagi asosiy konteynerga `mt-[60px]` berilgan.
5. **Oqibatda:** 
   - `Navbar` `Home.jsx` ning ichida bo'lgani uchun, sahifa ochilganda Navbar ekranning eng yuqorisidan 60px pastda paydo bo'lib, tepasida katta bo'sh joy qolib ketgan.
   - Oddiy brauzerda ham, Telegram ichida ham dizayn buzilib, juda noqulay va g'alati holatga kelib qolgan.
   - Foydalanuvchi uchun fullscreen rejimi mini-applarda yopishni qiyinlashtirgan.

---

## 3. 🛠 Amalga Oshirilgan Tuzatishlar (Changes Made)

Quyidagi fayllardagi fullscreen moslamalari va ularning asoratlari to'liq olib tashlandi:

### 1) `src/App.jsx`
- ❌ Olib tashlandi: `tg.requestFullscreen?.()` va `tg.disableVerticalSwipes()`.
- ➕ Qo'shildi: `if (tg.isFullscreen) tg.exitFullscreen?.();` (agar foydalanuvchi qurilmasida ilova avval fullscreen rejimda keshlanib qolgan bo'lsa, avtomatik normal holatga qaytaradi).
- 🔄 To'g'rilandi: `SearchPage` importi fayl nomiga to'g'rilandi.

### 2) `src/pages/Home/Home.jsx`
- ❌ Olib tashlandi: `mt-[60px]` sun'iy margin.
- 🔄 Qaytarildi: `<div className="mx-auto max-w-[560px] pb-24">`. Endi `Navbar` ekranning tepa qismiga toza yopishadi va ortiqcha bo'shliqlar yo'q.

### 3) `src/components/Navbar.jsx`
- ❌ Olib tashlandi: `style={{ paddingTop: "calc(var(--safe-top) + 0.875rem)" }}`.
- 🔄 Qaytarildi: `className="sticky top-0 z-40 rounded-b-[28px] bg-[var(--card)]/90 px-4 pb-4 pt-3.5 shadow-[0_8px_28px_rgba(0,0,0,0.07)] backdrop-blur-md"`.

### 4) `src/components/PageHeader.jsx`
- ❌ Olib tashlandi: `style={{ paddingTop: "calc(var(--safe-top) + 0.75rem)" }}`.
- 🔄 Qaytarildi: `className="sticky top-0 z-30 -mx-4 mb-3 flex items-center gap-3 bg-[var(--bg)]/90 px-4 py-3 backdrop-blur-md"`.

### 5) `src/pages/profile/Profile.jsx`
- ❌ Olib tashlandi: `style={{ paddingTop: "calc(var(--safe-top) + 1.5rem)" }}`.
- 🔄 Qaytarildi: `className="mx-auto max-w-[560px] px-4 pb-28 pt-6"`.

### 6) `src/index.css`
- ❌ Olib tashlandi: `:root` ichidagi `--safe-top` kalkulyatsiyasi.
- ❌ Olib tashlandi: `overscroll-behavior: none` (brauzerlarda tabiiy harakatni cheklab qo'ygan edi).
- 🔄 Qaytarildi: Toza fon va balandlik (`min-height: 100vh`).

---

## 4. 🧭 Keyingi AI / Dasturchilar uchun Muhim Qoidalar (Guidelines)

Kelajakda ushbu loyihada ishlaydigan har qanday AI yoki dasturchi quyidagilarga amal qilishi shart:

1. **Telegram WebApp Fullscreen rejimini QAYTA YOQMANG:**
   - Mini App Telegram'ning standart `tg.expand()` rejimida ishlashi kerak.
   - `tg.requestFullscreen()` yoki `tg.disableVerticalSwipes()` chaqirmang. Bu TMA standart foydalanuvchi tajribasini (UX) buzadi.

2. **Top Margin va Paddinglar:**
   - Bosh sahifa konteyneriga (`Home.jsx`) hech qachon `mt-[...]` yoki `mt-8` bermang.
   - `Navbar` va `PageHeader` `sticky top-0` holatida turadi va o'zining ichki `pt-3.5` / `py-3` paddingiga ega.

3. **Konteyner kengligi:**
   - Barcha sahifalar `mx-auto max-w-[560px]` kengligida bo'lishi kerak. Bu mobil qurilmalarda ham, desktop brauzerlarida ham qulay ko'rinish beradi.

4. **Orqaga qaytish mexanizmi (Back Button):**
   - Telegram ichida `tg.BackButton` ishlaydi (`App.jsx` da boshqariladi).
   - Tashqi brauzerda esa `PageHeader.jsx` ichidagi orqaga strelka ko'rinadi (`!hasTgBack` sharti bilan).

---

## 5. ✅ Tekshiruv Natijasi
- `npm run build`: Muvaffaqiyatli (xatolarsiz yig'ildi).
- `npm run lint`: 0 ta xato (oxlint orqali tekshirildi).
