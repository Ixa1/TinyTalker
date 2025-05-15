import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance'; // Ensure path is correct

const DashboardCards = () => {
  const [stats, setStats] = useState({
    users: 0,
    lessons: 0,
    questions: 0,
    reports: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/summary/');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    { title: 'Users', value: stats.users },
    { title: 'Lessons', value: stats.lessons },
    { title: 'Questions', value: stats.questions },
    { title: 'Reports', value: stats.reports },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cardData.map((item, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 dark:bg-[#1e3a8a] dark:border-blue-400 p-5 rounded-xl shadow text-center transition-all"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-yellow-300">
            {loading ? '...' : item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
