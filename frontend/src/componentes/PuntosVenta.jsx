import { validarFormulario } from "../utils/validaciones";

import "../css/empleados.css";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { Box, Button, Divider, IconButton, Modal, TextField, Tooltip, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const PuntosVenta = () => {
  const [puntoVentaID, setPuntoVentaID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detallePuntoVenta, setDetallePuntoVenta] = useState(null)
  const [subMenu, setSubMenu] = useState(null);
  const [puntosVentas, setPuntosVentas] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    nombre_punto_venta: '',
    telefono: '',
    direccion: '',
    encargado: ''
  });


  const activarModoEdicion = (puntoVenta) => {
    setModoEditar(true);
    setFormulario(true);
    // Encontrar el encargado basado en el ID almacenado en puntoVenta.encargado
    const encargadoSeleccionado = empleados.find(emp => emp.id_empleado === puntoVenta.encargado);

    setFormData({
      nombre_punto_venta: puntoVenta.nombre_punto_venta,
      telefono: puntoVenta.telefono,
      direccion: puntoVenta.direccion,
      encargado: encargadoSeleccionado ? encargadoSeleccionado.id_empleado : '',
    });
    setPuntoVentaID(puntoVenta.id_punto_venta);
  };


  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const obtenerPuntosVentas = async () => {
    try {
      const response = await fetch("http://localhost:4000/puntos_ventas");
      if (response.ok) {
        const data_ventas = await response.json();
        setPuntosVentas(data_ventas);
      } else {
        console.error("No se pudo obtener los puntos de venta");
      }
    } catch (error) {
      console.error('error al obtener los puntos de venta', error);
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const response = await fetch("http://localhost:4000/empleados");
      if (response.ok) {
        const data_empleados = await response.json();
        setEmpleados(data_empleados);
      } else {
        console.error("No se pudo obtener los empleados");
      }
    } catch (error) {
      console.error('error al obtener los empleados', error);
    }
  };

  useEffect(() => {
    obtenerPuntosVentas();
    obtenerEmpleados();
  }, []);

  const eliminarPuntoVenta = async (puntoVentaId, puntoVentaNombre) => {
    try {
      const result = await Swal.fire({
        title: "Eliminar punto de venta",
        html: `¿Seguro que quieres eliminar a  <strong>${puntoVentaNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/puntos_ventas/${puntoVentaId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setPuntosVentas(
          puntosVentas.filter((puntoVenta) => puntoVenta.id_punto_venta !== puntoVentaId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El punto de venta <strong>${puntoVentaNombre}</strong> ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerPuntosVentas();
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
    const { valido, mensaje } = validarFormulario(formData, 'puntoVenta');

    if (!valido) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: mensaje,
      });
      return;
    }
    try {
      let url = 'http://localhost:4000/puntos_ventas';
      let method = 'POST';
      if (modoEditar) {
        url += `/${puntoVentaID}`;
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
        console.error('Error al agregar o actualizar el punto de venta');
        return;
      }

      if (!response.ok) {
        console.error('Error al agregar o actualizar el punto de venta');
        return;
      }

      const data = await response.json();

      if (modoEditar) {
        Swal.fire({
          title: 'Punto de Venta Actualizado',
          text: 'El punto de venta ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Punto de Venta Agregado',
          text: 'El punto de venta ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerPuntosVentas();
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  };

  const obtenerPuntoVentaPorId = async (idPuntoVenta) => {
    try {
      const response = await fetch(`http://localhost:4000/puntos_ventas/${idPuntoVenta}`);
      if (response.ok) {
        const data = await response.json();
        const encargado = empleados.find(emp => emp.id_empleado === data.encargado);
        setDetallePuntoVenta({ ...data, encargado: encargado ? encargado.nombres : 'Desconocido' });
      } else {
        console.error("No se pudo obtener el punto de venta");
      }
    } catch (error) {
      console.error('error al obtener el punto de venta', error);
    }
  };

  const mostarFormulario = () => {
    setFormulario(true);
    setModoEditar(false);
  };

  const ocultarFormulario = () => {
    setDetallePuntoVenta(null);
    setFormulario(false);
    setFormData({
      nombre_punto_venta: '',
      telefono: '',
      direccion: '',
      encargado: ''
    });
  };

  const style_form = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '90%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    overflow: 'auto',
    borderRadius: 'none',
    overflowY: 'auto',
    border: 'none',
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative', // Corrige 'relativa' a 'relative'
      top: 'auto',
      left: 'auto',
      transform: 'none',
    },
  };
  const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: '0',
    right: '0',
    width: '500px',
    maxHeight: '100vh',
    bgcolor: 'background.paper',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 'none',
    height: '100vh',
    overflowY: 'auto',
    '@media (max-width: 600px)': {
      width: '90%',
      position: 'relative', // Corrige 'relativa' a 'relative'
    },
  };


  const mostrarSubMenu = (index) => {
    setSubMenu(index);
  };

  const quitarSubMenu = () => {
    setSubMenu(null);
  };

  return (
    <section className="section-item">
      <Modal
        open={formulario}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style_form }}>
          <form className="grid-form" onSubmit={enviarForm}>
            <h2 className="title-form">{modoEditar ? 'Editar Punto de Venta' : 'Agregar Punto de Venta'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                fullWidth
                label="Nombre del punto de venta"
                name="nombre_punto_venta"
                onChange={cambiosInputs}
                value={formData.nombre_punto_venta}
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
              <FormControl fullWidth>
                <InputLabel id="encargado-label">Encargado</InputLabel>
                <Select
                  labelId="encargado-label"
                  name="encargado"
                  value={formData.encargado} // aqui quiero que se me mustre el nombre no el id
                  onChange={cambiosInputs}
                  required
                >
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado.id_empleado} value={empleado.id_empleado}>
                      {empleado.nombres}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


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
              >  {modoEditar ? "Guardar Cambios" : "Agregar Punto de Venta"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <section className="caja-section">
        <h2 className="title-tabla">Lista de Puntos de Venta</h2>
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
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Encargado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {puntosVentas.map((puntoVenta, index) => (
            <tr className="fila" key={index}>
              <td className="one"><strong>{index + 1}</strong></td>
              <td className="eight">{puntoVenta.nombre_punto_venta}</td>
              <td className=""><strong>{puntoVenta.telefono}</strong></td>
              <td className="six">{puntoVenta.direccion}</td>
              <td className="five">{puntoVenta.encargado}</td>
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
                        onClick={() => eliminarPuntoVenta(puntoVenta.id_punto_venta, puntoVenta.nombres)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar" onClick={() => activarModoEdicion(puntoVenta)}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Detalles">
                      <IconButton size="small" color="success"
                        onClick={() => obtenerPuntoVentaPorId(puntoVenta.id_punto_venta)}
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
        open={Boolean(detallePuntoVenta)}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          {detallePuntoVenta && (
            <div className="contenedor_detalle">
              <div className="cerrar-boton">
                <h2 className="titulo-detalle">Detalles del punto de venta</h2>
                <IconButton onClick={ocultarFormulario}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="contenedor-detalles">
                <div className="detalle_item">
                  <strong className="detalle_titulo">Nombre:</strong>
                  <span className="detalle_valor">{detallePuntoVenta.nombre_punto_venta}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Teléfono:</strong>
                  <span className="detalle_valor">{detallePuntoVenta.telefono}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Dirección:</strong>
                  <span className="detalle_valor">{detallePuntoVenta.direccion}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Encargado:</strong>
                  <span className="detalle_valor">{detallePuntoVenta.encargado}</span>
                </div>
              </div>

            </div>
          )}
        </Box>
      </Modal>
    </section>
  );
};

export default PuntosVenta;
