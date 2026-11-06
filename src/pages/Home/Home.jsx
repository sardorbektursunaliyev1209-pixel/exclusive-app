import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Hero from './Hero';
import Categories from './Categories';
import ProductGrid from './ProductGrid';

export default function Home() {
  const [query, setQuery] = useState('');

  return (
    <div className="mx-auto max-w-[560px] pb-24">
      <Navbar query={query} onQuery={setQuery} />
      <Hero />
      <Categories />
      <ProductGrid />
    </div>
  );
}