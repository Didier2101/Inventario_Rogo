const mysql2 = require("mysql2/promise");
require("dotenv").config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
  } catch (err) {}
})();

module.exports = pool;
