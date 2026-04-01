import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

const StaffProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchProducts(); }, [search]);

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll({ search });
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="search-bar">
          <FiSearch />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No products found</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="font-medium">{product.name}</td>
                      <td><code>{product.sku}</code></td>
                      <td><span className="badge badge-info">{product.category}</span></td>
                      <td>${Number(product.price).toFixed(2)}</td>
                      <td className={product.quantity <= product.min_stock_level ? 'text-danger font-bold' : ''}>{product.quantity}</td>
                      <td>
                        <span className={`badge ${product.quantity === 0 ? 'badge-danger' : product.quantity <= product.min_stock_level ? 'badge-warning' : 'badge-success'}`}>
                          {product.quantity === 0 ? 'Out of Stock' : product.quantity <= product.min_stock_level ? 'Low' : 'In Stock'}
                        </span>
                      </td>
                      <td>{product.supplier_name || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffProducts;
