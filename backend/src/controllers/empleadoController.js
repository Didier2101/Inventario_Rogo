const empleadosService = require("../services/empleadoService");

const empleadosController = {
  getEmpleados: (req, res) => {
    empleadosService
      .getEmpleados()
      .then((empleados) => {
        res.status(200).json(empleados);
      })
      .catch((error) => {
        console.error("Error al obtener empleados:", error);
        res.status(500).send("Error al obtener empleados");
      });
  },
};

module.exports = empleadosController;
