const pool = require("../database");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    // Recuperar el usuario de la base de datos
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [usuario]
    );

    if (result[0].length > 0) {
      const user = result[0][0];

      // Comparar la contraseña ingresada con la contraseña encriptada en la base de datos
      const isMatch = await bcrypt.compare(contrasena, user.contrasena);
      if (isMatch) {
        res.status(200).json({ message: "Usuario autenticado correctamente" });
      } else {
        res.status(401).json({ message: "Contraseña incorrecta" });
      }
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
