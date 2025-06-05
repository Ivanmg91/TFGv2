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

// Añadir favorito
app.post('/api/favoritos', async (req, res) => {
  try {
    const { usuario_id, show_id, titulo, descripcion, anio } = req.body;
    if (!usuario_id || !show_id) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    // Busca o inserta la película si no existe
    let [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    let pelicula_id;
    if (pelicula.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO peliculas (show_id, titulo, descripcion, anio) VALUES (?, ?, ?, ?)',
        [show_id, titulo, descripcion, anio]
      );
      pelicula_id = result.insertId;
    } else {
      pelicula_id = pelicula[0].id;
    }
    // Añade a favoritos si no existe ya
    await pool.execute(
      'INSERT IGNORE INTO favoritos (usuario_id, pelicula_id, fecha_agregado) VALUES (?, ?, NOW())',
      [usuario_id, pelicula_id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Quitar favorito
app.delete('/api/favoritos', async (req, res) => {
  try {
    const { usuario_id, show_id } = req.body;
    if (!usuario_id || !show_id) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    let [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    if (pelicula.length === 0) return res.json({ success: false });
    await pool.execute(
      'DELETE FROM favoritos WHERE usuario_id = ? AND pelicula_id = ?',
      [usuario_id, pelicula[0].id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Comprobar si es favorito
app.get('/api/favoritos/:usuario_id/:show_id', async (req, res) => {
  try {
    const { usuario_id, show_id } = req.params;
    let [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    if (pelicula.length === 0) return res.json({ favorito: false });
    let [fav] = await pool.execute(
      'SELECT * FROM favoritos WHERE usuario_id = ? AND pelicula_id = ?',
      [usuario_id, pelicula[0].id]
    );
    res.json({ favorito: fav.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener usuario por firebase_uid
app.get('/api/usuarios/:firebase_uid', async (req, res) => {
  try {
    const { firebase_uid } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE firebase_uid = ?',
      [firebase_uid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

















// Puerto
const PORT = process.env.DB_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});