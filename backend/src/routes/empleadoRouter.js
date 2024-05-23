const express = require("express");
const router = express.Router();
const {
  crearEmpleado,
  obtenerTodosEmpleados,
  actualizarEmpleado,
  eliminarEmpleado,
} = require("../controllers/empleadoController");

// Obtener todos los empleados
router.post("/empleados", crearEmpleado);
router.get("/empleados", obtenerTodosEmpleados);
router.put("/empleados/:id_empleado", actualizarEmpleado);
router.delete("/empleados/:id_empleado", eliminarEmpleado);

module.exports = router;
