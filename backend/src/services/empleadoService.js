const pool = require("../database");

const empleadosService = {
  crearEmpleado: async (nuevoEmpleado) => {
    const {
      cedula,
      nombres,
      correo,
      telefono,
      direccion,
      cargo,
      salario,
      fecha_ingreso,
      fecha_nacimiento,
      usuario,
      contrasena,
    } = nuevoEmpleado;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insertar el usuario en la tabla 'usuarios'
      const insertUsuarioQuery = `INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)`;
      const [usuarioResult] = await connection.query(insertUsuarioQuery, [
        usuario,
        contrasena,
      ]);
      console.log("Usuario creado con ID:", usuarioResult.insertId);

      // Insertar el empleado en la tabla 'empleados'
      const insertEmpleadoQuery = `INSERT INTO empleados (cedula, nombres, correo, telefono, direccion, cargo, salario, fecha_ingreso, fecha_nacimiento, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const empleadoValues = [
        cedula,
        nombres,
        correo,
        telefono,
        direccion,
        cargo,
        salario,
        fecha_ingreso,
        fecha_nacimiento,
        usuarioResult.insertId,
      ];
      const [empleadoResult] = await connection.query(
        insertEmpleadoQuery,
        empleadoValues
      );
      console.log("Empleado creado con ID:", empleadoResult.insertId);

      await connection.commit();
      return { id: empleadoResult.insertId, ...nuevoEmpleado };
    } catch (error) {
      await connection.rollback();
      console.error("Error durante la transacción:", error);
      throw error;
    } finally {
      connection.release();
    }
  },

  // ! ---------------------------------------------------------------
  getAllEmpleados: async () => {
    const query =
      "SELECT empleados.*, roles.nombre_rol AS cargo FROM empleados LEFT JOIN roles ON empleados.cargo = roles.id_rol";
    try {
      const [results] = await pool.query(query);
      return results;
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      throw error;
    }
  },

  getEmpleadoPorId: async (empleadoId) => {
    const query = "SELECT * FROM empleados WHERE id_empleado = ?";
    try {
      const [results] = await pool.query(query, [empleadoId]);
      return results[0]; // Devuelve el primer resultado (debería ser único)
    } catch (error) {
      console.error("Error al obtener empleado por ID:", error);
      throw error;
    }
  },

  // TODO =================================================================
  // ! codigo para la eliminacion de un empleado
  eliminarEmpleado: async (empleadoId) => {
    const query = "DELETE FROM empleados WHERE id_empleado = ?";
    try {
      await pool.query(query, [empleadoId]);
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      throw error;
    }
  },
  // TODO =================================================================
};

module.exports = empleadosService;
