import Card from "../../components/Card";

// Hozircha vaqtincha ro‘yxat. Backend kelganda shu massiv o‘rniga serverdan kelgan ma’lumot qo‘yiladi.
const products = [
  { id: 1, title: 'Erkaklar shimlari, chinoslar Duduka Trends', price: 100, oldPrice: null, rating: 3, reviews: 12, img: '' },
  { id: 2, title: 'Fudbolka taby paxtadan', price: 80, oldPrice: 100, rating: 4, reviews: 30, img: '' },
  { id: 3, title: 'Simsiz naushnik P9 MAX, mikrofonli', price: 55, oldPrice: 70, rating: 3, reviews: 8, img: '' },
  { id: 4, title: 'Smartfon Samsung Galaxy A05s 4 GB RAM, 128 GB', price: 320, oldPrice: 400, rating: 5, reviews: 54, img: '' },
];

export default function ProductGrid({ title = 'Bugungi takliflar' }) {
  return (
    <section className="mt-5">
      <h2 className="px-4 pb-2.5 text-lg font-bold">{title}</h2>
      <div className="grid grid-cols-2 gap-3 px-4">
        {products.map((p) => (
          <Card key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}