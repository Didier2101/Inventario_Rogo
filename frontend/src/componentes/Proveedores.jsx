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

const Proveedores = () => {
  const [proveedorID, setProveedorID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detalleProveedor, setDetalleProveedor] = useState(null)
  const [subMenu, setSubMenu] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nit: '',
    empresa: '',
    cedula: '',
    nombres: '',
    telefono: '',
    correo_electronico: '',
    direccion: ''
  });

  const activarModoEdicion = (proveedor) => {
    setModoEditar(true);
    setFormulario(true);
    setFormData(proveedor); // Actualiza el estado del formulario con los datos del proveedor
    setProveedorID(proveedor.id_proveedor); // Guarda el ID del proveedor que se está editando
  };

  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const obtenerProveedores = async () => {
    try {
      const response = await fetch("http://localhost:4000/proveedores");
      if (response.ok) {
        const data = await response.json();
        setProveedores(data);
      } else {
        console.error("No se pudo obtener los proveedores");
      }
    } catch (error) {
      console.error('error al obtener los proveedores', error);
    }
  }
  useEffect(() => {
    obtenerProveedores();
  }, []);

  const eliminarProveedor = async (proveedorId, proveedorNombre) => {
    try {
      const result = await Swal.fire({
        title: "Eliminar proveedor",
        html: `¿Seguro que quieres eliminar a  <strong>${proveedorNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/proveedores/${proveedorId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setProveedores(
          proveedores.filter((proveedor) => proveedor.id_proveedor !== proveedorId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El proveedor <strong>${proveedorNombre}</strong> ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerProveedores();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
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
      let url = 'http://localhost:4000/proveedores';
      let method = 'POST';
      if (modoEditar) {
        url += `/${proveedorID}`;
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
        if (data.error && data.error === "NIT_DUPLICADO") {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
          return;
        } else {
          console.error('Error al agregar o actualizar el proveedor');
          return;
        }
      }

      if (!response.ok) {
        console.error('Error al agregar o actualizar el proveedor');
        return;
      }

      const data = await response.json();

      if (modoEditar) {
        Swal.fire({
          title: 'Proveedor Actualizado',
          text: 'El proveedor ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Proveedor Agregado',
          text: 'El proveedor ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerProveedores();
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  }

  const obtenerProveedorPorId = async (idProveedor) => {
    try {
      const response = await fetch(`http://localhost:4000/proveedores/${idProveedor}`);
      if (response.ok) {
        const data = await response.json();
        setDetalleProveedor(data);
      } else {
        console.error("No se pudo obtener los proveedores");
      }
    } catch (error) {
      console.error('error al obtener los proveedores', error);
    }
  }

  const mostarFormulario = () => {
    setFormulario(true);
    setModoEditar(false)
  };
  const ocultarFormulario = () => {
    setDetalleProveedor(null);
    setDetalleProveedor(false);
    setFormulario(false);
    setFormData({
      nit: '',
      empresa: '',
      cedula: '',
      nombres: '',
      telefono: '',
      correo_electronico: '',
      direccion: ''
    });
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    maxWidth: '90%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 2,
    height: 'auto',
    pt: 2,
    px: 4,
    pb: 3,
    overflowY: 'auto',
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
            <h2 className="title-form">{modoEditar ? 'Editar Proveedor' : 'Agregar Proveedor'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                fullWidth
                label="NIT"
                name="nit"
                onChange={cambiosInputs}
                value={formData.nit}
                required
              />
              <TextField
                fullWidth
                label="Empresa"
                name="empresa"
                onChange={cambiosInputs}
                value={formData.empresa}
                required
              />
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
                label="Correo Electrónico"
                name="correo_electronico"
                onChange={cambiosInputs}
                value={formData.correo_electronico}
                required
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                onChange={cambiosInputs}
                value={formData.telefono}
                required
              />
              <TextField
                fullWidth
                label="Dirección"
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
              > {modoEditar ? 'Guardar cambios' : 'Agregar'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <section className="caja-section">
        <h2 className="title-tabla">Lista de Proveedores</h2>
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
            <th>Empresa</th>
            <th>NIT</th>
            <th>Cédula</th>
            <th>Nombres</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor, index) => (
            <tr className="fila" key={index}>
              <td className="one"><strong>{index + 1}</strong></td>
              <td className="eight">{proveedor.empresa}</td>
              <td className=""><strong>{proveedor.nit}</strong></td>
              <td className="two"><strong>{proveedor.cedula}</strong></td>
              <td className="three">{proveedor.nombres}</td>
              <td className="five">{proveedor.correo_electronico}</td>
              <td className="four">{proveedor.telefono}</td>
              <td className="six">{proveedor.direccion}</td>
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
                        onClick={() => eliminarProveedor(proveedor.id_proveedor, proveedor.empresa)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar" onClick={() => activarModoEdicion(proveedor)}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Detalles">
                      <IconButton size="small" color="success"
                        onClick={() => obtenerProveedorPorId(proveedor.id_proveedor)}
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
        open={Boolean(detalleProveedor)}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          {detalleProveedor && (
            <div className="contenedor_detalle">
              <h2 className="titulo-detalle">Detalles del proveedor</h2>
              <Divider />
              <div className="contenedor-detalles">
                <div className="detalle_item">
                  <strong className="detalle_titulo">NIT:</strong>
                  <span className="detalle_valor">{detalleProveedor.nit}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Empresa:</strong>
                  <span className="detalle_valor">{detalleProveedor.empresa}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Cédula:</strong>
                  <span className="detalle_valor">{detalleProveedor.cedula}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Nombres:</strong>
                  <span className="detalle_valor">{detalleProveedor.nombres}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Correo Electrónico:</strong>
                  <span className="detalle_valor">{detalleProveedor.correo_electronico}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Teléfono:</strong>
                  <span className="detalle_valor">{detalleProveedor.telefono}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Dirección:</strong>
                  <span className="detalle_valor">{detalleProveedor.direccion}</span>
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

export default Proveedores;
