import { validarFormulario } from "../utils/validaciones";

import "../css/empleados.css";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Divider, IconButton, Modal, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";




const Clientes = () => {

  const [clienteID, setClienteID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detalleCliente, setDetalleCliente] = useState(null)
  const [subMenu, setSubMenu] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    correo_electronico: '',
    telefono: '',
    direccion: ''
  });


  const activarModoEdicion = (cliente) => {
    setModoEditar(true);
    setFormulario(true);
    setFormData(cliente); // Actualiza el estado del formulario con los datos del cliente
    setClienteID(cliente.id_cliente); // Guarda el ID del cliente que se está editando
  };




  // Función para manejar cambios en los inputs del formulario
  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const obtenerClientes = async () => {
    try {
      const response = await fetch("http://localhost:4000/clientes");
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        console.error("No se pudo obtener los clientes");
      }
    } catch (error) {
      console.error('error al obtener los clientes', error);
    }
  }
  useEffect(() => {
    obtenerClientes();
  }, []);



  // Función para eliminar un empleado
  const eliminarCliente = async (clienteId, clienteNombre) => {
    try {
      const result = await Swal.fire({
        title: "Eliminar cliente",
        html: `¿Seguro que quieres eliminar a  <strong>${clienteNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/clientes/${clienteId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message); // Lanza un error con el mensaje del backend
        }

        setClientes(
          clientes.filter((cliente) => cliente.id_cliente !== clienteId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El empleado  <strong>${clienteNombre}</strong>? ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerClientes(); // Asumiendo que fetchEmpleados() es una función que actualiza la lista de empleados
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message, // Muestra el mensaje de error del backend
      });
    }
  };


  const enviarForm = async (e) => {
    e.preventDefault();
    const { valido, mensaje } = validarFormulario(formData);

    if (!valido) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: mensaje,
      });
      return;
    }
    try {
      let url = 'http://localhost:4000/clientes';
      let method = 'POST';
      if (modoEditar) {
        url += `/${clienteID}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
          console.error('Error al agregar o actualizar el cliente');
          return;
        }
      }

      if (!response.ok) {
        console.error('Error al agregar o actualizar el cliente');
        return;
      }

      const data = await response.json();

      if (modoEditar) {
        Swal.fire({
          title: 'Cliente Actualizado',
          text: 'El cliente ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Cliente Agregado',
          text: 'El cliente ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerClientes(); // Actualiza la lista de clientes después de agregar o editar uno
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  }

  const obtenerClientePorId = async (idCliente) => {
    try {
      const response = await fetch(`http://localhost:4000/clientes/${idCliente}`);
      if (response.ok) {
        const data = await response.json();
        setDetalleCliente(data);
      } else {
        console.error("No se pudo obtener los clientes");
      }
    } catch (error) {
      console.error('error al obtener los clientes', error);
    }
  }

  // espacio para los modales

  const mostarFormulario = () => {
    setFormulario(true);
    setModoEditar(false)
  };
  const ocultarFormulario = () => {
    setDetalleCliente(null);
    setDetalleCliente(false);
    setFormulario(false);
    setFormData({
      cedula: '',
      nombres: '',
      correo_electronico: '',
      telefono: '',
      direccion: ''
    });
  };

  // estilos del modal formulario
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

  const mostrarSubMenu = (index) => {
    setSubMenu(index)
  }
  const quitarSubMenu = () => {
    setSubMenu(null)
  }


  return (
    <section className="section-item">

      <Modal
        open={formulario}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <form className="grid-form" onSubmit={enviarForm}>
            <h2 className="title-form">{modoEditar ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                fullWidth
                label="Cedula"
                name="cedula"
                onChange={cambiosInputs}
                value={formData.cedula}
                required
              />
              <TextField
                fullWidth
                label="Nombres"
                name="nombres"
                onChange={cambiosInputs}
                value={formData.nombres}
                required
              />
              <TextField
                fullWidth
                label="Correo Electronico"
                name="correo_electronico"
                onChange={cambiosInputs}
                value={formData.correo_electronico}
                required

              />
              <TextField
                fullWidth
                label="Telefono"
                name="telefono"
                onChange={cambiosInputs}
                value={formData.telefono}
                required
              />
              <TextField
                fullWidth
                label="Direccion"
                name="direccion"
                onChange={cambiosInputs}
                value={formData.direccion}
                required
              />
            </div>
            <Divider />
            <div className="contain-btns">
              <Button
                variant="contained"
                color="error"
                onClick={ocultarFormulario}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                type="submit"
              > {modoEditar ? 'Editar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <section className="caja-section">
        <h2 className="title-tabla">Lista de Clientes</h2>
        <IconButton
          onClick={mostarFormulario}
          style={{ background: 'var(--tercero)' }}>
          <AddIcon style={{ color: 'var(--primer)' }} />
        </IconButton>
      </section>
      <Divider />

      <table className="tabla-items">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr className="fila" key={index}>
              <td className="one"><strong>{index + 1}</strong></td>
              <td className="two"><strong>{cliente.cedula}</strong></td>
              <td className="three">{cliente.nombres}</td>
              <td className="five">{cliente.correo_electronico}</td>
              <td className="four">{cliente.telefono}</td>
              <td className="six">{cliente.direccion}</td>
              <td className="acciones ten">
                <IconButton size="small" color="success"
                  onMouseEnter={() => mostrarSubMenu(index)}
                >
                  <MoreVertIcon />
                </IconButton>
                {subMenu === index && (
                  <div className="sub_menu" onMouseLeave={quitarSubMenu}>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error"
                        onClick={() => eliminarCliente(cliente.id_cliente, cliente.nombres)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar" onClick={() => activarModoEdicion(cliente)}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Detalles">
                      <IconButton size="small" color="success"
                        onClick={() => obtenerClientePorId(cliente.id_cliente)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <Modal
        open={Boolean(detalleCliente)}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >

        <Box sx={{ ...style }}>
          {detalleCliente && (
            <div className="contenedor_detalle">
              <h2 className="titulo-detalle">Detalles del cliente</h2>
              <Divider />
              <div className="contenedor-detalles">
                <div className="detalle_item">
                  <strong className="detalle_titulo">Cédula:</strong>
                  <span className="detalle_valor">{detalleCliente.cedula}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Nombres:</strong>
                  <span className="detalle_valor">{detalleCliente.nombres}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Correo Electrónico:</strong>
                  <span className="detalle_valor">{detalleCliente.correo_electronico}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Teléfono:</strong>
                  <span className="detalle_valor">{detalleCliente.telefono}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Dirección:</strong>
                  <span className="detalle_valor">{detalleCliente.direccion}</span>

                </div>




              </div>
              <Divider />
              <div className="cerrar_boton">

                <Button
                  variant="contained"
                  color="success"
                  className="btn-cerrar"
                  onClick={ocultarFormulario}>Cerrar</Button>
              </div>
            </div>
          )}
        </Box>

      </Modal>
    </section >


  );
};

export default Clientes;
