const express = require("express");
const cors = require("cors");
const pool = require("./database");

const empleadosRouter = require("./routes/empleadoRouter");
const usuariosRouter = require("./routes/usuarioRouter");
const clientesRouter = require("./routes/clientesRouter");
const proveedoresRouter = require("./routes/proveedorRouter");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(empleadosRouter);
app.use(usuariosRouter);
app.use(clientesRouter);
app.use(proveedoresRouter);

app.listen(port, async () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
