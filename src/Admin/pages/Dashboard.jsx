import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axiosInstance from '../../utils/axiosInstance';
import './AdminDashboard.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    lessons: 0,
    questions: 0,
    reports: 0,
  });

  const [userList, setUserList] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);

  useEffect(() => {
    // Fetch summary stats
    axiosInstance.get('/api/admin/summary/')
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error('Failed to fetch summary stats:', err);
      });

    // Fetch user list
    axiosInstance.get('/api/admin/users/')
      .then((res) => {
        setUserList(res.data);
        setStats(prev => ({ ...prev, users: res.data.length }));
      })
      .catch((err) => {
        console.error('Failed to fetch users:', err);
      });

    // Fetch course distribution for pie chart
    axiosInstance.get('/api/admin/user-course-distribution/')
      .then((res) => {
        const formatted = Object.entries(res.data).map(([name, value]) => ({
          name,
          value
        }));
        setCourseDistribution(formatted);
      })
      .catch((err) => {
        console.error('Failed to fetch course distribution:', err);
      });
  }, []);

  const chartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="admin-layout">
      
      <main className="dashboard-container">
        <h2 className="dashboard-title">📊 Admin Dashboard</h2>

        <div className="dashboard-grid">
          {/* Users Table */}
          <div className="users-table card">
            <h3>👥 Users</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userList.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Alerts */}
          <div className="alerts card">
            <h3>🔔 Alerts</h3>
            <div className="alert warning">⚠️ Check user input validity.</div>
            <div className="alert success">✅ Stats loaded successfully.</div>
            <div className="alert info">ℹ️ New version will roll out soon.</div>
            <div className="alert danger">❌ Some data couldn't be fetched.</div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card"><h4>Users</h4><p>{stats.users}</p></div>
            <div className="stat-card"><h4>Lessons</h4><p>{stats.lessons}</p></div>
            <div className="stat-card"><h4>Questions</h4><p>{stats.questions}</p></div>
            <div className="stat-card"><h4>Reports</h4><p>{stats.reports}</p></div>
          </div>

          {/* Pie Chart Summary */}
          <div className="summary card">
            <h3>📈 Course Distribution</h3>
            {courseDistribution.length === 0 ? (
              <p>Loading chart...</p>
            ) : (
              <PieChart width={300} height={300}>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {courseDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
