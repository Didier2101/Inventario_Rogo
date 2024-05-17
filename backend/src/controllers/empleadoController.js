const empleadosService = require("../services/empleadoService");

const empleadosController = {
  getAllEmpleados: (req, res) => {
    empleadosService
      .getAllEmpleados()
      .then((empleados) => {
        res.status(200).json(empleados);
      })
      .catch((error) => {
        console.error("Error al obtener empleados:", error);
        res.status(500).send("Error al obtener empleados");
      });
  },
  getEmpleadoPorId: (req, res) => {
    const empleadoId = req.params.id_empleado;
    empleadosService
      .getEmpleadoPorId(empleadoId)
      .then((empleado) => {
        if (!empleado) {
          res.status(404).send("Empleado no encontrado");
          return;
        }
        res.status(200).json(empleado);
      })
      .catch((error) => {
        console.error("Error al obtener empleado por ID:", error);
        res.status(500).send("Error al obtener empleado por ID");
      });
  },
};

module.exports = empleadosController;
