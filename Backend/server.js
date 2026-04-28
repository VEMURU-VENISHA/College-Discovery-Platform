const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to Render DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ TEST ROUTE
app.get('/', (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ COLLEGES
app.get('/colleges', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colleges');
    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// ✅ SEARCH
app.get('/search', async (req, res) => {
  const { name } = req.query;
  const result = await pool.query(
    "SELECT * FROM colleges WHERE name ILIKE $1",
    [`%${name}%`]
  );
  res.json(result.rows);
});

// ✅ FILTER
app.get('/filter', async (req, res) => {
  const { location = "", maxFees = 1000000 } = req.query;
  const result = await pool.query(
    "SELECT * FROM colleges WHERE location ILIKE $1 AND fees <= $2",
    [`%${location}%`, maxFees]
  );
  res.json(result.rows);
});

// ✅ PORT (Render important)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});