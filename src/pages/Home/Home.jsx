import { useState } from "react";
import Navbar from "../../components/Navbar";
import Hero from "./Hero";
import Categories from "./Categories";
import ProductGrid from "./ProductGrid";

export default function Home({ onAdd, likes = [], onLike, cartCount = 0 }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);     

  return (
    <div className="mx-auto max-w-[560px] pb-24">
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
        likes={likes}
        onLike={onLike}
        query={query}
        category={category}
      />
    </div>
  );
}