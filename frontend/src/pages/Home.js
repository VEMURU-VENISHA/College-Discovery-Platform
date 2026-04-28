import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [location, setLocation] = useState("");
  const [maxFees, setMaxFees] = useState(1000000);

  const navigate = useNavigate();

  // ✅ YOUR LIVE BACKEND URL
  const API = "https://college-backend-q6hz.onrender.com";

  // 🔄 Load all colleges
  useEffect(() => {
    fetch(`${API}/colleges`)
      .then(res => res.json())
      .then(data => setColleges(data))
      .catch(err => console.error(err));
  }, []);

  // 🔍 Search
  const handleSearch = () => {
    fetch(`${API}/search?name=${search}`)
      .then(res => res.json())
      .then(data => setColleges(data))
      .catch(err => console.error(err));
  };

  // 🎯 Filter
  const handleFilter = () => {
    fetch(`${API}/filter?location=${location}&maxFees=${maxFees}`)
      .then(res => res.json())
      .then(data => setColleges(data))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">College Discovery</h1>

      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap gap-3 mb-4">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search college..."
          className="border p-2 rounded"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Search
        </button>

        {/* LOCATION FILTER */}
        <select
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Locations</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Chennai">Chennai</option>
        </select>

        {/* FEES FILTER */}
        <select
          onChange={(e) => setMaxFees(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="1000000">All Fees</option>
          <option value="200000">Below 2 Lakhs</option>
          <option value="300000">Below 3 Lakhs</option>
        </select>

        <button
          onClick={handleFilter}
          className="bg-purple-500 text-white px-3 py-2 rounded"
        >
          Apply Filter
        </button>

        {/* COMPARE */}
        <button
          onClick={() => navigate("/compare", { state: { ids: selected } })}
          className="bg-green-500 text-white px-3 py-2 rounded"
        >
          Compare ({selected.length})
        </button>

        {/* Q&A */}
        <button
          onClick={() => navigate("/questions")}
          className="ml-2 bg-purple-500 text-white px-3 py-2 rounded"
        >
          Q&A
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4">
        {colleges.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/college/${c.id}`)}
            className="bg-white p-4 rounded shadow cursor-pointer hover:scale-105 transition"
          >
            <input
              type="checkbox"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelected([...selected, c.id]);
                } else {
                  setSelected(selected.filter(id => id !== c.id));
                }
              }}
            />

            <h3 className="font-bold text-lg">{c.name}</h3>
            <p className="text-gray-600">{c.location}</p>
            <p className="text-green-600 font-semibold">₹{c.fees}</p>
            <p className="text-yellow-500">⭐ {c.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;