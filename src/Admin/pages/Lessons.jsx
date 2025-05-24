import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import './Lessons.css';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLessons();
    fetchCourses();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await axios.get('/lessons/');
      setLessons(res.data);
    } catch {
      toast.error('Failed to load lessons');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/courses/');
      setCourses(res.data);
    } catch {
      toast.error('Failed to load courses');
    }
  };

  const addLesson = async () => {
    if (!title.trim() || !courseId) {
      toast.warn('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/lessons/', {
        title,
        course: courseId,
        description: '',
        xp: 0,
        section: '',
        order: 1,
        
      });
      toast.success('Lesson added');
      setTitle('');
      setCourseId('');
      fetchLessons();
    } catch {
      toast.error('Failed to add lesson');
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (id) => {
    try {
      await axios.delete(`/lessons/${id}/`);
      toast.success('Lesson deleted');
      fetchLessons();
    } catch {
      toast.error('Failed to delete lesson');
    }
  };

  const startEdit = (lesson) => {
    setEditingId(lesson.id);
    setEditingTitle(lesson.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/lessons/${id}/`, { title: editingTitle });
      toast.success('Lesson updated');
      setEditingId(null);
      fetchLessons();
    } catch {
      toast.error('Failed to update lesson');
    }
  };

  return (
    <div className="lesson-container">
      <h2 className="lesson-header">Lessons</h2>

      <div className="lesson-input-group">
        <input
          type="text"
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="lesson-input"
        />
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="lesson-input"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
        <button
          onClick={addLesson}
          disabled={loading}
          className="lesson-button"
        >
          {loading ? 'Adding...' : 'Add Lesson'}
        </button>
      </div>

      <ul className="lesson-list">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="lesson-item">
            {editingId === lesson.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="lesson-edit-input"
                />
                <button onClick={() => saveEdit(lesson.id)} className="lesson-save-button">💾</button>
                <button onClick={cancelEdit} className="lesson-cancel-button">❌</button>
              </>
            ) : (
              <>
                <span>{lesson.title}</span>
                <button onClick={() => startEdit(lesson)} className="lesson-edit-button">✏️</button>
                <button onClick={() => deleteLesson(lesson.id)} className="lesson-delete-button">🗑️</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lessons;
