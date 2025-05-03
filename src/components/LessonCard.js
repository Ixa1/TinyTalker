import React from 'react';

const LessonCard = ({ lesson, onClick }) => (
  <div className="lesson-card" onClick={() => onClick(lesson.id)}>
    <h3>{lesson.title}</h3>
    <p>{lesson.description}</p>
    <p>XP: {lesson.xp}</p>
  </div>
);

export default LessonCard;
