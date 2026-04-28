const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Routes
app.get('/colleges', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colleges');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.get('/search', async (req, res) => {
  const { name } = req.query;
  const result = await pool.query(
    "SELECT * FROM colleges WHERE name ILIKE $1",
    [`%${name}%`]
  );
  res.json(result.rows);
});

app.get('/filter', async (req, res) => {
  const { location = "", maxFees = 1000000 } = req.query;
  const result = await pool.query(
    "SELECT * FROM colleges WHERE location ILIKE $1 AND fees <= $2",
    [`%${location}%`, maxFees]
  );
  res.json(result.rows);
});

app.post('/compare', async (req, res) => {
  const { ids } = req.body;
  if (!ids || ids.length === 0) return res.json([]);
  const result = await pool.query(
    "SELECT * FROM colleges WHERE id = ANY($1)",
    [ids]
  );
  res.json(result.rows);
});

app.get('/college/:id', async (req, res) => {
  const { id } = req.params;

  const college = await pool.query(
    "SELECT * FROM colleges WHERE id = $1",
    [id]
  );

  const courses = await pool.query(
    "SELECT course_name FROM courses WHERE college_id = $1",
    [id]
  );

  res.json({
    college: college.rows[0],
    courses: courses.rows
  });
});

app.get("/questions", async (req, res) => {
  const result = await pool.query("SELECT * FROM qa ORDER BY id DESC");
  res.json(result.rows);
});

// 🔥 IMPORTANT (Render PORT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});