const express = require("express");
const router = express.Router();
const empleadosController = require("../controllers/empleadoController");

router.get("/", empleadosController.getEmpleados);

module.exports = router;
