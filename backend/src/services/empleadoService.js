// Importar el módulo de conexión a la base de datos
const pool = require("../database");
const bcrypt = require("bcrypt");

// Función para agregar un empleado a la base de datos
const agregarEmpleado = async (empleado) => {
  const hashedPassword = await bcrypt.hash(empleado.contrasena, 10);
  try {
    const usuarioInsertQuery =
      "INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)";
    const usuarioValues = [empleado.usuario, hashedPassword];
    const [usuarioInsertResult] = await pool.query(
      usuarioInsertQuery,
      usuarioValues
    );
    // ! ====================================================================================================
    // Insertar los datos del empleado en la tabla empleados
    const empleadoInsertQuery =
      "INSERT INTO empleados (cedula, nombres, correo, telefono, direccion, cargo, salario, fecha_ingreso, fecha_nacimiento, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const empleadoValues = [
      empleado.cedula,
      empleado.nombres,
      empleado.correo,
      empleado.telefono,
      empleado.direccion,
      empleado.cargo,
      empleado.salario,
      empleado.fecha_ingreso,
      empleado.fecha_nacimiento,
      usuarioInsertResult.insertId,
    ];
    const [empleadoInsertResult] = await pool.query(
      empleadoInsertQuery,
      empleadoValues
    );

    console.log("Empleado agregado correctamente a la base de datos");
  } catch (error) {
    console.error("Error al agregar el empleado a la base de datos:", error);
    throw error;
  }
};
// ! ====================================================================================================
// Función para obtener todos los empleados de la base de datos
const obtenerTodosEmpleados = async () => {
  try {
    // Consultar todos los empleados con el nombre del cargo en lugar del ID
    const query =
      "SELECT empleados.*, roles.nombre_rol AS cargo FROM empleados LEFT JOIN roles ON empleados.cargo = roles.id_rol";
    const [empleados, _] = await pool.query(query);
    return empleados;
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    throw error;
  }
};
// ! ====================================================================================================
// Agrega la función para actualizar un empleado en el servicio de empleado

const actualizarEmpleado = async (idEmpleado, nuevoEmpleado) => {
  try {
    // Verificar si la nueva cédula ya existe en otro empleado
    const checkCedulaQuery =
      "SELECT id_empleado FROM empleados WHERE cedula = ? AND id_empleado != ?";
    const [existingEmployee] = await pool.query(checkCedulaQuery, [
      nuevoEmpleado.cedula,
      idEmpleado,
    ]);

    if (existingEmployee.length > 0) {
      throw {
        code: "CEDULA_DUPLICADA",
        message:
          "La cédula ingresada ya está registrada. Por favor, ingrese una cédula diferente.",
      };
    }

    // Continuar con la actualización del empleado si no hay cédula duplicada
    const query = `
      UPDATE empleados 
      SET 
        cedula = ?,
        nombres = ?,
        correo = ?,
        telefono = ?,
        direccion = ?,
        cargo = ?,
        salario = ?,
        fecha_ingreso = ?,
        fecha_nacimiento = ?
      WHERE id_empleado = ?
    `;
    const values = [
      nuevoEmpleado.cedula,
      nuevoEmpleado.nombres,
      nuevoEmpleado.correo,
      nuevoEmpleado.telefono,
      nuevoEmpleado.direccion,
      nuevoEmpleado.cargo,
      nuevoEmpleado.salario,
      nuevoEmpleado.fecha_ingreso,
      nuevoEmpleado.fecha_nacimiento,
      idEmpleado,
    ];
    await pool.query(query, values);

    console.log("Empleado actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el empleado:", error);
    throw error;
  }
};

// ! ====================================================================================================
const eliminarEmpleado = async (idEmpleado) => {
  try {
    // Eliminar el empleado de la base de datos
    const query = "DELETE FROM empleados WHERE id_empleado = ?";
    const [result] = await pool.query(query, [idEmpleado]);

    // Verificar si se eliminó algún registro
    if (result.affectedRows === 0) {
      throw new Error("No se encontró ningún empleado con el ID proporcionado");
    }

    console.log("Empleado eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar el empleado:", error);
    throw error;
  }
};
// ! ====================================================================================================

module.exports = {
  agregarEmpleado,
  obtenerTodosEmpleados,
  actualizarEmpleado,
  eliminarEmpleado,
};
