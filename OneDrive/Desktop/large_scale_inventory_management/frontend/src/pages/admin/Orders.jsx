import { useState, useEffect } from 'react';
import { ordersAPI, suppliersAPI, productsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEye, FiTrash2, FiX, FiTruck } from 'react-icons/fi';

const statusColors = {
  pending: 'badge-warning',
  confirmed: 'badge-info',
  shipped: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({ supplier_id: '', notes: '', items: [{ product_id: '', quantity: '', unit_price: '' }] });

  useEffect(() => { fetchOrders(); fetchSuppliers(); fetchProducts(); }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const res = await ordersAPI.getAll({ status: statusFilter });
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try { const res = await suppliersAPI.getAll(); setSuppliers(res.data); } catch (e) {}
  };

  const fetchProducts = async () => {
    try { const res = await productsAPI.getAll(); setProducts(res.data); } catch (e) {}
  };

  const viewDetails = async (id) => {
    try {
      const res = await ordersAPI.getById(id);
      setShowDetail(res.data);
    } catch (error) {
      toast.error('Failed to load order details');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
      if (showDetail) viewDetails(id);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.create(formData);
      toast.success('Order created');
      setShowModal(false);
      setFormData({ supplier_id: '', notes: '', items: [{ product_id: '', quantity: '', unit_price: '' }] });
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    }
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { product_id: '', quantity: '', unit_price: '' }] });
  };

  const updateItem = (index, field, value) => {
    const items = [...formData.items];
    items[index][field] = value;
    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === parseInt(value));
      if (product) items[index].unit_price = product.price;
    }
    setFormData({ ...formData, items });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this order?')) {
      try {
        await ordersAPI.delete(id);
        toast.success('Order deleted');
        fetchOrders();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> New Order
        </button>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">No orders found</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-medium">{order.order_number}</td>
                      <td>{order.supplier_name || '—'}</td>
                      <td>
                        <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                      </td>
                      <td className="font-medium">${Number(order.total_amount).toFixed(2)}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-icon btn-view" onClick={() => viewDetails(order.id)} title="View"><FiEye /></button>
                          <button className="btn-icon btn-delete" onClick={() => handleDelete(order.id)} title="Delete"><FiTrash2 /></button>
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

      {/* Order Detail Modal */}
      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order {showDetail.order_number}</h3>
              <button className="btn-icon" onClick={() => setShowDetail(null)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div><strong>Supplier:</strong> {showDetail.supplier_name}</div>
                <div><strong>Status:</strong> <span className={`badge ${statusColors[showDetail.status]}`}>{showDetail.status}</span></div>
                <div><strong>Total:</strong> ${Number(showDetail.total_amount).toFixed(2)}</div>
                <div><strong>Created:</strong> {new Date(showDetail.created_at).toLocaleString()}</div>
              </div>
              {showDetail.notes && <p><strong>Notes:</strong> {showDetail.notes}</p>}
              <h4 style={{marginTop: '1rem'}}>Order Items</h4>
              <table>
                <thead>
                  <tr><th>Product</th><th>SKU</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                  {(showDetail.items || []).map((item, i) => (
                    <tr key={i}>
                      <td>{item.product_name}</td>
                      <td><code>{item.sku}</code></td>
                      <td>{item.quantity}</td>
                      <td>${Number(item.unit_price).toFixed(2)}</td>
                      <td className="font-medium">${(item.quantity * item.unit_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="status-actions" style={{marginTop: '1rem'}}>
                <strong>Update Status: </strong>
                {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                  <button key={s} className={`btn btn-sm ${showDetail.status === s ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => updateStatus(showDetail.id, s)} disabled={showDetail.status === s}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Order</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Supplier *</label>
                  <select value={formData.supplier_id} onChange={(e) => setFormData({...formData, supplier_id: e.target.value})} required>
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <input type="text" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                </div>
              </div>
              <h4>Order Items</h4>
              {formData.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <select value={item.product_id} onChange={(e) => updateItem(index, 'product_id', e.target.value)} required>
                    <option value="">Select Product</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} required />
                  <input type="number" step="0.01" placeholder="Price" value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', e.target.value)} required />
                  <button type="button" className="btn-icon btn-delete" onClick={() => removeItem(index)}>×</button>
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-secondary" onClick={addItem} style={{marginTop:'0.5rem'}}><FiPlus /> Add Item</button>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
