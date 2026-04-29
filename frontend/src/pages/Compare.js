import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";  

function Compare() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!location.state?.ids) return;

    fetch(`${API}/compare`, {  
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
      </div>
    );
  }

  return (
    <div className="p-6">

      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white px-3 py-2 mb-4 rounded"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Compare Colleges</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Location</th>
            <th>Fees</th>
            <th>Rating</th>
            <th>Placement %</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="text-center">
              <td>{c.name}</td>
              <td>{c.location}</td>
              <td>₹{c.fees}</td>
              <td>{c.rating}</td>
              <td>{c.placement_percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Compare;
