const express = require("express");
const cors = require("cors");
const pool = require("./src/database"); // Asegúrate de que la ruta a database.js sea correcta
const path = require("path");

const empleadosRouter = require("./src/routes/empleadoRouter");
const usuariosRouter = require("./src/routes/usuarioRouter");
const clientesRouter = require("./src/routes/clientesRouter");
const proveedoresRouter = require("./src/routes/proveedorRouter");
const puntosVentasRouter = require("./src/routes/puntoVentaRouter");
const bodegasRouter = require("./src/routes/bodegaRouter");
const productosRouter = require("./src/routes/productoRouter");
const cargosRouter = require("./src/routes/cargoRouter");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(empleadosRouter);
app.use(usuariosRouter);
app.use(clientesRouter);
app.use(proveedoresRouter);
app.use(puntosVentasRouter);
app.use(bodegasRouter);
app.use(productosRouter);
app.use(cargosRouter);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Ruta catch-all para servir index.html en caso de una ruta desconocida
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.listen(port, async () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
