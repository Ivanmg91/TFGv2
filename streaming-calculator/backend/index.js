require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const pool = require('./db');

app.use(cors());
app.use(express.json());

// Ruta para registrar usuario
app.post('/api/usuarios', async (req, res) => {
  try {    
    const { firebase_uid, nombre, email } = req.body;
    if (!firebase_uid || !nombre || !email) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    const fecha_creacion = new Date().toISOString().slice(0, 19).replace("T", " ");
    const query = 'INSERT INTO usuarios (firebase_uid, nombre, email, fecha_creacion) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(query, [firebase_uid, nombre, email, fecha_creacion]);
    res.status(201).json({ id: result.insertId, firebase_uid, nombre, email, fecha_creacion });
  } catch (error) {
    console.error('Error en el endpoint /api/usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Puerto
const PORT = process.env.DB_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});