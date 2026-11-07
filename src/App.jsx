import { Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/home/home";
// Sahifalar hali yozilmagan, vaqtincha shu belgi turadi
function Soon({ title }) {
  return (
    <div className="px-4 py-20 text-center text-xl text-[var(--hint)]">
      {title} (tez orada)
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Soon title="Katalog" />} />
        <Route path="/cart" element={<Soon title="Savat" />} />
        <Route path="/like" element={<Soon title="Sevimlilar" />} />
        <Route path="/profile" element={<Soon title="Profil" />} />
      </Routes>
      <BottomNav />
    </>
  );
}
