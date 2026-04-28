import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function Compare() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!location.state?.ids) return;
    fetch("http://localhost:5000/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: location.state.ids }),
    })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, [location.state]);
  if (!location.state?.ids || location.state.ids.length === 0) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-3 py-2 mb-4 rounded"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-red-500">
          No colleges selected ❌
        </h1>
        <p>Please go back and select colleges to compare.</p>
      </div>
    );
  }
  return (
    <div className="p-6">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white px-3 py-2 mb-4 rounded"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Compare Colleges</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Fees</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Placement %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="text-center hover:bg-gray-100">
              <td className="p-2 border font-semibold">{c.name}</td>
              <td className="p-2 border">{c.location}</td>
              <td className="p-2 border text-green-600">₹{c.fees}</td>
              <td className="p-2 border text-yellow-500">{c.rating}</td>
              <td className="p-2 border text-blue-500">
                {c.placement_percentage}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Compare;