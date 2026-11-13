import { useState } from "react";
import Navbar from "../../components/Navbar";
import ProductGrid from "../Home/ProductGrid";

export default function SearchPage({
  cart,
  likes,
  onAdd,
  onLike,
  decreaseQty,
}) {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto max-w-[560px] pb-28">
      <Navbar query={query} onQuery={setQuery} autoFocus />
      <ProductGrid
        query={query}
        cart={cart}
        likes={likes}
        onAdd={onAdd}
        onLike={onLike}
        decreaseQty={decreaseQty}
      />
    </div>
  );
}