const pool = require("../database");

// Código para crear un proveedor
const agregarProveedor = async (proveedor) => {
  try {
    if (
      !proveedor.nit ||
      !proveedor.empresa ||
      !proveedor.cedula ||
      !proveedor.nombres ||
      !proveedor.telefono ||
      !proveedor.correo_electronico ||
      !proveedor.direccion
    )
      throw new Error("Datos del proveedor incompletos");

    await pool.query("START TRANSACTION");

    // Verificar si el NIT ya existe
    const [proveedoresExistentes] = await pool.query(
      "SELECT * FROM proveedores WHERE nit = ?",
      [proveedor.nit]
    );
    if (proveedoresExistentes.length > 0) {
      const error = new Error("NIT_DUPLICADO");
      error.codigo = "NIT_DUPLICADO";
      throw error;
    }

    // Insertar datos del proveedor
    const insertarProveedor = `INSERT INTO proveedores (nit, empresa, cedula, nombres, telefono, correo_electronico, direccion)
    VALUES(?, ?, ?, ?, ?, ?, ?)`;

    // Resultado del proveedor insertado
    const [resultadoProveedorInsertado] = await pool.query(insertarProveedor, [
      proveedor.nit,
      proveedor.empresa,
      proveedor.cedula,
      proveedor.nombres,
      proveedor.telefono,
      proveedor.correo_electronico,
      proveedor.direccion,
    ]);
    await pool.query("COMMIT");
    console.log(
      "Proveedor agregado correctamente:",
      resultadoProveedorInsertado
    );
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al agregar el proveedor", error);
    throw error;
  }
};

// Código para obtener todos los proveedores
const obtenerTodosProveedores = async () => {
  try {
    const obtenerProveedor = "SELECT * FROM proveedores";
    const [proveedores, _] = await pool.query(obtenerProveedor);
    return proveedores;
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    throw error;
  }
};

const eliminarProveedor = async (idProveedor) => {
  try {
    // Iniciar transacción
    await pool.query("START TRANSACTION");

    // Eliminar proveedor
    const eliminarProveedorQuery = `
      DELETE FROM proveedores
      WHERE id_proveedor = ?
    `;
    await pool.query(eliminarProveedorQuery, [idProveedor]);

    // Confirmar transacción
    await pool.query("COMMIT");

    console.log("Proveedor eliminado correctamente de la base de datos");
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al eliminar el proveedor de la base de datos:", error);
    throw error;
  }
};

const obtenerProveedorPorId = async (idProveedor) => {
  try {
    const obtenerProveedor = "SELECT * FROM proveedores WHERE id_proveedor = ?";
    const [proveedores, _] = await pool.query(obtenerProveedor, [idProveedor]);
    if (proveedores.length === 0) {
      throw new Error("Proveedor no encontrado");
    } else {
      return proveedores[0];
    }
  } catch (error) {
    console.error("Error al obtener el proveedor:", error);
    throw error;
  }
};

const actualizarProveedor = async (idProveedor, nuevoProveedor) => {
  try {
    // Verificar si el nuevo NIT ya existe en otro proveedor
    const checkNitQuery =
      "SELECT id_proveedor FROM proveedores WHERE nit = ? AND id_proveedor != ?";
    const [existingProvider] = await pool.query(checkNitQuery, [
      nuevoProveedor.nit,
      idProveedor,
    ]);

    if (existingProvider.length > 0) {
      throw {
        code: "NIT_DUPLICADO",
        message:
          "El NIT ingresado ya está registrado. Por favor, ingrese un NIT diferente.",
      };
    }

    // Continuar con la actualización del proveedor si no hay NIT duplicado
    const query = `
      UPDATE proveedores 
      SET 
        nit = ?,
        empresa = ?,
        cedula = ?,
        nombres = ?,
        correo_electronico = ?,
        telefono = ?,
        direccion = ?
      WHERE id_proveedor = ?
    `;
    const values = [
      nuevoProveedor.nit,
      nuevoProveedor.empresa,
      nuevoProveedor.cedula,
      nuevoProveedor.nombres,
      nuevoProveedor.correo_electronico,
      nuevoProveedor.telefono,
      nuevoProveedor.direccion,
      idProveedor,
    ];
    await pool.query(query, values);

    console.log("Proveedor actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    throw error;
  }
};

module.exports = {
  obtenerTodosProveedores,
  agregarProveedor,
  eliminarProveedor,
  obtenerProveedorPorId,
  actualizarProveedor,
};
