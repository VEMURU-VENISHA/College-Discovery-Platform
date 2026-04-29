const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// ✅ CORS - only once, before routes
app.use(cors({
  origin: ['https://college-discovery-platform-nine.vercel.app', 'http://localhost:3000']
}));
app.use(express.json());

// ✅ DB Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ GET ALL COLLEGES
app.get('/colleges', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colleges');
    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ SEARCH
app.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    const result = await pool.query(
      "SELECT * FROM colleges WHERE name ILIKE $1",
      [`%${name}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ FILTER
app.get('/filter', async (req, res) => {
  try {
    const { location = "", maxFees = 1000000 } = req.query;
    const result = await pool.query(
      "SELECT * FROM colleges WHERE location ILIKE $1 AND fees <= $2",
      [`%${location}%`, maxFees]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("FILTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ COLLEGE DETAIL (was MISSING!)
app.get('/college/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const collegeResult = await pool.query(
      'SELECT * FROM colleges WHERE id = $1', [id]
    );
    const coursesResult = await pool.query(
      'SELECT * FROM courses WHERE college_id = $1', [id]
    );
    if (collegeResult.rows.length === 0) {
      return res.status(404).json({ error: "College not found" });
    }
    res.json({
      college: collegeResult.rows[0],
      courses: coursesResult.rows
    });
  } catch (err) {
    console.error("DETAIL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ COMPARE (was MISSING!)
app.post('/compare', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) return res.json([]);
    const result = await pool.query(
      'SELECT * FROM colleges WHERE id = ANY($1::int[])', [ids]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("COMPARE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ QUESTIONS (was MISSING!)
app.get('/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faqs');
    res.json(result.rows);
  } catch (err) {
    console.error("QUESTIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
