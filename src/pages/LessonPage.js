// import React, { useState, useEffect } from 'react';
// import { fetchQuestions } from '../utils/api';
// import './LessonPage.css';
// import { useParams } from 'react-router-dom'; 
// const LessonPage = () => {
//   const [questions, setQuestions] = useState([]);
//   const { lessonId } = useParams();
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [feedback, setFeedback] = useState('');
//   const [xp, setXp] = useState(0);
//   const [level, setLevel] = useState(1);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadQuestions = async () => {
//       try {
//         const response = await fetchQuestions(lessonId); // ✅ pass lessonId
//         setQuestions(response.data);
//       } catch (error) {
//         console.error('Error fetching questions:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadQuestions();
//   }, [lessonId]);

//   if (loading) return <div>Loading questions...</div>;

//   return (
//     <div>
//       {/* Render your questions here */}
//       {questions.map((q, i) => (
//         <div key={i}>
//           <p>{q.question}</p>
//           {q.options.map((opt, idx) => (
//             <button key={idx}>{opt}</button>
//           ))}
//         </div>
//       ))}
//     </div>
//   );

//   const handleOptionClick = (option) => {
//     if (!questions[currentQuestion]) return;

//     const correct = questions[currentQuestion].answer === option;
//     if (correct) {
//       setXp(prev => prev + 10); // +10 XP per correct answer
//       if ((xp + 10) % 50 === 0) {
//         setLevel(prev => prev + 1); // Level up every 50 XP
//       }
//       setFeedback('🎉 Correct!');
//       setTimeout(() => {
//         setSelectedOption(null);
//         setFeedback('');
//         setCurrentQuestion(prev => prev + 1);
//       }, 1000);
//     } else {
//       setFeedback('❌ Oops! Try again.');
//       setTimeout(() => {
//         setFeedback('');
//         setSelectedOption(null);
//       }, 1000);
//     }
//     setSelectedOption(option);
//   };

//   const restartLesson = () => {
//     setCurrentQuestion(0);
//     setXp(0);
//     setLevel(1);
//     setSelectedOption(null);
//     setFeedback('');
//   };

//   if (loading) return <div className="loading">Loading questions...</div>;

//   const current = questions[currentQuestion];

//   return (
//     <div className="lesson-page">
//       <h2>📚 Beginner Nepali Lesson</h2>
//       <div className="stats">
//         <p>⭐ XP: {xp}</p>
//         <p>🎯 Level: {level}</p>
//       </div>

//       {current ? (
//         <>
//           <p className="question">🧐 {current.question}</p>
//           <div className="options">
//             {current.options.map((opt, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => handleOptionClick(opt)}
//                 className={`option-btn ${selectedOption === opt ? 'selected' : ''}`}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//           {feedback && <div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'wrong'}`}>{feedback}</div>}
//         </>
//       ) : (
//         <div className="end-message">
//           🎉 You completed the lesson!
//           <br />
//           <button className="restart-btn" onClick={restartLesson}>Restart Lesson</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LessonPage;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuestions, updateProgress } from '../utils/api';
import './LessonPage.css';

const LessonPage = () => {
  const { lessonId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetchQuestions(lessonId);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [lessonId]);

  const handleOptionClick = async (option) => {
    if (!questions[currentQuestion]) return;
    setSelectedOption(option);

    const isCorrect = questions[currentQuestion].answer === option;

    if (isCorrect) {
      const newXp = xp + 10;
      setXp(newXp);

      if (newXp % 50 === 0) {
        setLevel((prev) => prev + 1);
      }

      try {
        await updateProgress({
          lessonId,
          xp: newXp,
          completed: currentQuestion + 1 === questions.length,
        });
      } catch (err) {
        console.error('Failed to update progress', err);
      }

      setFeedback('🎉 Correct!');
      setTimeout(() => {
        setSelectedOption(null);
        setFeedback('');
        setCurrentQuestion((prev) => prev + 1);
      }, 1000);
    } else {
      setFeedback('❌ Oops! Try again.');
      setTimeout(() => {
        setSelectedOption(null);
        setFeedback('');
      }, 1000);
    }
  };

  const restartLesson = () => {
    setCurrentQuestion(0);
    setXp(0);
    setLevel(1);
    setSelectedOption(null);
    setFeedback('');
  };

  if (loading) return <div className="loading">Loading questions...</div>;

  const current = questions[currentQuestion];

  return (
    <div className="lesson-page">
      <h2>📚 Nepali Lesson</h2>

      <div className="stats">
        <p>⭐ XP: {xp}</p>
        <p>🎯 Level: {level}</p>
      </div>

      {current ? (
        <>
          <p className="question">🧐 {current.question}</p>
          <div className="options">
            {current.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt)}
                className={`option-btn ${selectedOption === opt ? 'selected' : ''}`}
              >
                {opt}
              </button>
            ))}
          </div>
          {feedback && (
            <div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'wrong'}`}>
              {feedback}
            </div>
          )}
        </>
      ) : (
        <div className="end-message">
          🎉 You completed the lesson!
          <br />
          <button className="restart-btn" onClick={restartLesson}>
            Restart Lesson
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
