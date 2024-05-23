import { Box, Button, Divider, IconButton, Modal, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ButtonComponent from "../otrosComponentes/ButtonComponent";

// import { validarFormularioEmpleado, formatearConPuntos, validarLongitudTelefono } from '../utils/validaciones';


const Empleados = () => {
  const cargos = [
    {
      id: 0,
      label: "",
    },
    {
      id: 1,
      label: "Administrador",
    },
    {
      id: 2,
      label: "Bodeguero",
    },
    {
      id: 3,
      label: "Vendedor",
    },
  ];

  // Agrega un nuevo estado para almacenar el ID del empleado seleccionado para editar
  const [empleadoID, setEmpleadoID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [formularioAdd, setFormularioAdd] = useState(false);
  const [formularioInformacion, setFormularioInformacion] = useState({
    cedula: '',
    nombres: '',
    correo: '',
    telefono: '',
    direccion: '',
    cargo: '',
    salario: '',
    fecha_ingreso: '',
    fecha_nacimiento: '',
    usuario: '',
    contrasena: '',
  });



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
    // Verificar si el nombre del campo es diferente de "usuario" y "contrasena"
    if (name !== "usuario" && name !== "contrasena" && name !== "correo") {
      // Dividir la cadena en palabras, capitalizar la primera letra de cada palabra y unirlas de nuevo
      const formattedValue = value
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setFormularioInformacion({ ...formularioInformacion, [name]: formattedValue });
    } else {
      // Si es "usuario" o "contrasena", establecer el valor sin formato
      setFormularioInformacion({ ...formularioInformacion, [name]: value });
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const response = await fetch("http://localhost:4000/empleados");
      if (response.ok) {
        const data = await response.json();
        setEmpleados(data);
      } else {
        console.error("Error al obtener los empleados");
      }
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);



  // Función para agregar o actualizar un empleado
  const agregarEmpleado = async (e) => {
    e.preventDefault();


    try {
      let url = 'http://localhost:4000/empleados';
      let method = 'POST';
      if (modoEditar) {
        url += `/${empleadoID}`;
        method = 'PUT';
      }
      console.log('Enviando solicitud:', method, url);
      console.log('Datos:', formularioInformacion);
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formularioInformacion),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.error && data.error === "CEDULA_DUPLICADA") {
          // Si la cédula ya existe, mostrar un mensaje al usuario
          alert("La cédula ingresada ya está registrada. Por favor, ingrese una cédula diferente.");
        } else {
          // Si la cédula no existe, enviar el formulario
          e.target.submit();
        }
      } else {
        console.error("Error al verificar la cédula en el servidor");
      }


      if (response.ok) {
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
      } else {
        console.error('Error al agregar o actualizar el empleado');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
    obtenerEmpleados(); // Actualiza la lista de empleados después de agregar o editar uno
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
    setFormularioInformacion({
      cedula: '',
      nombres: '',
      correo: '',
      telefono: '',
      direccion: '',
      cargo: '',
      salario: '',
      fecha_ingreso: '',
      fecha_nacimiento: '',
      usuario: '',
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
        <ButtonComponent
          onClick={mostarFormulario}
          color="var(--tercero)"
          width="11%"
          height="30px"
          fontSize="1rem"
          margin="0"
          text="Nuevo"
        />
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
            <div className="celda index one">
              <strong> {index + 1}</strong>
            </div>

            <div className="celda two">
              <strong>{empleado.cedula}</strong>
            </div>

            <div className="celda three">{empleado.nombres}</div>
            <div className="celda four">{empleado.correo}</div>
            <div className="celda five">{empleado.telefono}</div>
            <div className="celda direccion six">{empleado.direccion}</div>

            <div className="celda seven"> {empleado.cargo}</div>

            <div className="celda salario eight">
              COP:  {empleado.salario}
            </div>
            <div className="celda nine">
              <strong>{empleado.fecha_ingreso}</strong>
            </div>
            <div className="celda acciones  ten">
              <Tooltip
                title="Detalles"

              >
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
                fullWidth
                label="Cedula"

                name="cedula"
                value={formularioInformacion.cedula}
                onChange={cambiosInputs}
                required
              />
              <TextField
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
                name="correo"
                value={formularioInformacion.correo}
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

              <TextField
                id="outlined-select-currency-native"
                select
                label="Seleccione un cargo"
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                fullWidth
                name="cargo"
                value={formularioInformacion.cargo}
                onChange={cambiosInputs}
                required
              >
                {cargos.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </TextField>



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
              />
            </div>
            <Divider />
            <h2 className="title-form">Usuario</h2>
            <div className="contain-usuario">
              <TextField
                fullWidth
                label="Usuario"
                disabled={modoEditar ? true : false}
                name="usuario"
                value={formularioInformacion.usuario}
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


    </section>

  )
}

export default Empleados;