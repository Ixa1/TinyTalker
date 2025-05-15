import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h2 className="logo">✨ TinyTalker</h2>
      <nav className="nav-links">
        <Link to="/admin/dashboard" className={location.pathname === '/admin/dashboard' ? 'active' : ''}>📊 Dashboard</Link>
        <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>👥 Users</Link>
        <Link to="/admin/lessons" className={location.pathname === '/admin/lessons' ? 'active' : ''}>📚 Lessons</Link>
        <Link to="/admin/questions" className={location.pathname === '/admin/questions' ? 'active' : ''}>❓ Questions</Link>
        <Link to="/admin/reports" className={location.pathname === '/admin/reports' ? 'active' : ''}>📝 Reports</Link>
        <Link to="/admin/settings" className={location.pathname === '/admin/settings' ? 'active' : ''}>⚙️ Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
