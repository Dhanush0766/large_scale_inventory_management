import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiPackage, FiGrid, FiBox, FiLayers, FiTruck, FiShoppingCart, 
  FiBarChart2, FiSettings, FiLogOut, FiUsers, FiX 
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { to: '/admin/products', icon: <FiBox />, label: 'Products' },
    { to: '/admin/inventory', icon: <FiLayers />, label: 'Inventory' },
    { to: '/admin/suppliers', icon: <FiTruck />, label: 'Suppliers' },
    { to: '/admin/orders', icon: <FiShoppingCart />, label: 'Orders' },
    { to: '/admin/reports', icon: <FiBarChart2 />, label: 'Reports' },
    { to: '/admin/qrcode', icon: <FiSettings />, label: 'QR Codes' },
  ];

  const staffLinks = [
    { to: '/staff/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { to: '/staff/products', icon: <FiBox />, label: 'Products' },
    { to: '/staff/inventory', icon: <FiLayers />, label: 'Inventory' },
    { to: '/staff/qrscanner', icon: <FiSettings />, label: 'QR Scanner' },
  ];

  const links = isAdmin() ? adminLinks : staffLinks;

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FiPackage className="logo-icon" />
            <span>Inventory Pro</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">
            {(user?.full_name || user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.full_name || user?.username}</span>
            <span className={`user-role role-${user?.role}`}>{user?.role}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {links.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link animate-cascade ${isActive ? 'active' : ''}`}
              style={{ "--animation-order": index }}
              onClick={onClose}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
