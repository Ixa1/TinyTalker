import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axiosInstance from '../../utils/axiosInstance';
import './AdminDashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    lessons: 0,
    questions: 0,
    reports: 0,
  });

  useEffect(() => {
    axiosInstance.get('/api/admin/summary/')
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error('Failed to fetch summary stats:', err);
      });
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="dashboard-container">
        <h2 className="dashboard-title">📊 Admin Dashboard</h2>

        <div className="dashboard-grid">
          <div className="users-table card">
            <h3>👥 Users</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>Alice</td><td>alice@email.com</td><td><span className="status active">active</span></td></tr>
                <tr><td>2</td><td>Bob</td><td>bob@email.com</td><td><span className="status pending">pending</span></td></tr>
                <tr><td>3</td><td>Duck</td><td>duck@email.com</td><td><span className="status active">active</span></td></tr>
              </tbody>
            </table>
          </div>

          <div className="alerts card">
            <h3>🔔 Alerts</h3>
            <div className="alert warning">⚠️ Check user input validity.</div>
            <div className="alert success">✅ Stats loaded successfully.</div>
            <div className="alert info">ℹ️ New version will roll out soon.</div>
            <div className="alert danger">❌ Some data couldn't be fetched.</div>
          </div>

          <div className="quick-stats">
            <div className="stat-card"><h4>Users</h4><p>{stats.users}</p></div>
            <div className="stat-card"><h4>Lessons</h4><p>{stats.lessons}</p></div>
            <div className="stat-card"><h4>Questions</h4><p>{stats.questions}</p></div>
            <div className="stat-card"><h4>Reports</h4><p>{stats.reports}</p></div>
          </div>

          <div className="summary card">
            <h3>📈 Summary Chart</h3>
            <p>Coming soon: Visual analytics...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
