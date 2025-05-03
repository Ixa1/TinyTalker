import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Lessons from './pages/Lessons';
import Questions from './pages/Questions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function AdminRoutes() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="questions" element={<Questions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}
