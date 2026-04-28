import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function Questions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/questions")
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error(err));
  }, []);
  return (
    <div className="p-6">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
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