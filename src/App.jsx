import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/home/home";
import Cart from "./pages/cart/Cart";
import Like from "./pages/like/Like";

function Soon({ title }) {
  return (
    <div className="px-4 py-20 text-center text-xl text-[var(--hint)]">
      {title} (tez orada)
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [likes, setLikes] = useState([]);

  const toggleLike = (product) => {
    setLikes((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        // bor bo'lsa olib tashlaymiz
        return prev.filter((item) => item.id !== product.id);
      }
      // yo'q bo'lsa qo'shamiz
      return [...prev, product];
    });
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home onAdd={addToCart} likes={likes} onLike={toggleLike} />}
        />
        <Route path="/catalog" element={<Soon title="Katalog" />} />
        <Route
          path="/cart"
          element={<Cart cart={cart} onRemove={removeFromCart} />}
        />
        <Route
          path="/like"
          element={<Like likes={likes} onLike={toggleLike} onAdd={addToCart} />}
        />
        <Route path="/profile" element={<Soon title="Profil" />} />
      </Routes>
      <BottomNav cartCount={cartCount} likeCount={likes.length} />
    </>
  );
}