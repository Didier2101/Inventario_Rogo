const database = require("../database");

const empleadosService = {
  getEmpleados: () => {
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
};

module.exports = empleadosService;
