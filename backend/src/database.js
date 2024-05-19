const mysql2 = require("mysql2/promise");

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "inventario_sena",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
