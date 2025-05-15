import axios from 'axios';
import axiosInstance from './axiosConfig';

// Create the API instance
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Update if your backend URL changes
});

// Attach access token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === 📚 Course APIs ===
export const getCourses = async () => {
  return await axiosInstance.get('/courses/');
};

// === 📖 Lesson APIs ===
export const fetchLessons = (courseId) => API.get(`/courses/${courseId}/lessons/`);
export const getLessonDetail = (lessonId) => API.get(`/lessons/${lessonId}/`);

// === 👤 Profile APIs ===
export const getProfile = () => API.get('/profile/');

// === 🏆 Leaderboard APIs ===
export const fetchLeaderboard = () => API.get('/leaderboard/');

export const fetchQuestions = () => {
  return API.get('/lessons/questions/');
  

};

export const updateProgress = async ({ lessonId, xp, completed }) => {
  return API.post('/progress/update/', { lessonId, xp, completed });
};
// === 🎯 Daily Quests APIs (if any) ===
// (If you have daily quests endpoint, add here like below)
// export const getQuests = () => API.get('/quests/');

export default API;
