import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Lessons from './pages/Lessons';
import Questions from './pages/Questions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const AdminRoutes = () => {
  const token = localStorage.getItem('adminToken');

  // Redirect to login if no admin token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-8 mt-0 ml-[220px]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="questions" element={<Questions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;
