import axios from 'axios';
import axiosInstance from './axiosConfig';

// API with token handling
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === 📚 Course APIs ===
export const getCourses = () => axiosInstance.get('/courses/');

// === 📖 Lesson APIs ===
export const fetchLessons = (courseId) => API.get(`/courses/${courseId}/lessons/`);
export const getLessonDetail = (courseId) => API.get(`/lessons/?course_id=${courseId}`);

// ✅ Add this: user progress GET
export const getUserProgress = () => API.get('/progress/');

// ✅ Fixed this: get questions by lesson
export const fetchQuestions = (lessonId) => API.get(`/questions/?lesson_id=${lessonId}`);

export const submitAnswer = (questionId, answer) => {
  return axios.post(`/questions/${questionId}/submit/`, { answer });
};

// ✅ Update progress (XP, completed)
export const updateProgress = ({ lessonId, xp, completed }) => {
  return API.post('/user/progress/', { lessonId, xp, completed });
};

// === 👤 Profile API ===
export const getProfile = () => API.get('/profile/');

// === 🏆 Leaderboard API ===
export const fetchLeaderboard = () => API.get('/leaderboard/');

export default API;
