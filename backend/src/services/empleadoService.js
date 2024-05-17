const database = require("../database");

const empleadosService = {
  crearEmpleado: (nuevoEmpleado) => {
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
      contrasena, // Agregamos la contraseña
    } = nuevoEmpleado;

    return new Promise((resolve, reject) => {
      database.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        connection.beginTransaction(async (transactionError) => {
          if (transactionError) {
            connection.release();
            reject(transactionError);
            return;
          }

          try {
            // Insertar en la tabla `usuarios`
            const insertUsuarioQuery = `INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)`;
            const [usuarioResult] = await connection
              .promise()
              .query(insertUsuarioQuery, [usuario, contrasena]);

            // Insertar en la tabla `empleados`
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
            const [empleadoResult] = await connection
              .promise()
              .query(insertEmpleadoQuery, empleadoValues);

            connection.commit((commitError) => {
              if (commitError) {
                connection.rollback(() => {
                  connection.release();
                  reject(commitError);
                });
              } else {
                connection.release();
                resolve({ id: empleadoResult.insertId, ...nuevoEmpleado });
              }
            });
          } catch (error) {
            connection.rollback(() => {
              connection.release();
              reject(error);
            });
          }
        });
      });
    });
  },
  // ! ---------------------------------------------------------------
  getAllEmpleados: () => {
    const query =
      "SELECT empleados.*, roles.nombre_rol AS cargo FROM empleados LEFT JOIN roles ON empleados.cargo = roles.id_rol";
    return new Promise((resolve, reject) => {
      database.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },

  getEmpleadoPorId: (empleadoId) => {
    const query = "SELECT * FROM empleados WHERE id_empleado = ?";
    return new Promise((resolve, reject) => {
      database.query(query, [empleadoId], (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results[0]); // Devuelve el primer resultado (debería ser único)
      });
    });
  },

  // TODO =================================================================
  // ! codigo para la eliminacion de un empleado
  eliminarEmpleado: (empleadoId) => {
    const query = "DELETE FROM empleados WHERE id_empleado = ?";
    return new Promise((resolve, reject) => {
      database.query(query, [empleadoId], (error, results, fields) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  },
  // TODO =================================================================
};

module.exports = empleadosService;
