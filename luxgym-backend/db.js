const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'switchyard.proxy.rlwy.net',
  user: 'root',
  password: 'WyYSAyWsUjshvBRfaHqmKtXNsUdmtzjS',
  database: 'railway',
  port: 49582,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
