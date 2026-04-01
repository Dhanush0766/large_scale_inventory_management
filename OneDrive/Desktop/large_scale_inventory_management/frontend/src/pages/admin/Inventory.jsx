import { useState, useEffect } from 'react';
import { inventoryAPI, productsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowUp, FiArrowDown, FiFilter } from 'react-icons/fi';

const Inventory = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStockIn, setShowStockIn] = useState(false);
  const [showStockOut, setShowStockOut] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [formData, setFormData] = useState({ product_id: '', quantity: '', notes: '' });

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, [typeFilter]);

  const fetchTransactions = async () => {
    try {
      const res = await inventoryAPI.getTransactions({ type: typeFilter });
      setTransactions(res.data);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to load products');
    }
  };

  const handleStockIn = async (e) => {
    e.preventDefault();
    try {
      await inventoryAPI.stockIn(formData);
      toast.success('Stock added successfully');
      setShowStockIn(false);
      setFormData({ product_id: '', quantity: '', notes: '' });
      fetchTransactions();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Stock in failed');
    }
  };

  const handleStockOut = async (e) => {
    e.preventDefault();
    try {
      await inventoryAPI.stockOut(formData);
      toast.success('Stock removed successfully');
      setShowStockOut(false);
      setFormData({ product_id: '', quantity: '', notes: '' });
      fetchTransactions();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Stock out failed');
    }
  };

  const StockForm = ({ type, onSubmit, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{type === 'in' ? '📦 Stock In' : '📤 Stock Out'}</h3>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit} className="modal-body">
          <div className="form-group">
            <label>Product *</label>
            <select value={formData.product_id} onChange={(e) => setFormData({...formData, product_id: e.target.value})} required>
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity *</label>
            <input type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Optional notes..."></textarea>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn ${type === 'in' ? 'btn-success' : 'btn-danger'}`}>
              {type === 'in' ? 'Add Stock' : 'Remove Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-actions">
          <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Transactions</option>
            <option value="stock_in">Stock In</option>
            <option value="stock_out">Stock Out</option>
          </select>
          <button className="btn btn-success" onClick={() => { setShowStockIn(true); setFormData({ product_id: '', quantity: '', notes: '' }); }}>
            <FiArrowUp /> Stock In
          </button>
          <button className="btn btn-danger" onClick={() => { setShowStockOut(true); setFormData({ product_id: '', quantity: '', notes: '' }); }}>
            <FiArrowDown /> Stock Out
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
                  <th>Date</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Notes</th>
                  <th>Performed By</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No transactions found</td></tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{new Date(t.created_at).toLocaleString()}</td>
                      <td className="font-medium">{t.product_name}</td>
                      <td><code>{t.sku}</code></td>
                      <td>
                        <span className={`badge ${t.type === 'stock_in' ? 'badge-success' : 'badge-danger'}`}>
                          {t.type === 'stock_in' ? '↑ Stock In' : '↓ Stock Out'}
                        </span>
                      </td>
                      <td className="font-bold">{t.quantity}</td>
                      <td>{t.notes || '—'}</td>
                      <td>{t.performed_by_name || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showStockIn && <StockForm type="in" onSubmit={handleStockIn} onClose={() => setShowStockIn(false)} />}
      {showStockOut && <StockForm type="out" onSubmit={handleStockOut} onClose={() => setShowStockOut(false)} />}
    </div>
  );
};

export default Inventory;
