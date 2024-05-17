const empleadosService = require("../services/empleadoService");

const empleadosController = {
  crearEmpleado: async (req, res) => {
    try {
      const nuevoEmpleado = req.body; // Obtén los datos del nuevo empleado del cuerpo de la solicitud
      const empleadoCreado = await empleadosService.crearEmpleado(
        nuevoEmpleado
      );
      res.status(201).json(empleadoCreado); // Devuelve el nuevo empleado creado con el código 201 (Created)
    } catch (error) {
      console.error("Error al crear empleado:", error);
      res.status(500).send("Error al crear empleado");
    }
  },

  // TODO =================================================================
  // ! codigo para mostrar todos los empleados
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
  // TODO =================================================================

  // TODO =================================================================
  // ! codigo para ver empleado por ID
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
  // TODO =================================================================

  // TODO =================================================================
  // ! codigo para la eliminacion de un empleado
  eliminarEmpleado: (req, res) => {
    const empleadoId = req.params.id_empleado;
    empleadosService
      .eliminarEmpleado(empleadoId)
      .then(() => {
        res.status(200).send("Empleado eliminado con éxito");
      })
      .catch((error) => {
        console.error("Error al eliminar empleado:", error);
        res.status(500).send("Error al eliminar empleado");
      });
  },
  // TODO =================================================================
};

module.exports = empleadosController;
