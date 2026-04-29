import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";   // ✅ ADD THIS

function CollegeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${API}/college/${id}`)   // ✅ FIXED
      .then(res => res.json())
      .then(data => {
        setCollege(data.college);
        setCourses(data.courses || []);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!college) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white px-3 py-2 mb-4 rounded"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded shadow mb-4">
        <h1 className="text-3xl font-bold">{college.name}</h1>
        <p className="text-gray-600">📍 {college.location}</p>
      </div>

      <div className="bg-white p-6 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-3">Overview</h2>

        <p>💰 Fees: ₹{college.fees}</p>
        <p>⭐ Rating: {college.rating}</p>
        <p>📊 Placement: {college.placement_percentage}%</p>

        <hr className="my-3" />

        <p>🏫 Type: {college.type}</p>
        <p>📅 Established: {college.established_year}</p>
        <p>🏆 NAAC Grade: {college.naac_grade}</p>

        <a href={college.website} target="_blank" rel="noreferrer" className="text-blue-500">
          🌐 Visit Website
        </a>

        <p className="mt-3 text-gray-700">{college.description}</p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Courses Offered</h2>

        {courses.length === 0 ? (
          <p className="text-red-500">No courses available ❌</p>
        ) : (
          <ul className="list-disc ml-6">
            {courses.map((c, i) => (
              <li key={i}>{c.course_name}</li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

export default CollegeDetail;
