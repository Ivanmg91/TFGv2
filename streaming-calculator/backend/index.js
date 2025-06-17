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
    let { firebase_uid, nombre, email } = req.body;
    if (!firebase_uid || !email) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    if (!nombre) nombre = "Usuario"; // Valor por defecto si no hay nombre
    const fecha_creacion = new Date().toISOString().slice(0, 19).replace("T", " ");
    const query = 'INSERT INTO usuarios (firebase_uid, nombre, email, fecha_creacion) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(query, [firebase_uid, nombre, email, fecha_creacion]);
    res.status(201).json({ id: result.insertId, firebase_uid, nombre, email, fecha_creacion });
  } catch (error) {
    console.error('Error en el endpoint /api/usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// add favorito
app.post('/api/favoritos', async (req, res) => {
  try {
    const { usuario_id, show_id, titulo, descripcion, anio, poster, plataformas } = req.body;
    if (!usuario_id || !show_id) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    // Busca o inserta la película
    let [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    let pelicula_id;
    if (pelicula.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO peliculas (show_id, titulo, descripcion, anio, poster, plataformas) VALUES (?, ?, ?, ?, ?, ?)',
        [show_id, titulo, descripcion, anio, poster, plataformas ? plataformas.join(',') : null]
      );
      pelicula_id = result.insertId;
    } else {
      pelicula_id = pelicula[0].id;
      // Actualiza poster y plataformas si es necesario
      await pool.execute(
        'UPDATE peliculas SET poster = ?, plataformas = ? WHERE id = ?',
        [poster, plataformas ? plataformas.join(',') : null, pelicula_id]
      );
    }
    // Añade a favoritos si no existe
    await pool.execute(
      'INSERT IGNORE INTO favoritos (usuario_id, pelicula_id, fecha_agregado) VALUES (?, ?, NOW())',
      [usuario_id, pelicula_id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// quit favorito
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

// check favorito
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

// Vistos
app.post('/api/vistos', async (req, res) => {
  try {
    const { usuario_id, show_id, titulo, descripcion, anio } = req.body;
    if (!usuario_id || !show_id) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    // Search or insert the movie if it does not exist
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
    // add vistos if it does not already exist
    await pool.execute(
      'INSERT IGNORE INTO vistos (usuario_id, pelicula_id, fecha_visto) VALUES (?, ?, NOW())',
      [usuario_id, pelicula_id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// quit visto
app.delete('/api/vistos', async (req, res) => {
  try {
    const { usuario_id, show_id } = req.body;
    if (!usuario_id || !show_id) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    let [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    if (pelicula.length === 0) return res.json({ success: false });
    await pool.execute(
      'DELETE FROM vistos WHERE usuario_id = ? AND pelicula_id = ?',
      [usuario_id, pelicula[0].id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// check if is visto
app.get('/api/vistos/:usuario_id/:show_id', async (req, res) => {
  try {
    const { usuario_id, show_id } = req.params;
    let [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    if (pelicula.length === 0) return res.json({ visto: false });
    let [vist] = await pool.execute(
      'SELECT * FROM vistos WHERE usuario_id = ? AND pelicula_id = ?',
      [usuario_id, pelicula[0].id]
    );
    res.json({ visto: vist.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// add or change like/dislike
app.post('/api/likes', async (req, res) => {
  try {
    const { usuario_id, show_id, tipo } = req.body;
    if (!usuario_id || !show_id || !['like', 'dislike'].includes(tipo)) {
      return res.status(400).json({ error: 'Faltan datos o tipo inválido' });
    }
    // search or insert show if not exist
    let [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    let pelicula_id;
    if (pelicula.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO peliculas (show_id, titulo, descripcion, anio) VALUES (?, ?, ?, ?)',
        [show_id, '', '', null]
      );
      pelicula_id = result.insertId;
    } else {
      pelicula_id = pelicula[0].id;
    }
    // delete anterior like/dislike 
    await pool.execute(
      'DELETE FROM likes_dislikes WHERE usuario_id = ? AND pelicula_id = ?',
      [usuario_id, pelicula_id]
    );
    // insert new like/dislike
    await pool.execute(
      'INSERT INTO likes_dislikes (usuario_id, pelicula_id, tipo, fecha) VALUES (?, ?, ?, NOW())',
      [usuario_id, pelicula_id, tipo]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error en /api/likes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// quit like dislike
app.delete('/api/likes', async (req, res) => {
  try {
    const { usuario_id, show_id } = req.body;
    if (!usuario_id || !show_id) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    let [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    if (pelicula.length === 0) return res.json({ success: false });
    await pool.execute(
      'DELETE FROM likes_dislikes WHERE usuario_id = ? AND pelicula_id = ?',
      [usuario_id, pelicula[0].id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//  get likes or dislikes 
app.get('/api/likes/:usuario_id/:show_id', async (req, res) => {
  try {
    const { usuario_id, show_id } = req.params;
    let [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    if (pelicula.length === 0) return res.json({ likes: 0, dislikes: 0, user: null });
    const pelicula_id = pelicula[0].id;
    const [[{ likes }]] = await pool.execute(
      "SELECT COUNT(*) as likes FROM likes_dislikes WHERE pelicula_id = ? AND tipo = 'like'",
      [pelicula_id]
    );
    const [[{ dislikes }]] = await pool.execute(
      "SELECT COUNT(*) as dislikes FROM likes_dislikes WHERE pelicula_id = ? AND tipo = 'dislike'",
      [pelicula_id]
    );
    const [userLike] = await pool.execute(
      "SELECT tipo FROM likes_dislikes WHERE usuario_id = ? AND pelicula_id = ?",
      [usuario_id, pelicula_id]
    );
    res.json({ likes, dislikes, user: userLike[0]?.tipo || null });
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

// Obtener comentarios de una película por show_id
app.get('/api/comentarios/:show_id', async (req, res) => {
  try {
    const { show_id } = req.params;
    // Busca el id interno de la película
    const [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    if (pelicula.length === 0) return res.json([]); // Sin comentarios si no existe la película
    const pelicula_id = pelicula[0].id;
    // Saca los comentarios y el nombre del usuario
    const [comentarios] = await pool.execute(
      `SELECT c.comentario, c.fecha, u.nombre 
       FROM comentarios c 
       JOIN usuarios u ON c.usuario_id = u.id 
       WHERE c.pelicula_id = ? 
       ORDER BY c.fecha DESC`,
      [pelicula_id]
    );
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/comentarios', async (req, res) => {
  try {
    const { usuario_id, show_id, comentario } = req.body;
    if (!usuario_id || !show_id || !comentario) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    // Busca o inserta la película si no existe
    let [pelicula] = await pool.execute('SELECT id FROM peliculas WHERE show_id = ?', [show_id]);
    let pelicula_id;
    if (pelicula.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO peliculas (show_id, titulo, descripcion, anio) VALUES (?, ?, ?, ?)',
        [show_id, '', '', null]
      );
      pelicula_id = result.insertId;
    } else {
      pelicula_id = pelicula[0].id;
    }
    await pool.execute(
      'INSERT INTO comentarios (usuario_id, pelicula_id, comentario, fecha) VALUES (?, ?, ?, NOW())',
      [usuario_id, pelicula_id, comentario]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// get for favoritosmodal
app.get('/api/favoritos/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const [rows] = await pool.execute(
      `SELECT f.*, p.titulo, p.anio, p.poster, p.show_id, p.plataformas
       FROM favoritos f
       JOIN peliculas p ON f.pelicula_id = p.id
       WHERE f.usuario_id = ?
       ORDER BY f.fecha_agregado DESC`,
      [usuario_id]
    );
    // Convierte plataformas a array
    const favoritos = rows.map(fav => ({
      ...fav,
      plataformas: fav.plataformas ? fav.plataformas.split(',').map(p => p.trim()) : []
    }));
    res.json({ favoritos });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar todos los favoritos de un usuario
app.delete('/api/favoritos/todos', async (req, res) => {
  try {
    const { usuario_id } = req.body;
    if (!usuario_id) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    await pool.execute(
      'DELETE FROM favoritos WHERE usuario_id = ?',
      [usuario_id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});













// Puerto
const PORT = process.env.DB_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});