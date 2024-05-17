const express = require("express");
const router = express.Router();
const {
  getAllEmpleados,
  crearEmpleado,
  getEmpleadoPorId,
  eliminarEmpleado,
} = require("../controllers/empleadoController");

// Obtener todos los empleados
router.get("/empleados", getAllEmpleados);
router.post("/empleados", crearEmpleado);
router.get("/empleados/:id_empleado", getEmpleadoPorId);
router.delete("/empleados/:id_empleado", eliminarEmpleado);

module.exports = router;
