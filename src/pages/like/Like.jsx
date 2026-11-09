import Card from "../../components/Card";

export default function Like({ likes, onLike, onAdd }) {
  if (likes.length === 0) {
    return <div className="px-4 py-24 text-center text-[var(--hint)]">Sevimli mahsulotlar yo'q</div>;
  }

  return (
    <div className="mx-auto max-w-[560px] px-4 pt-4 pb-24">
      <h1 className="mb-4 text-xl font-bold">Sevimlilar</h1>
      <div className="grid grid-cols-2 gap-3">
        {likes.map((p) => (
          <Card key={p.id} product={p} liked={true} onLike={onLike} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}