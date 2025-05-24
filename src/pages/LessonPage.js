import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance'; // make sure this points to axios with baseURL
import { fetchQuestions, fetchLessons, updateProgress } from '../utils/api';
import GlobalLayout from '../components/GlobalLayout';
import './LessonPage.css';
import { useCourseStoreWithPersist as useCourseStore } from './courseStore';

const LessonPage = () => {
  const { lessonId, courseId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [courseComplete, setCourseComplete] = useState(false);

  const { addXp, loseHeart, refillHeart, hearts } = useCourseStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const qRes = await fetchQuestions(lessonId);
        setQuestions(qRes.data);

        const lRes = await fetchLessons(courseId);
        setLessons(lRes.data);
      } catch (err) {
        console.error('Error loading questions or lessons:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lessonId, courseId]);

  const handleOptionClick = async (option) => {
    if (!questions[currentQuestion]) return;
    setSelectedOption(option);

    const questionId = questions[currentQuestion].id;

    try {
      const res = await axios.post(`/submit-answer/${questionId}`, { answer: option });

      if (res.data.correct) {
        setFeedback('🎉 Correct!');
        addXp(2); // frontend update (optional if backend tracks it)
        refillHeart();

        await updateProgress({
          lessonId,
          xp: (currentQuestion + 1) * 2,
          completed: currentQuestion + 1 === questions.length,
        });

        if ((currentQuestion + 1) * 2 % 50 === 0) {
          setLevel((prev) => prev + 1);
        }

        if (currentQuestion + 1 === questions.length) {
          const currentIndex = lessons.findIndex((l) => l.id === parseInt(lessonId));
          const nextLesson = lessons[currentIndex + 1];

          if (nextLesson) {
            setTimeout(() => {
              navigate(`/lesson/${courseId}/${nextLesson.id}`);
            }, 1500);
          } else {
            setTimeout(() => {
              setCourseComplete(true);
              setFeedback('');
            }, 1000);
          }
        } else {
          setTimeout(() => {
            setSelectedOption(null);
            setFeedback('');
            setCurrentQuestion((prev) => prev + 1);
          }, 1000);
        }
      } else {
        loseHeart();
        setFeedback('❌ Oops! Try again.');
        setTimeout(() => {
          setSelectedOption(null);
          setFeedback('');
        }, 1000);
      }
    } catch (err) {
      if (err.response?.data?.error === 'Out of hearts') {
        setFeedback('💔 No hearts left!');
      } else {
        console.error('Submit failed:', err);
      }
    }
  };

  const restartLesson = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setFeedback('');
    setCourseComplete(false);
  };

  const current = questions[currentQuestion];

  return (
    <GlobalLayout>
      <div className="lesson-page">
        <h2>📚 Lesson</h2>

        <div className="stats">
          <p>🎯 Level: {level}</p>
          <p>❤️ Hearts: {hearts}</p>
        </div>

        {loading ? (
          <div className="loading">Loading questions...</div>
        ) : courseComplete ? (
          <div className="end-message">
            🎉 You completed the course!
            <br />
            <button className="restart-btn" onClick={restartLesson}>
              Restart Course
            </button>
          </div>
        ) : current ? (
          <>
            <p className="question">🧐 {current.question_text}</p>
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
          <div className="loading">No more questions</div>
        )}
      </div>
    </GlobalLayout>
  );
};

export default LessonPage;
