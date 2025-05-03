import React from 'react';

const QuestCard = ({ quest }) => (
  <div className="quest-card">
    <h4>{quest.title}</h4>
    <p>{quest.description}</p>
    <div className="progress-bar">
      <div style={{ width: `${(quest.progress / quest.goal) * 100}%`, background: '#3b82f6', height: '10px' }}></div>
    </div>
    <span>{quest.progress} / {quest.goal}</span>
  </div>
);

export default QuestCard;
