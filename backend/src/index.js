const express = require("express");
const cors = require("cors");
const pool = require("./database");

const empleadosRouter = require("./routes/empleadoRouter");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.use(empleadosRouter);

app.listen(port, async () => {
  try {
    await pool.getConnection();
    console.log("Conexión a la base de datos exitosa");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
