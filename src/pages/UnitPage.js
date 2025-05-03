import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UnitPage.css';

const sampleQuestions = [
  {
    question: "How do you say 'Hello' in Nepali?",
    options: ["Namaste", "Hola", "Bonjour", "Hello"],
    answer: "Namaste"
  },
  {
    question: "What is the Nepali word for 'Thank you'?",
    options: ["Danke", "Gracias", "Dhanyabaad", "Merci"],
    answer: "Dhanyabaad"
  }
];

const UnitPage = () => {
  const { language, unitId } = useParams();
  const navigate = useNavigate();
  const [xp, setXp] = useState(parseInt(localStorage.getItem('xp')) || 0);
  const [hearts, setHearts] = useState(parseInt(localStorage.getItem('hearts')) || 5);
  const [currentQ, setCurrentQ] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState("");
  const lessonId = 1; 
  navigate(`/lesson/${lessonId}`);

  useEffect(() => {
    localStorage.setItem('xp', xp);
    localStorage.setItem('hearts', hearts);
  }, [xp, hearts]);
 
  // or however you get it dynamically

  const handleAnswer = (option) => {
    if (option === sampleQuestions[currentQ].answer) {
      setXp(xp + 10);
      setFeedback("✅ Correct!");
    } else {
      const updatedHearts = Math.max(0, hearts - 1);
      setHearts(updatedHearts);
      setFeedback("❌ Oops! Wrong answer.");
      if (updatedHearts === 0) {
        setTimeout(() => navigate('/learn/' + language), 1000);
        return;
      }
    }

    setTimeout(() => {
      setFeedback("");
      if (currentQ + 1 < sampleQuestions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        setIsFinished(true);

        // Update unit progress in localStorage
        const units = JSON.parse(localStorage.getItem(`${language}_units`));
        const updated = units.map(u =>
          u.id === parseInt(unitId) ? { ...u, status: 'completed' } : u
        );
        if (parseInt(unitId) < updated.length) {
          updated[parseInt(unitId)].status = 'start'; // unlock next
        }
        localStorage.setItem(`${language}_units`, JSON.stringify(updated));

        setTimeout(() => navigate(`/learn/${language}`), 1500);
      }
    }, 1000);
  };

  return (
    <div className="unit-container">
      <div className="unit-top">
        <span>❤️ {hearts}</span>
        <h3>Unit {unitId} Quiz</h3>
        <span>⚡ {xp} XP</span>
      </div>

      {!isFinished ? (
        <div className="question-card">
          <h4>{sampleQuestions[currentQ].question}</h4>
          <div className="options">
            {sampleQuestions[currentQ].options.map((opt, idx) => (
              <button key={idx} onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
          {feedback && <p className="feedback">{feedback}</p>}
        </div>
      ) : (
        <p className="complete-msg">🎉 Quiz Complete! Returning...</p>
      )}
    </div>
  );
};

export default UnitPage;
