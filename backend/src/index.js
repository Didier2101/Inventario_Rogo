const express = require("express");
const cors = require("cors");
const pool = require("./database");

const empleadosRouter = require("./routes/empleadoRouter");
const usuariosRouter = require("./routes/usuarioRouter");
const clientesRouter = require("./routes/clientesRouter");
const proveedoresRouter = require("./routes/proveedorRouter");
const puntosVentasRouter = require("./routes/puntoVentaRouter");
const bodegasRouter = require("./routes/bodegaRouter");
const productosRouter = require("./routes/productoRouter");
const cargosRouter = require("./routes/cargoRouter");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prefijos de ruta correctos
app.use("/empleados", empleadosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/clientes", clientesRouter);
app.use("/proveedores", proveedoresRouter);
app.use("/puntosVentas", puntosVentasRouter);
app.use("/bodegas", bodegasRouter);
app.use("/productos", productosRouter);
app.use("/cargos", cargosRouter);
app.listen(port, async () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
