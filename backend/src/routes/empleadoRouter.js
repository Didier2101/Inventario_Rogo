const express = require("express");
const router = express.Router();
const {
  getAllEmpleados,
  getEmpleadoPorId,
  //   eliminarEmpleado,
} = require("../controllers/empleadoController");

// Obtener todos los empleados
router.get("/empleados", getAllEmpleados);
router.get("/empleados/:id_empleado", getEmpleadoPorId);
// router.delete("/empleados/:id", eliminarEmpleado);

// router.post("/empleados", (req, res) => {
//   res.send("creando un  empleado");
// });
// router.put("/empleados/:id", (req, res) => {
//   res.send("actualizando un empleado");
// });
// router.delete("/empleados/:id", (req, res) => {
//   res.send("eliminando un empleado");
// });

module.exports = router;
