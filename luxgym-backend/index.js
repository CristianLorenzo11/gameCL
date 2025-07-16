const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*', // Para test rápido, después podés poner solo tu dominio front
}));
app.use(express.json());

// Ruta ping para testear
app.get('/ping', (req, res) => res.send('pong'));

// Ruta para obtener ranking
app.get('/api/ranking', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT nombre, puntaje, corazones_restantes, tiempo FROM ranking ORDER BY puntaje DESC LIMIT 10');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

// Ruta para insertar ranking
app.post('/api/ranking', async (req, res) => {
  const { nombre, puntaje, corazones_restantes, tiempo } = req.body;
  if (!nombre || puntaje === undefined) return res.status(400).json({ error: 'Faltan datos' });
  try {
    await pool.execute('INSERT INTO ranking (nombre, puntaje, corazones_restantes, tiempo) VALUES (?, ?, ?, ?)', [nombre, puntaje, corazones_restantes, tiempo]);
    res.json({ message: 'Puntaje guardado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar puntaje' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
