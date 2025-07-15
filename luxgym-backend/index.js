const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para guardar puntaje
app.post('/api/ranking', async (req, res) => {
  const { nombre, puntaje, corazones_restantes, tiempo } = req.body;

  if (!nombre || puntaje === undefined) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    await pool.execute(
      'INSERT INTO ranking (nombre, puntaje, corazones_restantes, tiempo) VALUES (?, ?, ?, ?)',
      [nombre, puntaje, corazones_restantes, tiempo]
    );
    res.status(200).json({ message: 'Puntaje guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar el puntaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener el top 10
app.get('/api/ranking', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT nombre, puntaje, corazones_restantes, tiempo, fecha FROM ranking ORDER BY puntaje DESC LIMIT 10'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener ranking:', error);
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
