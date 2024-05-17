const database = require("../database");

const empleadosService = {
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
    const query = "SELECT * FROM empleados WHERE id_empleado";
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
};

module.exports = empleadosService;
