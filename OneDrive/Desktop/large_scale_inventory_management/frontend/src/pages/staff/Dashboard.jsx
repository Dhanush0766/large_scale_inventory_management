import { useState, useEffect } from 'react';
import { dashboardAPI, productsAPI } from '../../services/api';
import { FiBox, FiAlertTriangle, FiTruck, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, lowStockRes] = await Promise.all([
        dashboardAPI.getStats(),
        productsAPI.getLowStock()
      ]);
      setStats(statsRes.data);
      setLowStock(lowStockRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner large"></div></div>;
  }

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: <FiBox />, color: 'blue' },
    { title: 'Low Stock Alerts', value: stats?.lowStockItems || 0, icon: <FiAlertTriangle />, color: 'red' },
    { title: 'Active Suppliers', value: stats?.totalSuppliers || 0, icon: <FiTruck />, color: 'green' },
    { title: 'Inventory Value', value: `$${Number(stats?.inventoryValue || 0).toLocaleString()}`, icon: <FiDollarSign />, color: 'teal' },
  ];

  return (
    <div className="dashboard">
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className={`stat-card stat-${card.color}`}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-info">
              <h3>{card.value}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="table-card">
          <h3><FiAlertTriangle className="text-warning" /> Low Stock Alerts</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Min Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium">{item.name}</td>
                    <td><code>{item.sku}</code></td>
                    <td>{item.category}</td>
                    <td className="text-danger font-bold">{item.quantity}</td>
                    <td>{item.min_stock_level}</td>
                    <td>
                      <span className={`badge ${item.quantity === 0 ? 'badge-danger' : 'badge-warning'}`}>
                        {item.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
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

export default StaffDashboard;
