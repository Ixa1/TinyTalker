import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import './Questions.css';
import QuestionFormModal from '../components/QuestionFormModal';

const Questions = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse);
    } else {
      setLessons([]);
      setQuestions([]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedLesson) {
      fetchQuestions(selectedLesson);
    } else {
      setQuestions([]);
    }
  }, [selectedLesson]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses/');
      setCourses(res.data);
    } catch {
      toast.error('Failed to load courses');
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      const res = await axios.get(`/api/lessons/?course_id=${courseId}`);
      setLessons(res.data);
    } catch {
      toast.error('Failed to load lessons');
    }
  };

  const fetchQuestions = async (lessonId) => {
    try {
      const res = await axios.get(`/api/questions/?lesson_id=${lessonId}`);
      setQuestions(res.data);
    } catch {
      toast.error('Failed to load questions');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await axios.delete(`/api/questions/${id}/`);
      toast.success('Question deleted');
      fetchQuestions(selectedLesson);
    } catch {
      toast.error('Failed to delete question');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingQuestion(null);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Questions</h2>

      <div className="mb-4 flex gap-4">
        <select
          className="border p-2"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          className="border p-2"
          value={selectedLesson}
          onChange={(e) => setSelectedLesson(e.target.value)}
          disabled={!selectedCourse}
        >
          <option value="">Select Lesson</option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>{l.title}</option>
          ))}
        </select>
      </div>

      {selectedLesson && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Questions</h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAdd}
          >
            + Add Question
          </button>
        </div>
      )}

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Question</th>
            <th>Type</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id} className="border-t">
              <td className="p-2">{q.question_text}</td>
              <td>{q.type}</td>
              <td className="text-center">
                <button onClick={() => handleEdit(q)} className="mr-2">✏️</button>
                <button onClick={() => handleDelete(q.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <QuestionFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => fetchQuestions(selectedLesson)}
        editingQuestion={editingQuestion}
        lessonId={selectedLesson}
      />
    </div>
  );
};

export default Questions;
