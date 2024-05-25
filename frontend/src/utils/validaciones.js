// validaciones.js

export const validarCedula = (cedula) => {
  if (cedula.length !== 10 || !/^[0-9]+$/.test(cedula)) {
    return "La cédula debe contener solo números y tener exactamente 10 dígitos.";
  }
  return null; // Indica que la validación pasó sin errores
};

export const validarCamposLlenos = (formulario, modoEdicion = false) => {
  for (const campo in formulario) {
    // Ignorar validación de usuario y contraseña en modo edición
    if (modoEdicion && (campo === "usuario" || campo === "contrasena")) {
      continue;
    }
    // Verificar si el campo está vacío
    if (!formulario[campo]) {
      return false;
    }
  }
  return true;
};
