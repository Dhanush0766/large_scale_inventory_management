import { useEffect, useState } from "react";
import { API } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    product_name: "",
    category: "",
    unit_price: ""
  });

  // FETCH PRODUCTS
  const fetchProducts = () => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // HANDLE FORM SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    API.post("/products", form)
      .then(() => {
        alert("Product Added ✅");
        setForm({ product_name: "", category: "", unit_price: "" });
        fetchProducts(); // refresh without reload
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.product_name}
          onChange={(e) =>
            setForm({ ...form, product_name: e.target.value })
          }
        />
        <br />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />
        <br />

        <input
          placeholder="Price"
          value={form.unit_price}
          onChange={(e) =>
            setForm({ ...form, unit_price: e.target.value })
          }
        />
        <br />

        <button type="submit">Add Product</button>
      </form>

      <hr />

      {/* PRODUCT LIST */}
      {products.map((p) => (
        <div key={p.product_id}>
          {p.product_name} - ₹{p.unit_price}
        </div>
      ))}
    </div>
  );
}

export default Products;