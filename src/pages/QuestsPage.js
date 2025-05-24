import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GlobalLayout from '../components/GlobalLayout';
import styles from './DailyQuests.module.css';

const QuestsPage = () => {
  const [quests, setQuests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const token = localStorage.getItem('access_token');
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ4MDcwNzM2LCJpYXQiOjE3NDc5ODQzMzYsImp0aSI6IjJkZTRmZGEzYmQyYzRhZDVhYzVmNjk2NmRhZDE0MjgyIiwidXNlcl9pZCI6N30.-MSoCunGx8rIpYLzJ7f1HVVfA22Mw0VhFddBnDDcEGE';

        const res = await axios.get('http://localhost:8000/api/quests/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // localStorage.getItem('access_token') ||
        // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ4MDcwNzM2LCJpYXQiOjE3NDc5ODQzMzYsImp0aSI6IjJkZTRmZGEzYmQyYzRhZDVhYzVmNjk2NmRhZDE0MjgyIiwidXNlcl9pZCI6N30.-MSoCunGx8rIpYLzJ7f1HVVfA22Mw0VhFddBnDDcEGE.'; /
        // const res = await axios.get('http://localhost:8000/api/quests/', {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        setQuests(res.data);
      } catch (err) {
        console.error('Failed to fetch quests:', err);
        setError('Could not load daily quests.');
      }
    };
    fetchQuests();
  }, []);

  return (
    <GlobalLayout>
      <div className={styles.questContainer}>
        <h2 className={styles.title}>Daily Quests</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.questList}>
          {quests.map((quest) => (
            <div key={quest.id} className={styles.questCard}>
              <div className={styles.questHeader}>
                <span className={styles.icon}>
                  {quest.quest_type === 'xp' && '⚡'}
                  {quest.quest_type === 'streak' && '🤖'}
                  {quest.quest_type === 'accuracy' && '⏱️'}
                </span>

                <span className={styles.questTitle}>{quest.title}</span>
              </div>
              <progress
                className={styles.progressBar}
                value={quest.progress}
                max={quest.target}
              />
              <div className={styles.questProgressText}>
                {quest.progress} / {quest.target}
              </div>
              {quest.completed && (
                <div className={styles.completedBadge}>✅ Completed</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </GlobalLayout>
  );
};

export default QuestsPage;
