const express = require("express");
const cors = require("cors");
const database = require("./database");

const empleadosRouter = require("./routes/empleadoRouter");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.use(empleadosRouter);

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
