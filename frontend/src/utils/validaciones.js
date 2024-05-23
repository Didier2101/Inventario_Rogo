// src/utils/validaciones.js
import Swal from "sweetalert2";
// Función para validar campos vacíos
const validarCamposVacios = (campos, modoEdicion = false) => {
  for (const campo in campos) {
    if (modoEdicion && (campo === "usuario" || campo === "contrasena")) {
      continue; // Ignorar validación de usuario y contraseña en modo edición
    }
    if (!campos[campo]) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
        customClass: {
          container: "swal-container",
        },
      });
      return false;
    }
  }
  return true;
};

// Función para validar que los campos sean numéricos
const validarCamposNumericos = (campos) => {
  const soloNumeros = /^[0-9]+$/;
  for (const campo in campos) {
    if (!soloNumeros.test(campos[campo])) {
      Swal.fire({
        title: "Error",
        text: `${campo} debe ser solo numérico`,
        icon: "error",
        customClass: {
          container: "swal-container",
        },
      });
      return false;
    }
  }
  return true;
};

// Función para validar que los campos sean texto
const validarCamposTexto = (campos) => {
  const soloTexto = /^[A-Za-z\s]+$/;
  for (const campo in campos) {
    if (!soloTexto.test(campos[campo])) {
      Swal.fire({
        title: "Error",
        text: `${campo} solo debe contener texto`,
        icon: "error",
        customClass: {
          container: "swal-container",
        },
      });
      return false;
    }
  }
  return true;
};

// Función para quitar puntos de un campo
const quitarPuntos = (campo) => {
  return campo.replace(/\./g, "");
};

// Función para formatear números con puntos como separadores de miles
const formatearConPuntos = (numero) => {
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const validarFormularioEmpleado = (
  formularioInformacion,
  modoEdicion = false
) => {
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
  } = formularioInformacion;

  // Validar campos vacíos
  if (
    !validarCamposVacios(
      {
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
      },
      modoEdicion
    )
  ) {
    return false;
  }

  // Validar campos numéricos
  if (!validarCamposNumericos({ cedula, telefono, salario })) {
    return false;
  }

  // Validar campos de texto
  if (!validarCamposTexto({ nombres })) {
    return false;
  }

  // Quitar puntos del salario
  formularioInformacion.salario = quitarPuntos(salario);

  return true;
};
const validarLongitudTelefono = (telefono) => {
  if (telefono.length !== 10) {
    Swal.fire({
      title: "Error",
      text: "El teléfono debe tener exactamente 10 números",
      icon: "error",
      customClass: {
        container: "swal-container",
      },
    });
    return false;
  }
  return true;
};
export {
  validarCamposVacios,
  validarCamposNumericos,
  validarCamposTexto,
  quitarPuntos,
  formatearConPuntos,
  validarFormularioEmpleado,
  validarLongitudTelefono,
};
