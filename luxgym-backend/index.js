const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

console.log('Iniciando servidor...');

const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Probar conexión a la base de datos al iniciar
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Conexión a la base de datos exitosa');
    conn.release();
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
})();

// Ruta de prueba para saber si el servidor funciona
app.get('/ping', (req, res) => {
  console.log('Ruta /ping llamada');
  res.send('pong');
});

// Rutas de ranking...
app.get('/api/ranking', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT nombre, puntaje, corazones_restantes, tiempo FROM ranking ORDER BY puntaje DESC LIMIT 10'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener ranking:', error);
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

=======
// Ruta para guardar puntaje
>>>>>>> parent of 4a307de (,)
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
    res.json({ message: 'Puntaje guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar puntaje:', error);
    res.status(500).json({ error: 'Error al guardar puntaje' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

pool.getConnection()
  .then(() => console.log(`✅ Conectado a la base local: ${process.env.DB_NAME}`))
  .catch(err => console.error('❌ Error al conectar a la base local:', err));
