// telecypher-backend/server.js
console.log("--- Script server.js starting ---");

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import the Pool object from 'pg'

const app = express();
const PORT = process.env.PORT || 3001;

console.log("--- Modules imported, PORT is:", PORT, "---");

// --- PostgreSQL Connection Pool Setup ---
const pool = new Pool({
  user: 'telecypher_user', // Replace with your database user
  host: 'localhost',
  database: 'telecypher_db', // Replace with your database name
  password: 'Thankyou777!', // Replace with your database user's password
  port: 5432,
});

// Test the database connection on application start
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database or running query', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL. Server time:', res.rows[0].now);
  }
});
// --- End PostgreSQL Connection Pool Setup ---

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies, important for POST requests

// --- Basic Test Routes (Keep these for now) ---
app.get('/', (req, res) => {
  res.send('Telecypher backend is running!');
});

app.get('/api/test-message', (req, res) => {
  res.json({ message: "JSON Message from Telecypher Backend on Port 3001! It works!" });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version();');
    client.release();
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error executing query for /api/db-test', err.stack);
    res.status(500).json({ success: false, error: 'Failed to connect to database or execute query' });
  }
});
// --- End Basic Test Routes ---


// --- NEW: Phonemes API Endpoints ---

// POST /api/phonemes - Create a new phoneme
app.post('/api/phonemes', async (req, res) => {
  // Get sound_notation and letter_representation from the request body
  const { sound_notation, letter_representation } = req.body;

  // Basic validation: ensure both fields are provided
  if (!sound_notation || !letter_representation) {
    return res.status(400).json({ error: 'Both sound_notation and letter_representation are required.' });
  }

  try {
    // SQL query to insert a new phoneme and return the created row
    const newPhonemeQuery = `
      INSERT INTO phonemes (sound_notation, letter_representation) 
      VALUES ($1, $2) 
      RETURNING *; 
    `;
    // Values array for parameterized query (prevents SQL injection)
    const values = [sound_notation, letter_representation];

    const result = await pool.query(newPhonemeQuery, values);
    
    // Send back the newly created phoneme (result.rows[0]) with a 201 Created status
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error executing POST /api/phonemes query', err.stack);
    // Check for unique constraint violation (e.g., if sound_notation already exists)
    if (err.code === '23505') { // PostgreSQL unique_violation error code
        return res.status(409).json({ error: 'This sound_notation already exists.' });
    }
    res.status(500).json({ error: 'Failed to create phoneme' });
  }
});

// GET /api/phonemes - Get all phonemes
app.get('/api/phonemes', async (req, res) => {
  try {
    const getAllPhonemesQuery = 'SELECT * FROM phonemes ORDER BY id ASC;';
    const result = await pool.query(getAllPhonemesQuery);
    
    // Send back the array of phonemes
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error executing GET /api/phonemes query', err.stack);
    res.status(500).json({ error: 'Failed to retrieve phonemes' });
  }
});

// --- End Phonemes API Endpoints ---


app.post('/api/data', (req, res) => { // Keep this old example if you want, or remove it
  console.log('Received data:', req.body);
  res.json({ message: 'Data received successfully', data: req.body });
});

console.log("--- About to call app.listen ---");

app.listen(PORT, () => {
  console.log(`Telecypher backend listening on port ${PORT}`);
});