import { useState, useEffect } from 'react';
import { productsAPI, suppliersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiFilter } from 'react-icons/fi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', sku: '', category: '', price: '', 
    quantity: '', min_stock_level: '10', supplier_id: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchCategories();
  }, [search, categoryFilter]);

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll({ search, category: categoryFilter });
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await suppliersAPI.getAll();
      setSuppliers(res.data);
    } catch (error) {
      console.error('Failed to load suppliers');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await productsAPI.getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        name: product.name, description: product.description || '',
        sku: product.sku, category: product.category || '',
        price: product.price, quantity: product.quantity,
        min_stock_level: product.min_stock_level, supplier_id: product.supplier_id || ''
      });
    } else {
      setEditProduct(null);
      setFormData({
        name: '', description: '', sku: '', category: '', price: '',
        quantity: '', min_stock_level: '10', supplier_id: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await productsAPI.update(editProduct.id, formData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(formData);
        toast.success('Product created successfully');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="header-actions">
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FiPlus /> Add Product
          </button>
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
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="8" className="text-center">No products found</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-name">
                          <strong>{product.name}</strong>
                          {product.description && <small>{product.description.substring(0, 50)}...</small>}
                        </div>
                      </td>
                      <td><code>{product.sku}</code></td>
                      <td><span className="badge badge-info">{product.category}</span></td>
                      <td className="font-medium">${Number(product.price).toFixed(2)}</td>
                      <td className={product.quantity <= product.min_stock_level ? 'text-danger font-bold' : ''}>
                        {product.quantity}
                      </td>
                      <td>{product.supplier_name || '—'}</td>
                      <td>
                        <span className={`badge ${product.quantity === 0 ? 'badge-danger' : product.quantity <= product.min_stock_level ? 'badge-warning' : 'badge-success'}`}>
                          {product.quantity === 0 ? 'Out of Stock' : product.quantity <= product.min_stock_level ? 'Low' : 'In Stock'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-icon btn-edit" onClick={() => openModal(product)} title="Edit">
                            <FiEdit2 />
                          </button>
                          <button className="btn-icon btn-delete" onClick={() => handleDelete(product.id, product.name)} title="Delete">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>SKU *</label>
                  <input type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Electronics" />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Min Stock Level</label>
                  <input type="number" value={formData.min_stock_level} onChange={(e) => setFormData({...formData, min_stock_level: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <select value={formData.supplier_id} onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}>
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editProduct ? 'Update' : 'Create'} Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
