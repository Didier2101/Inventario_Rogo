const express = require("express");
const cors = require("cors");
const pool = require("./database");
const path = require("path");

const empleadosRouter = require("./routes/empleadoRouter");
const usuariosRouter = require("./routes/usuarioRouter");
const clientesRouter = require("./routes/clientesRouter");
const puntosVentasRouter = require("./routes/puntoVentaRouter");
const bodegasRouter = require("./routes/bodegaRouter");
const productosRouter = require("./routes/productoRouter");
const cargosRouter = require("./routes/cargoRouter");
// const ventasRouter = require("./")

const corsOptions = {
  origin: "https://tu-frontend-url.com", // Sustituye con la URL de tu frontend
};

const app = express();
const port = process.env.PORT || 4000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Si el ambiente es de producción, sirve los archivos estáticos de React
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));

  // Si la ruta no es una API, servir index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.use(empleadosRouter);
app.use(usuariosRouter);
app.use(clientesRouter);
app.use(puntosVentasRouter);
app.use(bodegasRouter);
app.use(productosRouter);
app.use(cargosRouter);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
