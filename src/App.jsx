import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home/Home";
import Like from "./pages/like/Like";
import Profile from "./pages/profile/Profile";
import Cart from "./pages/cart/Cart";
import ProductDetail from "./pages/product/ProductDetail";
import { useLocalStorage } from "./hooks/useLocalStorage";

function Soon({ title }) {
  return (
    <div className="px-4 py-20 text-center text-xl text-[var(--hint)]">
      {title} (tez orada)
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useLocalStorage("cart", []);
  const [likes, setLikes] = useLocalStorage("likes", []);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Telegram tayyor bo'lishi
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
  }, []);

  // Telegram BackButton
  useEffect(() => {
    const back = window.Telegram?.WebApp?.BackButton;
    if (!back) return;

    if (pathname === "/") {
      back.hide();
      return;
    }

    const goBack = () => navigate(-1);
    back.show();
    back.onClick(goBack);

    return () => back.offClick(goBack);
  }, [pathname, navigate]);

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

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const toggleLike = (product) => {
    setLikes((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const likeCount = likes.length;

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
          path="/product/:id"
          element={
            <ProductDetail
              cart={cart}
              likes={likes}
              onAdd={addToCart}
              onLike={toggleLike}
              decreaseQty={decreaseQty}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart cart={cart} onRemove={removeFromCart} onClear={clearCart} />
          }
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