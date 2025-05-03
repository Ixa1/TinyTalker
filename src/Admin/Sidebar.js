import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="w-64 h-screen bg-gray-900 text-white p-5">
    <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
    <ul className="space-y-4">
      <li><Link to="/admin">Dashboard</Link></li>
      <li><Link to="/admin/users">Users</Link></li>
      <li><Link to="/admin/lessons">Lessons</Link></li>
      <li><Link to="/admin/questions">Questions</Link></li>
      <li><Link to="/admin/reports">Reports</Link></li>
      <li><Link to="/admin/settings">Settings</Link></li>
    </ul>
  </div>
);
export default Sidebar;
