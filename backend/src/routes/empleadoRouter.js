const express = require("express");
const router = express.Router();
const {
  crearEmpleado,
  obtenerTodosEmpleados,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerEmpleadoPorId,
} = require("../controllers/empleadoController");

// Obtener todos los empleados
// Crear empleado
router.post("/", crearEmpleado);

// Obtener todos los empleados
router.get("/", obtenerTodosEmpleados);

// Actualizar empleado por ID
router.put("/:id_empleado", actualizarEmpleado);

// Eliminar empleado por ID
router.delete("/:id_empleado", eliminarEmpleado);

// Obtener empleado por ID
router.get("/:id_empleado", obtenerEmpleadoPorId);

module.exports = router;
