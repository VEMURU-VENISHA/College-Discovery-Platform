import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";   // ✅ ADD THIS

function Questions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/questions`)   // ✅ FIXED
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">

      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">💬 College Q&A</h1>

      {questions.length === 0 ? (
        <p>No questions yet</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold text-blue-600">❓ {q.question}</p>
              <p className="mt-2 text-gray-700">💡 {q.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Questions;