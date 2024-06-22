// productoService.js

const pool = require("../database");

const obtenerProductoPorReferencia = async (referencia) => {
  try {
    const query = `
      SELECT *
      FROM productos
      WHERE referencia = ?
    `;
    const [productos] = await pool.query(query, [referencia]);
    if (productos.length === 0) {
      return null; // Producto no encontrado
    } else {
      return productos[0]; // Devuelve el primer producto encontrado (debería ser único por referencia)
    }
  } catch (error) {
    console.error("Error al obtener el producto por referencia:", error);
    throw error;
  }
};

// Función para agregar un producto
const agregarProducto = async (producto) => {
  try {
    if (
      !producto.proveedor ||
      !producto.bodega ||
      !producto.nombre ||
      !producto.referencia ||
      !producto.descripcion ||
      !producto.precio_compra ||
      !producto.precio_venta ||
      !producto.cantidad ||
      !producto.estado
    ) {
      throw new Error("Datos del producto incompletos");
    }

    await pool.query("START TRANSACTION");
    // Insertar datos del producto
    const insertarProductoQuery = `
      INSERT INTO productos (proveedor, bodega, nombre, referencia, descripcion, precio_compra, precio_venta, cantidad, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      producto.proveedor,
      producto.bodega,
      producto.nombre,
      producto.referencia,
      producto.descripcion,
      producto.precio_compra,
      producto.precio_venta,
      producto.cantidad,
      producto.estado ? 1 : 0, // Convertimos el booleano a 0 o 1 para almacenarlo en la base de datos
    ];
    await pool.query(insertarProductoQuery, values);

    await pool.query("COMMIT");

    console.log("Producto agregado correctamente");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al agregar el producto:", error);
    throw error;
  }
};

// Función para obtener todos los productos con bodegas
const obtenerTodosProductos = async () => {
  try {
    const query = `
      SELECT 
        p.id_producto,
        pr.empresa AS proveedor,
        b.nombres AS bodega,  -- Se añadió la coma faltante aquí
        p.nombre,
        p.referencia,
        p.descripcion,
        p.precio_compra,
        p.precio_venta,
        p.cantidad,
        p.estado
      FROM 
        productos p
      LEFT JOIN 
        proveedores pr ON p.proveedor = pr.id_proveedor
      LEFT JOIN 
        bodegas b ON p.bodega = b.id_bodega
    `;
    const [productos] = await pool.query(query);
    return productos;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

// Función para obtener un producto por su ID
const obtenerProductoPorId = async (idProducto) => {
  try {
    const obtenerProductoQuery = `
      SELECT *
      FROM productos
      WHERE id_producto = ?
    `;
    const [productos] = await pool.query(obtenerProductoQuery, [idProducto]);
    if (productos.length === 0) {
      throw new Error("Producto no encontrado");
    } else {
      return productos[0];
    }
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
};

// Función para actualizar un producto por su ID
const actualizarProducto = async (idProducto, nuevoProducto) => {
  try {
    // Verificar si la nueva referencia ya existe en otro producto
    const query = `
      UPDATE productos
      SET 
      proveedor = ?,
      bodega = ?,
        nombre = ?,
        referencia = ?,
        descripcion = ?,
        precio_compra = ?,
        precio_venta = ?,
        cantidad = ?,
        estado = ?
      WHERE id_producto = ?
    `;
    const values = [
      nuevoProducto.proveedor,
      nuevoProducto.bodega,
      nuevoProducto.nombre,
      nuevoProducto.referencia,
      nuevoProducto.descripcion,
      nuevoProducto.precio_compra,
      nuevoProducto.precio_venta,
      nuevoProducto.cantidad,
      nuevoProducto.estado ? 1 : 0,
      idProducto,
    ];
    await pool.query(query, values);

    console.log("Producto actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};

// Función para eliminar un producto por su ID
const eliminarProducto = async (idProducto) => {
  try {
    // Iniciar transacción
    await pool.query("START TRANSACTION");

    // Eliminar producto
    const eliminarProductoQuery = `
      DELETE FROM productos
      WHERE id_producto = ?
    `;
    await pool.query(eliminarProductoQuery, [idProducto]);

    // Confirmar transacción
    await pool.query("COMMIT");

    console.log("Producto eliminado correctamente de la base de datos");
  } catch (error) {
    // Revertir la transacción en caso de error
    await pool.query("ROLLBACK");

    console.error("Error al eliminar el producto de la base de datos:", error);
    throw error;
  }
};

// Función para actualizar el estado de un producto por su ID en la base de datos
const actualizarEstadoProducto = async (idProducto, estado) => {
  try {
    const query = "UPDATE productos SET estado = ? WHERE id_producto = ?";
    await pool.query(query, [estado, idProducto]);
  } catch (error) {
    throw new Error(
      `Error al actualizar el estado del producto en la base de datos: ${error.message}`
    );
  }
};

module.exports = {
  obtenerTodosProductos,
  agregarProducto,
  eliminarProducto,
  obtenerProductoPorId,
  actualizarProducto,
  obtenerProductoPorReferencia,
  actualizarEstadoProducto,
};
