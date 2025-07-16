const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'https://cristianlorenzo11.github.io'
}));
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
      'SELECT nombre, puntaje, corazones_restantes, tiempo FROM ranking ORDER BY puntaje DESC LIMIT 10'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener ranking:', error);
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// TEST: Insertar un registro de prueba
app.get('/api/test-insert', async (req, res) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO ranking (nombre, puntaje, corazones_restantes, tiempo) VALUES (?, ?, ?, ?)',
      ['TestJugador', 500, 3, 60]
    );
    res.status(200).json({ message: 'Insertado correctamente', result });
  } catch (error) {
    console.error('Error al insertar:', error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

app.get('/ping', (req, res) => res.send('pong'));
