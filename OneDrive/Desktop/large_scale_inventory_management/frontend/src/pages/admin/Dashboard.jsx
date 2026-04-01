import { useState, useEffect } from 'react';
import { dashboardAPI, productsAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FiBox, FiAlertTriangle, FiTruck, FiShoppingCart, FiDollarSign, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#7c3aed'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, chartsRes, lowStockRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getCharts(),
        productsAPI.getLowStock()
      ]);
      setStats(statsRes.data);
      setCharts(chartsRes.data);
      setLowStock(lowStockRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner large"></div></div>;
  }

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: <FiBox />, color: 'blue' },
    { title: 'Low Stock Items', value: stats?.lowStockItems || 0, icon: <FiAlertTriangle />, color: 'red' },
    { title: 'Active Suppliers', value: stats?.totalSuppliers || 0, icon: <FiTruck />, color: 'green' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingCart />, color: 'purple' },
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: <FiClock />, color: 'orange' },
    { title: 'Inventory Value', value: `$${Number(stats?.inventoryValue || 0).toLocaleString()}`, icon: <FiDollarSign />, color: 'teal' },
  ];

  return (
    <div className="dashboard">
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className={`stat-card stat-${card.color}`} style={{ "--animation-order": index }}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-info">
              <h3>{card.value}</h3>
              <p>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card" style={{ "--animation-order": 2 }}>
          <h3>Products by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts?.categoryData || []}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ category, count }) => `${category} (${count})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="category"
              >
                {(charts?.categoryData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card" style={{ "--animation-order": 3 }}>
          <h3>Price Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts?.priceData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range_label" tick={{ fill: '#94a3b8' }} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width" style={{ "--animation-order": 4 }}>
          <h3>Inventory Levels (Top 10)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={charts?.inventoryLevels || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
              <Legend />
              <Area type="monotone" dataKey="quantity" stroke="#6366f1" fill="rgba(99,102,241,0.2)" name="Current Stock" />
              <Area type="monotone" dataKey="min_stock_level" stroke="#ef4444" fill="rgba(239,68,68,0.1)" name="Min Stock Level" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="table-card" style={{ "--animation-order": 5 }}>
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
                {lowStock.map((item, index) => (
                  <tr key={item.id} style={{ "--animation-order": index }}>
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

export default AdminDashboard;
