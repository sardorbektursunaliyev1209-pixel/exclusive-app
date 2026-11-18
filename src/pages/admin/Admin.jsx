import { useEffect, useState } from "react";
import { baseUrl } from "../../services/config";

const emptyForm = {
  title: "",
  price: "",
  discount_price: "",
  category: "",
  description: "",
  picture: "",
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadProducts() {
    try {
      const res = await fetch(`${baseUrl}/product/list/`);
      setProducts(await res.json());
    } catch {
      setMessage("Mahsulotlarni yuklab bo'lmadi");
    }
  }

  async function loadCategories() {
    try {
      const res = await fetch(`${baseUrl}/product/categories/`);
      setCategories(await res.json());
    } catch {
      setCategories([]);
    }
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!adminKey) return setMessage("Admin kalitini kiriting");
    if (!form.title || !form.price) return setMessage("Nomi va narxini kiriting");

    setLoading(true);
    setMessage("");

    const body = {
      title: form.title,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : undefined,
      category: form.category ? Number(form.category) : undefined,
      description: form.description,
      pictures: form.picture ? [form.picture] : [],
    };

    try {
      const res = await fetch(`${baseUrl}/product/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        setMessage("Admin kaliti noto'g'ri");
      } else if (!res.ok) {
        const data = await res.json();
        setMessage(data.message || "Mahsulot qo'shilmadi");
      } else {
        setForm(emptyForm);
        setMessage("Mahsulot qo'shildi");
        loadProducts();
      }
    } catch {
      setMessage("Serverga ulanib bo'lmadi");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, title) {
    if (!adminKey) return setMessage("Admin kalitini kiriting");
    if (!window.confirm(`"${title}" mahsuloti o'chirilsinmi?`)) return;

    try {
      const res = await fetch(`${baseUrl}/product/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });

      if (res.status === 401) {
        setMessage("Admin kaliti noto'g'ri");
      } else if (!res.ok) {
        setMessage("Mahsulot o'chirilmadi");
      } else {
        setMessage("Mahsulot o'chirildi");
        loadProducts();
      }
    } catch {
      setMessage("Serverga ulanib bo'lmadi");
    }
  }

  const input = {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 10,
    border: "1px solid #d9d9d9",
    borderRadius: 8,
    fontSize: 14,
    boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h2 style={{ marginBottom: 16 }}>Admin panel</h2>

      <input
        style={input}
        type="password"
        placeholder="Admin kaliti"
        value={adminKey}
        onChange={(e) => setAdminKey(e.target.value)}
      />

      {message && (
        <p style={{ margin: "0 0 12px", fontWeight: 600 }}>{message}</p>
      )}

      <form onSubmit={handleAdd}>
        <h3 style={{ margin: "16px 0 10px" }}>Yangi mahsulot</h3>
        <input style={input} name="title" placeholder="Nomi" value={form.title} onChange={handleChange} />
        <input style={input} name="price" type="number" placeholder="Narxi" value={form.price} onChange={handleChange} />
        <input style={input} name="discount_price" type="number" placeholder="Chegirmali narxi (ixtiyoriy)" value={form.discount_price} onChange={handleChange} />

        <select style={input} name="category" value={form.category} onChange={handleChange}>
          <option value="">Kategoriya tanlang</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <textarea style={{ ...input, minHeight: 70 }} name="description" placeholder="Tavsif" value={form.description} onChange={handleChange} />
        <input style={input} name="picture" placeholder="Rasm havolasi (https://...)" value={form.picture} onChange={handleChange} />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            border: "none",
            borderRadius: 8,
            background: "#db4444",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "Qo'shilmoqda..." : "Mahsulot qo'shish"}
        </button>
      </form>

      <h3 style={{ margin: "24px 0 10px" }}>Mahsulotlar ({products.length})</h3>

      {products.map((p) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 10,
            marginBottom: 8,
            border: "1px solid #eee",
            borderRadius: 8,
          }}
        >
          {p.pictures?.[0] && (
            <img src={p.pictures[0]} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{p.title}</div>
            <div style={{ fontSize: 13, color: "#666" }}>${p.price}</div>
          </div>
          <button
            onClick={() => handleDelete(p.id, p.title)}
            style={{
              padding: "6px 10px",
              border: "1px solid #db4444",
              borderRadius: 6,
              background: "#fff",
              color: "#db4444",
              cursor: "pointer",
            }}
          >
            O'chirish
          </button>
        </div>
      ))}
    </div>
  );
}