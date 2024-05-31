import { Box, Button, Divider, IconButton, Modal, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


import AddIcon from '@mui/icons-material/Add';
import PlaceIcon from '@mui/icons-material/Place';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Empleados = () => {


  // Agrega un nuevo estado para almacenar el ID del empleado seleccionado para editar

  const [empleadoID, setEmpleadoID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [formularioAdd, setFormularioAdd] = useState(false);
  const [detalleEmpleado, setDetalleEmpleado] = useState(null);
  const [formularioInformacion, setFormularioInformacion] = useState({
    cedula: '',
    nombres: '',
    correo_electronico: '',
    telefono: '',
    direccion: '',
    id_cargo: '',
    salario: '',
    fecha_ingreso: '',
    fecha_nacimiento: '',
    nombre_usuario: '',
    contrasena: '',
  });

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    // Obtener los componentes de la fecha (año, mes, día)
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    // Construir la cadena con el formato deseado (YYYY-MM-DD)
    return `${año}-${mes}-${dia}`;
  };

  const fecha = new Date(); // Obtener la fecha actual, por ejemplo
  const año = fecha.getFullYear(); // Obtener el año (ej: 2024)
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes (con ceros a la izquierda si es necesario)
  const dia = String(fecha.getDate()).padStart(2, '0'); // Obtener el día (con ceros a la izquierda si es necesario)

  const fechaFormateada = `${año}-${mes}-${dia}`; // Construir la cadena con el formato deseado

  // console.log(fechaFormateada); // Imprimir la fecha formateada (ej: '2024-05-31')

  // Función para activar el modo de edición y cargar los datos del empleado seleccionado
  const activarModoEdicion = (empleado) => {
    setModoEditar(true);
    setFormularioAdd(true);
    setFormularioInformacion(empleado);
    setEmpleadoID(empleado.id_empleado); // Guarda el ID del empleado que se está editando
  };




  // Función para manejar cambios en los inputs del formulario
  const cambiosInputs = (e) => {
    const { name, value } = e.target;

    setFormularioInformacion({ ...formularioInformacion, [name]: value });

    console.log(formularioInformacion)
  };

  const obtenerEmpleados = async () => {
    try {
      const response = await fetch("http://localhost:4000/empleados");
      if (response.ok) {
        const data = await response.json();
        setEmpleados(data.map(empleado => ({
          ...empleado,
          fecha_ingreso: formatearFecha(empleado.fecha_ingreso),
          fecha_nacimiento: formatearFecha(empleado.fecha_nacimiento),
        })));
      } else {
        console.error("Error al obtener los empleados");
      }
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  });


  const obtenerEmpleadoPorId = async (idEmpleado) => {
    try {
      const response = await fetch(`http://localhost:4000/empleados/${idEmpleado}`);
      const data = await response.json();

      const empleadoFormateado = {
        ...data,
        fecha_ingreso: formatearFecha(data.fecha_ingreso),
        fecha_nacimiento: formatearFecha(data.fecha_nacimiento),
      };
      setDetalleEmpleado(empleadoFormateado);
    } catch (error) {
      console.error("Error al obtener el empleado:", error);
    }
  };
  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  };

  const agregarEmpleado = async (e) => {
    e.preventDefault();

    // Validaciones de campos requeridos
    for (const key in formularioInformacion) {
      if (formularioInformacion[key] === "") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `El campo ${key} es obligatorio.`,
        });
        return;
      }
    }

    // Validaciones adicionales
    if (formularioInformacion.cedula.length > 10 && isNaN(formularioInformacion.cedula)) {
      Swal.fire({
        icon: 'error',
        title: 'Cedula',
        text: 'La cédula no puede tener más de 10 números y solo debe tener numeros.',
      });
      return;
    }

    if (isNaN(formularioInformacion.telefono) || formularioInformacion.telefono.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Telefono',
        text: 'El teléfono debe ser numérico y no puede tener menos de 10 numeros.',
      });
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(formularioInformacion.nombres)) {
      Swal.fire({
        icon: 'error',
        title: 'Nombres',
        text: 'El campo nombres solo puede contener letras.',
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formularioInformacion.correo_electronico)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo electronico',
        text: 'El correo electrónico debe tener un formato válido.',
      });
      return;
    }

    if (isNaN(formularioInformacion.salario)) {
      Swal.fire({
        icon: 'error',
        title: 'Salario',
        text: 'El salario debe ser numérico y sin puntos ni caracteres.',
      });
      return;
    }
    const edadEmpleado = calcularEdad(formularioInformacion.fecha_nacimiento);

    // Verifica si el empleado es menor de 18 años
    if (edadEmpleado < 18) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El empleado debe ser mayor de 18 años para registrarse.',
      });
      return;
    }

    try {
      let url = 'http://localhost:4000/empleados';
      let method = 'POST';
      if (modoEditar) {
        url += `/${empleadoID}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formularioInformacion),
        fecha_ingreso: fechaFormateada,
        fecha_nacimiento: fechaFormateada,
      });

      if (response.status === 400) {
        const data = await response.json();
        if (data.error && data.error === "CEDULA_DUPLICADA") {
          // Mostrar el mensaje de error al usuario utilizando SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
          return;
        } else {
          console.error('Error al agregar o actualizar el empleado');
          return;
        }
      }

      if (!response.ok) {
        console.error('Error al agregar o actualizar el empleado');
        return;
      }

      const data = await response.json();

      if (modoEditar) {
        Swal.fire({
          title: 'Empleado Actualizado',
          text: 'El empleado ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Empleado Agregado',
          text: 'El empleado ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      cerrarFormulario();
      obtenerEmpleados(); // Actualiza la lista de empleados después de agregar o editar uno
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };





  // Función para eliminar un empleado
  const eliminarEmpleado = async (empleadoId, empleadoNombre) => {
    try {
      const result = await Swal.fire({
        title: "Eliminar Empleado",
        html: `¿Seguro que quieres eliminar a  <strong>${empleadoNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/empleados/${empleadoId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message); // Lanza un error con el mensaje del backend
        }

        setEmpleados(
          empleados.filter((empleado) => empleado.id_empleado !== empleadoId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El empleado  <strong>${empleadoNombre}</strong>? ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerEmpleados(); // Asumiendo que fetchEmpleados() es una función que actualiza la lista de empleados
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message, // Muestra el mensaje de error del backend
      });
    }
  };





  const mostarFormulario = () => {
    setFormularioAdd(true);
  };

  // Función para cerrar el formulario y limpiar los datos
  const cerrarFormulario = () => {
    setModoEditar(false);
    setFormularioAdd(false);
    setDetalleEmpleado(false);
    setFormularioInformacion({
      cedula: '',
      nombres: '',
      correo_electronico: '',
      telefono: '',
      direccion: '',
      id_cargo: '',
      salario: '',
      fecha_ingreso: '',
      fecha_nacimiento: '',
      nombre_usuario: '',
      contrasena: '',
    });
    setEmpleadoID(null); // Reinicia el ID del empleado seleccionado
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    maxWidth: '90%', // Nuevo
    maxHeight: '90vh', // Nuevo
    bgcolor: 'background.paper',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 2,
    height: 'auto',
    pt: 2,
    px: 4,
    pb: 3,
    overflowY: 'auto', // Nuevo
    '@media (max-width: 600px)': {
      width: '90%',
      position: 'relativa',
    },
  };



  return (
    <section className="section-item">
      <div className="caja-section max-width">

        {/* codigo del boton agregar */}
        <h2 className="title-tabla">Lista de Empleados</h2>

        <IconButton
          aria-label="delete"
          onClick={mostarFormulario}
          style={{ background: 'var(--tercero)' }}>
          <AddIcon style={{ color: 'var(--primer)' }} />
        </IconButton>

      </div>

      <div className="witches max-width">
        <ul className="witches-list">
          <li className="witches-item">
            Todos
            <span className="cantidad-empleados">{empleados.length}</span>
          </li>
        </ul>
      </div>

      <Divider />

      <div className="lista-items max-width">

        {empleados.map((empleado, index) => (
          <div className="fila" key={index}>
            <div className="celda index one"><strong> {index + 1}</strong></div>
            <div className="celda two"><strong>{empleado.cedula}</strong></div>
            <div className="celda three">{empleado.nombres}</div>
            <div className="celda four">{empleado.correo_electronico}</div>
            <div className="celda five">{empleado.telefono}</div>
            <div className="celda direccion six">{empleado.direccion}</div>
            <div className="celda seven"> {empleado.nombre_cargo}</div>
            <div className="celda salario eight">{empleado.salario}</div>
            <div className="celda nine"><strong>{empleado.fecha_ingreso}</strong></div>
            <div className="celda acciones  ten">
              <Tooltip title="Detalles"
                onClick={() => obtenerEmpleadoPorId(empleado.id_empleado)}>
                <IconButton size="small" color="success">
                  <InfoIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar"
                onClick={() => activarModoEdicion(empleado)}

              >
                <IconButton size="small" color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Eliminar"
                onClick={() => eliminarEmpleado(empleado.id_empleado, empleado.nombres)}
              >
                <IconButton size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>

          </div>
        ))}
      </div>

      {/* codigo de formalario add */}
      <Modal
        open={formularioAdd}
        onClose={cerrarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <form className="grid-form" onSubmit={agregarEmpleado}>
            <h2 className="title-form">{modoEditar ? 'Editar Empleado' : 'Agregar Empleado'}</h2>
            <div className="contain-inputs">
              <TextField
                disabled={modoEditar}
                fullWidth
                label="Cedula"
                name="cedula"
                value={formularioInformacion.cedula}
                onChange={cambiosInputs}
                required
              />
              <TextField
                disabled={modoEditar}
                fullWidth
                label="Nombres"
                name="nombres"
                value={formularioInformacion.nombres}
                onChange={cambiosInputs}
                required
              />
              <TextField
                fullWidth
                label="Correo electrónico"
                type="email"
                name="correo_electronico"
                value={formularioInformacion.correo_electronico}
                onChange={cambiosInputs}
                required
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formularioInformacion.telefono}
                onChange={cambiosInputs}
                required
              />
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formularioInformacion.direccion}
                onChange={cambiosInputs}
                required
              />



              <select
                name="id_cargo"
                value={formularioInformacion.id_cargo}
                onChange={cambiosInputs}
                required
              >
                <option value="" disabled>Elige un cargo</option>
                <option value="1">Administrador</option>
                <option value="2">Bodeguero</option>
                <option value="3">Vendedor</option>
                <option value="4">Auxiliar</option>
              </select>



              <TextField
                fullWidth
                label="Salario"

                name="salario"
                value={formularioInformacion.salario}
                onChange={cambiosInputs}
                required
              />
              <TextField
                fullWidth
                label="Fecha de ingreso"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}

                name="fecha_ingreso"
                value={formularioInformacion.fecha_ingreso}
                onChange={cambiosInputs}
                required
                disabled={modoEditar ? true : false}
              />
              <TextField
                fullWidth
                label="Fecha de nacimiento"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}

                name="fecha_nacimiento"
                value={formularioInformacion.fecha_nacimiento}
                onChange={cambiosInputs}
                required
                disabled={modoEditar ? true : false}
              />
            </div>
            <Divider />
            <h2 className="title-form">Usuario</h2>
            <div className="contain-usuario">
              <TextField
                fullWidth
                label="Usuario"
                disabled={modoEditar ? true : false}
                name="nombre_usuario"
                value={formularioInformacion.nombre_usuario}
                onChange={cambiosInputs}
                required
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                disabled={modoEditar ? true : false}
                name="contrasena"
                value={formularioInformacion.contrasena}
                onChange={cambiosInputs}
                required
              />
            </div>
            <Divider />
            <div className="contain-btns">
              <Button variant="contained" color="error" onClick={cerrarFormulario}>Cancelar</Button>
              <Button
                variant="contained"
                color="success"
                type="submit"
              >
                {modoEditar ? 'Editar' : 'Agregar'}
              </Button>
            </div>
          </form>

        </Box>
      </Modal>

      <Modal
        open={Boolean(detalleEmpleado)}
        onClose={cerrarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"

      >
        <Box sx={{ ...style }}>

          {detalleEmpleado && (

            <div className="contenedor_detalle">
              <h2 className="titulo-detalle">Detalles del empleado</h2>
              <Divider />
              <div className="contenedor-detalles">
                <div className="detalle_item">
                  <strong className="detalle_titulo">Cédula:</strong>
                  <span className="detalle_valor">{detalleEmpleado.cedula}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Nombres:</strong>
                  <span className="detalle_valor">{detalleEmpleado.nombres}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Correo Electrónico:</strong>
                  <span className="detalle_valor">{detalleEmpleado.correo_electronico}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Teléfono:</strong>
                  <span className="detalle_valor">{detalleEmpleado.telefono}</span>
                </div>
                <div className="detalle_item google">
                  <strong className="detalle_titulo">Dirección:</strong>
                  <span className="detalle_valor">{detalleEmpleado.direccion}</span>
                  <IconButton style={{ marginLeft: '2px' }}>
                    <PlaceIcon
                      style={{ color: 'green', fontSize: '1.8rem' }} />
                  </IconButton>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Cargo:</strong>
                  <span className="detalle_valor">{detalleEmpleado.nombre_cargo}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Salario:</strong>
                  <span className="detalle_valor">{detalleEmpleado.salario}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Fecha de Ingreso:</strong>
                  <span className="detalle_valor">{detalleEmpleado.fecha_ingreso}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Fecha de Nacimiento:</strong>
                  <span className="detalle_valor">{detalleEmpleado.fecha_nacimiento}</span>
                </div>
              </div>
              <Divider />
              <div className="cerrar_boton">

                <Button
                  variant="contained"
                  color="success"
                  className="btn-cerrar"
                  onClick={cerrarFormulario}>Cerrar</Button>
              </div>
            </div>

          )}



        </Box>
      </Modal>


    </section >

  )
}

export default Empleados;