import { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiDownload, FiAlertTriangle, FiFileText } from 'react-icons/fi';

const Reports = () => {
  const [inventoryReport, setInventoryReport] = useState([]);
  const [lowStockReport, setLowStockReport] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const [invRes, lowRes] = await Promise.all([
        reportsAPI.getInventory(),
        reportsAPI.getLowStock()
      ]);
      setInventoryReport(invRes.data);
      setLowStockReport(lowRes.data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async (type) => {
    try {
      const res = await reportsAPI.exportCSV(type);
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type || 'inventory'}_report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const totalValue = inventoryReport.reduce((sum, item) => sum + Number(item.total_value || 0), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="tab-nav">
          <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            <FiFileText /> Inventory Report
          </button>
          <button className={`tab-btn ${activeTab === 'lowstock' ? 'active' : ''}`} onClick={() => setActiveTab('lowstock')}>
            <FiAlertTriangle /> Low Stock Report
          </button>
        </div>
        <div className="header-actions">
          <button className="btn btn-success" onClick={() => handleExportCSV(activeTab === 'lowstock' ? 'low-stock' : 'inventory')}>
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : activeTab === 'inventory' ? (
        <div className="table-card">
          <div className="report-summary">
            <div className="summary-item">
              <span>Total Items</span>
              <strong>{inventoryReport.length}</strong>
            </div>
            <div className="summary-item">
              <span>Total Inventory Value</span>
              <strong>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Min Level</th>
                  <th>Total Value</th>
                  <th>Status</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {inventoryReport.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium">{item.name}</td>
                    <td><code>{item.sku}</code></td>
                    <td>{item.category}</td>
                    <td>${Number(item.price).toFixed(2)}</td>
                    <td className={item.stock_status === 'Low' ? 'text-danger font-bold' : ''}>{item.quantity}</td>
                    <td>{item.min_stock_level}</td>
                    <td className="font-medium">${Number(item.total_value).toFixed(2)}</td>
                    <td><span className={`badge ${item.stock_status === 'Low' ? 'badge-danger' : 'badge-success'}`}>{item.stock_status}</span></td>
                    <td>{item.supplier_name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="table-card">
          <div className="report-summary">
            <div className="summary-item">
              <span>Low Stock Items</span>
              <strong className="text-danger">{lowStockReport.length}</strong>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Min Level</th>
                  <th>Deficit</th>
                  <th>Supplier</th>
                  <th>Supplier Contact</th>
                </tr>
              </thead>
              <tbody>
                {lowStockReport.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium">{item.name}</td>
                    <td><code>{item.sku}</code></td>
                    <td>{item.category}</td>
                    <td className="text-danger font-bold">{item.quantity}</td>
                    <td>{item.min_stock_level}</td>
                    <td className="text-danger font-bold">{item.deficit}</td>
                    <td>{item.supplier_name || '—'}</td>
                    <td>{item.supplier_email || item.supplier_phone || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
