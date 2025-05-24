import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from '../../utils/axiosInstance';
import './QuestionFormModal.css';

const QuestionFormModal = ({ isOpen, onClose, onSave, editingQuestion, lessonId }) => {
  const [text, setText] = useState('');
  const [type, setType] = useState('mcq');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (editingQuestion) {
      setText(editingQuestion.text || '');
      setType(editingQuestion.type || 'mcq');
      setOptions(editingQuestion.options || ['', '', '', '']);
      setAnswer(editingQuestion.answer || '');
    } else {
      setText('');
      setType('mcq');
      setOptions(['', '', '', '']);
      setAnswer('');
    }
  }, [editingQuestion]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

const handleSubmit = async () => {
  if (!text.trim()) {
    toast.warn('Question text cannot be empty');
    return;
  }

  const data = {
    question_text: text,
    type,
    answer,
    lesson: lessonId,
    options: type === 'mcq' ? options.map((opt) => ({
      text: opt,
      is_correct: opt === answer
    })) : [],
  };

  try {
    if (editingQuestion) {
      await axios.put(`/api/questions/${editingQuestion.id}/`, data);
      toast.success('Question updated');
    } else {
      await axios.post('/api/questions/', data);
      toast.success('Question added');
    }
    onSave();
    onClose();
  } catch (err) {
    toast.error('Failed to save question');
  }
};


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{editingQuestion ? 'Edit' : 'Add'} Question</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <label>Question Text</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} />

          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="mcq">Multiple Choice</option>
            <option value="fill">Fill in the Blank</option>
            <option value="match">Matching</option>
          </select>

          {type === 'mcq' && (
            <>
              <label>Options</label>
              {options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  placeholder={`Option ${idx + 1}`}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
              ))}
            </>
          )}

          <label>Answer</label>
          <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </div>

        <div className="modal-footer">
          <button className="save-btn" onClick={handleSubmit}>💾 Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionFormModal;
