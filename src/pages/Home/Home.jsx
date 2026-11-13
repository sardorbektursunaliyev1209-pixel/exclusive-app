import { useState } from "react";
import Navbar from "../../components/Navbar";
import Hero from "./Hero";
import Categories from "./Categories";
import ProductGrid from "./ProductGrid";

export default function Home({ onAdd, likes = [],cart=[], onLike, cartCount = 0 , decreaseQty}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);     

  return (
    <div className="mx-auto max-w-[560px] pb-24 mt-4">
      <Navbar
        query={query}
        onQuery={setQuery}
        cartCount={cartCount}
        likeCount={likes.length}
      />
      <Hero />
      <Categories active={category} onSelect={setCategory} />
      <ProductGrid
        onAdd={onAdd}
        decreaseQty={decreaseQty}
        likes={likes}
        onLike={onLike}
        query={query}
        category={category}
        cart={cart}
      />
    </div>
  );
}