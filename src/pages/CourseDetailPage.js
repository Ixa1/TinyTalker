import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { getLessonDetail, getUserProgress } from '../utils/api';
import GlobalLayout from '../components/GlobalLayout'; // ✅ Add wrapper
import './CourseDetailPage.css';

const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Expert'];

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadLessons() {
      try {
        const response = await getLessonDetail(courseId);
        setLessons(response.data);
      } catch (err) {
        console.error('Failed to fetch lessons', err);
      }
    }

    async function loadProgress() {
      try {
        const res = await getUserProgress();
        setProgress(res.data);
      } catch (err) {
        console.error('Failed to fetch progress', err);
      }
    }

    loadLessons();
    loadProgress();
  }, [courseId]);

  const isCompleted = (lessonId) =>
    progress.find((p) => p.lesson === lessonId)?.completed;

  const isUnlocked = (index) => {
    if (index === 0) return true;
    const prevLesson = lessons[index - 1];
    return isCompleted(prevLesson?.id);
  };

  return (
    <GlobalLayout>
      <div className="course-detail">
        <h2 className="text-xl font-bold mb-4">📘 {courseId?.toUpperCase()} Levels</h2>
        <div className="level-container">
          {LEVEL_ORDER.map((levelName, idx) => {
            const lesson = lessons.find((l) =>
              l.title.toLowerCase().includes(levelName.toLowerCase())
            );
            const completed = lesson && isCompleted(lesson.id);
            const unlocked = lesson && isUnlocked(idx);

            return (
              <div
                key={levelName}
                className={`lesson-card ${unlocked ? 'unlocked' : 'locked'} ${
                  completed ? 'completed' : ''
                }`}
                onClick={() =>
                  unlocked &&
                  navigate(`/lesson/${courseId}/${lesson?.id}`)
                }
              >
                <h3>{levelName}</h3>
                <p>
                  {completed
                    ? '✅ Completed'
                    : unlocked
                    ? 'Click to start'
                    : '🔒 Locked'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </GlobalLayout>
  );
};

export default CourseDetailPage;
