import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home/Home";
import Like from "./pages/like/Like";
import Profile from "./pages/profile/Profile";
import Cart from "./pages/cart/Cart";

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

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const toggleLike = (product) => {
    setLikes((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
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
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const likeCount = likes.length;

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onAdd={addToCart}
              likes={likes}
              onLike={toggleLike}
              cartCount={cartCount}
              decreaseQty={decreaseQty}
              cart={cart}
            />
          }
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
        <Route
          path="/profile"
          element={<Profile cartCount={cartCount} likeCount={likeCount} />}
        />
      </Routes>
      <BottomNav cartCount={cartCount} likeCount={likeCount} />
    </>
  );
}