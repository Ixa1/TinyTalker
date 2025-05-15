import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonDetail } from '../utils/api';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
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
    loadLessons();
  }, [courseId]);

  return (
    <div className="course-detail">
      <h2>📘 Lessons</h2>
      {lessons.map(lesson => (
        <div
          key={lesson.id}
          className="lesson-card"
          onClick={() => navigate(`/lesson/${lesson.id}`)}
        >
          <h3>{lesson.title}</h3>
          <p>{lesson.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseDetailPage;
