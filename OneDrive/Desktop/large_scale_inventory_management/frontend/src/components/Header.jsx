import { useAuth } from '../context/AuthContext';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

const Header = ({ onMenuClick, title }) => {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <FiMenu />
        </button>
        <h2 className="page-title">{title}</h2>
      </div>
      <div className="header-right">
        <div className="header-user">
          <FiUser />
          <span>{user?.full_name || user?.username}</span>
          <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
