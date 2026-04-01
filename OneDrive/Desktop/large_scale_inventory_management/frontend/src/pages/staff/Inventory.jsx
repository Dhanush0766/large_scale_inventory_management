import { useState, useEffect } from 'react';
import { inventoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

const StaffInventory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => { fetchTransactions(); }, [typeFilter]);

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

  return (
    <div className="page-container">
      <div className="page-header">
        <h3 className="page-subtitle">Inventory Transaction History</h3>
        <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Transactions</option>
          <option value="stock_in">Stock In</option>
          <option value="stock_out">Stock Out</option>
        </select>
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
    </div>
  );
};

export default StaffInventory;
