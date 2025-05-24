import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import './LearnPage.css';

const LearnPage = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [totalXp, setTotalXp] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchXp();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchLessons();
      fetchProgress();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/courses/');
      setCourses(res.data);
    } catch {
      toast.error('Failed to load courses');
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`/lessons/?course_id=${selectedCourse}`);
      setLessons(res.data);
    } catch {
      toast.error('Failed to load lessons');
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await axios.get('/progress/');
      setProgress(res.data);
    } catch {
      toast.error('Failed to load progress');
    }
  };

  const fetchXp = async () => {
    try {
      const res = await axios.get('/user/xp-summary/');
      setTotalXp(res.data.total_xp);
    } catch {
      toast.error('Failed to fetch XP');
    }
  };

  const isCompleted = (lessonId) =>
    progress.find((p) => p.lesson === lessonId)?.completed;

  const isUnlocked = (index) =>
    index === 0 || isCompleted(lessons[index - 1]?.id);

  const handleCompleteLesson = async (lessonId) => {
    try {
      await axios.post('/user/progress/', {
        lessonId,
        xp: 10,
        completed: true,
      });
      toast.success('🎉 Lesson marked as complete!');
      fetchProgress();
      fetchXp();
    } catch {
      toast.error('Failed to save progress');
    }
  };

  return (
    <div className="learn-layout">
      <Sidebar />

      <main className="learn-center">
        <h2 className="course-header">Start Learning</h2>

        <select
          className="course-dropdown"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <div className="lesson-path">
          {lessons.map((lesson, index) => {
            const unlocked = isUnlocked(index);
            const completed = isCompleted(lesson.id);
            return (
              <div
                key={lesson.id}
                className={`lesson-node ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                onClick={() => unlocked && handleCompleteLesson(lesson.id)}
              >
                <div className="lesson-icon">📘</div>
                <p>{lesson.title}</p>
              </div>
            );
          })}
        </div>
      </main>

      <aside className="learn-right">
        <div className="xp-card">
          <h4>XP Progress</h4>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${Math.min(totalXp, 100)}%` }} />
          </div>
          <p>{totalXp} XP</p>
        </div>

        <div className="quest-card">
          <h4>Daily Quest</h4>
          <p>Earn 10 XP</p>
          <div className="quest-bar">
            <div className="quest-fill" style={{ width: `${Math.min(totalXp, 10) * 10}%` }} />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default LearnPage;
