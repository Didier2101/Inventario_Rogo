const { pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

(async () => {
  try {
    // Realizar una consulta de prueba para verificar la conexión
    const client = await pool.connect();
    console.log("Conexión a la base de datos exitosa");
    client.release();
  } catch (err) {
    console.error("Error al conectar a la base de datos:", err);
  }
})();

module.exports = pool;
