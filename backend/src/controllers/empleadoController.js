const empleadoService = require("../services/empleadoService");

const crearEmpleado = async (req, res) => {
  try {
    const empleado = req.body;
    await empleadoService.agregarEmpleado(empleado);
    res.status(201).json({ message: "Empleado creado exitosamente" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({
        error: "CEDULA_DUPLICADA",
        message:
          "La cédula ingresada ya está registrada. Por favor, ingrese una cédula diferente.",
      });
    } else {
      console.error("Error al crear los empleados:", error);
      res.status(500).json({ message: "Error al crear los empleados" });
    }
  }
};

// TODO =================================================================
// Controlador para obtener todos los empleados
const obtenerTodosEmpleados = async (req, res) => {
  try {
    const empleados = await empleadoService.obtenerTodosEmpleados();
    res.status(200).json(empleados);
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    res.status(500).json({ message: "Error al obtener los empleados" });
  }
};
// TODO =================================================================
// Controlador para actualizar un empleado
const actualizarEmpleado = async (req, res) => {
  const idEmpleado = req.params.id_empleado;
  const nuevoEmpleado = req.body;
  try {
    await empleadoService.actualizarEmpleado(idEmpleado, nuevoEmpleado);
    res.status(200).json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    if (error.code === "CEDULA_DUPLICADA") {
      res.status(400).json({
        message:
          "La cédula ingresada ya está registrada. Por favor, ingrese una cédula diferente.",
      });
    } else {
      console.error("Error al actualizar el empleado:", error);
      res.status(500).json({ message: "Error al actualizar el empleado" });
    }
  }
};

// TODO =================================================================
const eliminarEmpleado = async (req, res) => {
  const idEmpleado = req.params.id_empleado;
  try {
    await empleadoService.eliminarEmpleado(idEmpleado);
    res.status(200).json();
  } catch (error) {
    res.status(500).json();
  }
};

module.exports = {
  crearEmpleado,
  obtenerTodosEmpleados,
  actualizarEmpleado,
  eliminarEmpleado,
};
