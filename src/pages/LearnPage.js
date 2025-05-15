import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getCourses, fetchLessons } from '../utils/api';
import './LearnPage.css';
import { useCourseStore } from '../store/courseStore';



const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="logo-inline">
        <h2 className="tiny">Tiny</h2>
        <h2 className="talker">Talker</h2>
      </div>
      <nav>
        <ul>
          <li className={location.pathname === '/learn' ? 'active-sidebar' : ''}>
            <Link to="/learn" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span role="img" aria-label="Learn">🏠</span> Learn
            </Link>
          </li>
          <li className={location.pathname === '/leaderboard' ? 'active-sidebar' : ''}>
            <Link to="/leaderboard"><span role="img" aria-label="Leaderboard">🏆</span> Leaderboard</Link>
          </li>
          <li className={location.pathname === '/quests' ? 'active-sidebar' : ''}>
            <Link to="/quests"><span role="img" aria-label="Quests">🎯</span> Quests</Link>
          </li>
          <li className={location.pathname === '/profile' ? 'active-sidebar' : ''}>
            <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span role="img" aria-label="Profile">👤</span> Profile
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const Navbar = ({ language, setLanguage }) => (
  <div className="navbar">
    <button className="guidebook">Guidebook</button>
    <div className="user-info">
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => setLanguage(prev => (prev === 'US' ? 'NP' : 'US'))}
      >
        {language}
      </span>
      <span>❤️ 5</span>
    </div>
  </div>
);

const LearnPage = () => {
  const [courses, setCourses] = useState([]);
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse); // ✅ Fix
  const [lessons, setLessons] = useState([]);
  const [language, setLanguage] = useState('US');
  //const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    loadCourses();
  }, []);

  const handleCourseClick = async (course) => {
    try {
      const response = await fetchLessons(course.id);
      setLessons(response.data);
      setSelectedCourse(course); // ✅ store the full course object
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Navbar language={language} setLanguage={setLanguage} />
        <div className="content">
          {!selectedCourse ? (
            <>
              <h1>Choose a Course</h1>
              <div className="courses">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="course-card"
                    onClick={() => handleCourseClick(course)} // ✅ fixed
                  >
                    <img src={course.icon} alt={course.name} width="80" />
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1>Lessons</h1>
              <div className="lessons">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="lesson-card">
                    <h4>{lesson.title}</h4>
                    <p>{lesson.description}</p>
                    <button className="start-btn">Start Lesson</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}  

export default LearnPage;
