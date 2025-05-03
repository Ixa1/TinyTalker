import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import api from '../utils/api';


const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await axios.get('/progress/');
      const xpByUser = {};
      res.data.forEach(p => {
        xpByUser[p.user] = (xpByUser[p.user] || 0) + p.xp;
      });

      const ranked = Object.entries(xpByUser)
        .map(([userId, xp]) => ({ userId, xp }))
        .sort((a, b) => b.xp - a.xp);

      setLeaders(ranked);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard</h1>
      {leaders.map((u, i) => (
        <p key={u.userId}>#{i + 1} — User {u.userId} - {u.xp} XP</p>
      ))}
    </div>
  );
};

export default LeaderboardPage;
