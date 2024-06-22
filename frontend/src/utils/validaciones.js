export const validarCedula = (cedula) => {
  const regex = /^[0-9]{5,10}$/;
  return regex.test(cedula);
};

export const validarNombres = (nombres) => {
  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(nombres);
};

export const validarCorreo = (correo_electronico) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(correo_electronico);
};

export const validarTelefono = (telefono) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(telefono);
};

export const validarFormulario = (formData, tipoFormulario) => {
  const { cedula, nombres, correo_electronico, telefono } = formData;

  if (tipoFormulario === "puntoVenta") {
    if (!validarNombres(nombres)) {
      return {
        valido: false,
        mensaje:
          "El nombre tiene que contener solo letras y espacios. No puede contener numeros ni caracteres especiales.",
      };
    }
    if (!validarTelefono(telefono)) {
      return {
        valido: false,
        mensaje:
          "El telefono tiene que ser numero de celular y contener 10 numeros, No puede contener letras.",
      };
    }
  } else {
    // Validaciones generales
    if (!validarCedula(cedula)) {
      return {
        valido: false,
        mensaje:
          "La cedula tiene que ser numerica y no mas de 10 numeros y no menos de 5",
      };
    }
    if (!validarNombres(nombres)) {
      return {
        valido: false,
        mensaje:
          "El nombre tiene que contener solo letras y espacios. No puede contener numeros ni caracteres especiales.",
      };
    }
    if (correo_electronico && !validarCorreo(correo_electronico)) {
      return {
        valido: false,
        mensaje:
          "Correo electrónico no válido. Asegúrese de que el correo electrónico siga el formato: ejemplo@dominio.com, donde 'ejemplo' puede contener letras, números y los caracteres especiales ._%+- y 'dominio.com' debe incluir un punto seguido de al menos dos letras.",
      };
    }
    if (!validarTelefono(telefono)) {
      return {
        valido: false,
        mensaje:
          "El telefono tiene que ser numero de celular y contener 10 numeros, No puede contener letras.",
      };
    }
  }

  return { valido: true, mensaje: "" };
};
