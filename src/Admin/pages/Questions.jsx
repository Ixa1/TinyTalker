import { useEffect, useState } from 'react';

const Questions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('/api/questions/')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Questions</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Question</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <tr key={i} className="text-center border-t">
              <td className="p-2">{q.text}</td>
              <td>{q.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Questions;
