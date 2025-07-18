const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection()
  .then(conn => {
    console.log(`✅ Conectado correctamente a la base de datos: ${process.env.DB_NAME}`);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err.message);
});

module.exports = pool;
