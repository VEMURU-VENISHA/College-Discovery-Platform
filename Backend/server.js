const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'college_db',
  password: 'root',
  port: 5433,
});
app.get('/colleges', async (req, res) => {
  const result = await pool.query('SELECT * FROM colleges');
  res.json(result.rows);
});
app.get('/search', async (req, res) => {
  const { name } = req.query;
  const result = await pool.query("SELECT * FROM colleges WHERE name ILIKE $1",[`%${name}%`]);
  res.json(result.rows);
});
app.get('/filter', async (req, res) => {
  const { location = "", maxFees = 1000000 } = req.query;
  try {
    const result = await pool.query(`SELECT * FROM colleges WHERE location ILIKE $1  AND fees <= $2`, [`%${location}%`, maxFees] );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post('/compare', async (req, res) => {
  const { ids } = req.body;
  if (!ids || ids.length === 0) return res.json([]);
  const result = await pool.query("SELECT * FROM colleges WHERE id = ANY($1)", [ids] );
  res.json(result.rows);
});
app.get('/college/:id', async (req, res) => {
  const { id } = req.params;
  const college = await pool.query( "SELECT * FROM colleges WHERE id = $1", [id] );
  const courses = await pool.query( "SELECT course_name FROM courses WHERE college_id = $1", [id]);
  res.json({
    college: college.rows[0],
    courses: courses.rows
  });
});
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  try {
    const result = await pool.query( "SELECT answer FROM qa WHERE question ILIKE $1 LIMIT 1",[`%${question}%`] );
    if (result.rows.length > 0) {
      res.json({ answer: result.rows[0].answer });
    } else {
      res.json({ answer: "Sorry, no answer found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/questions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM qa ORDER BY id DESC" );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
}
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});