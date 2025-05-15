import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch lessons on load
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await axios.get('/lessons/');
      setLessons(res.data);
    } catch (err) {
      toast.error('Failed to load lessons');
    }
  };

  const addLesson = async () => {
    if (!title.trim()) {
      toast.warn('Lesson title cannot be empty');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/lessons/', { title });
      toast.success('Lesson added');
      setTitle('');
      fetchLessons(); // reload only the list
    } catch (err) {
      toast.error('Failed to add lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lessons</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Lesson Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={addLesson}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Lesson'}
        </button>
      </div>

      <ul className="mt-4 bg-white p-4 rounded shadow">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="border-b py-2">{lesson.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Lessons;
