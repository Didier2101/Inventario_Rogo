const pool = require("../database");

const login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?",
      [usuario, contrasena]
    );
    if (result[0].length > 0) {
      res.status(200).json({ message: "Usuario autenticado correctamente" });
    } else {
      res
        .status(401)
        .json({ message: "Usuario no se encontró en la base de datos" });
    }
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { login };
