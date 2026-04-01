import { useState, useEffect } from 'react';
import { suppliersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', status: 'active'
  });

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await suppliersAPI.getAll();
      setSuppliers(res.data);
    } catch (error) {
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (supplier = null) => {
    if (supplier) {
      setEditSupplier(supplier);
      setFormData({ name: supplier.name, email: supplier.email || '', phone: supplier.phone || '', address: supplier.address || '', city: supplier.city || '', status: supplier.status });
    } else {
      setEditSupplier(null);
      setFormData({ name: '', email: '', phone: '', address: '', city: '', status: 'active' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSupplier) {
        await suppliersAPI.update(editSupplier.id, formData);
        toast.success('Supplier updated');
      } else {
        await suppliersAPI.create(formData);
        toast.success('Supplier created');
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete supplier "${name}"?`)) {
      try {
        await suppliersAPI.delete(id);
        toast.success('Supplier deleted');
        fetchSuppliers();
      } catch (error) {
        toast.error('Failed to delete supplier');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h3 className="page-subtitle">Manage your suppliers</h3>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Add Supplier
        </button>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : (
        <div className="cards-grid">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="supplier-card">
              <div className="supplier-header">
                <div className="supplier-avatar">{supplier.name.charAt(0)}</div>
                <div>
                  <h4>{supplier.name}</h4>
                  <span className={`badge ${supplier.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{supplier.status}</span>
                </div>
              </div>
              <div className="supplier-details">
                {supplier.email && <p><FiMail /> {supplier.email}</p>}
                {supplier.phone && <p><FiPhone /> {supplier.phone}</p>}
                {supplier.city && <p><FiMapPin /> {supplier.city}</p>}
              </div>
              <div className="supplier-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => openModal(supplier)}><FiEdit2 /> Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(supplier.id, supplier.name)}><FiTrash2 /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editSupplier ? 'Edit Supplier' : 'Add Supplier'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea rows="2" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editSupplier ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
