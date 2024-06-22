// import { validarFormulario } from "../utils/validaciones";

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

const Bodegas = () => {
  const [bodegaID, setBodegaID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detalleBodega, setDetalleBodega] = useState(null)
  const [subMenu, setSubMenu] = useState(null);
  const [bodegas, setBodegas] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    nombres: '',
    telefono: '',
    direccion: '',
    encargado: ''
  });

  useEffect(() => {
    obtenerBodegas();
    obtenerEmpleados();
  }, []);

  const activarModoEdicion = (bodega) => {
    setModoEditar(true);
    setFormulario(true);

    // Buscamos el empleado que corresponde al encargado actual de la bodega
    const encargadoSeleccionado = empleados.find(emp => emp.id_empleado === bodega.encargado);

    // Actualizamos formData con los datos de la bodega seleccionada y el encargado encontrado
    setFormData({
      ...bodega,
      encargado: encargadoSeleccionado ? encargadoSeleccionado.nombres : '', // Utilizamos el nombre del encargado
    });

    setBodegaID(bodega.id_bodega);
  };



  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const obtenerBodegas = async () => {
    try {
      const response = await fetch("http://localhost:4000/bodegas");
      if (response.ok) {
        const data_bodegas = await response.json();
        setBodegas(data_bodegas);
      } else {
        console.error("No se pudo obtener las bodegas");
      }
    } catch (error) {
      console.error('error al obtener las bodegas', error);
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



  const eliminarBodega = async (bodegaId, bodegaNombre) => {
    try {
      const result = await Swal.fire({
        title: "Eliminar bodega",
        html: `¿Seguro que quieres eliminar a  <strong>${bodegaNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarla!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/bodegas/${bodegaId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setBodegas(
          bodegas.filter((bodega) => bodega.id_bodega !== bodegaId)
        );

        Swal.fire({
          title: "Eliminada!",
          html: `La bodega <strong>${bodegaNombre}</strong> ha sido eliminada.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
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
    try {
      let url = 'http://localhost:4000/bodegas';
      let method = 'POST';
      if (modoEditar) {
        url += `/${bodegaID}`;
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
        console.error('Error al agregar o actualizar la bodega');
        return;
      }

      if (!response.ok) {
        console.error('Error al agregar o actualizar la bodega');
        return;
      }

      const data = await response.json();

      if (modoEditar) {
        Swal.fire({
          title: 'Bodega Actualizada',
          text: 'La bodega ha sido actualizada correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Bodega Agregada',
          text: 'La bodega ha sido agregada correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerBodegas();
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  };


  const obtenerBodegaPorId = async (idBodega) => {
    try {
      const response = await fetch(`http://localhost:4000/bodegas/${idBodega}`);
      if (response.ok) {
        const data = await response.json();
        const encargado = empleados.find(emp => emp.id_empleado === data.encargado);
        setDetalleBodega({ ...data, encargado: encargado ? encargado.nombres : 'Desconocido' });
      } else {
        console.error("No se pudo obtener la bodega");
      }
    } catch (error) {
      console.error('error al obtener la bodega', error);
    }
  };


  const mostarFormulario = () => {
    setFormulario(true);
    setModoEditar(false);
  };

  const ocultarFormulario = () => {
    setDetalleBodega(null);
    setFormulario(false);
    setFormData({
      nombres: '',
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
            <h2 className="title-form">{modoEditar ? 'Editar Bodega' : 'Agregar Bodega'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                fullWidth
                label="Nombre de la bodega"
                name="nombres"
                onChange={cambiosInputs}
                value={formData.nombres}
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
                  value={formData.encargado}
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
              > {modoEditar ? 'Guardar cambios' : 'Agregar bodega'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <section className="caja-section">
        <h2 className="title-tabla">Lista de Bodegas</h2>
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
          {bodegas.map((bodega, index) => (
            <tr className="fila" key={index}>
              <td className="one"><strong>{index + 1}</strong></td>
              <td className="eight">{bodega.nombres}</td>
              <td className=""><strong>{bodega.telefono}</strong></td>
              <td className="six">{bodega.direccion}</td>
              <td className="five">{bodega.encargado}</td>
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
                        onClick={() => eliminarBodega(bodega.id_bodega, bodega.nombres)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar" onClick={() => activarModoEdicion(bodega)}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Detalles">
                      <IconButton size="small" color="success"
                        onClick={() => obtenerBodegaPorId(bodega.id_bodega)}
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
        open={Boolean(detalleBodega)}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          {detalleBodega && (
            <div className="contenedor_detalle">
              <div className="cerrar-boton">
                <h2 className="titulo-detalle">Detalles de la bodega</h2>
                <IconButton onClick={ocultarFormulario}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="contenedor-detalles">
                <div className="detalle_item">
                  <strong className="detalle_titulo">Nombre:</strong>
                  <span className="detalle_valor">{detalleBodega.nombres}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Teléfono:</strong>
                  <span className="detalle_valor">{detalleBodega.telefono}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Dirección:</strong>
                  <span className="detalle_valor">{detalleBodega.direccion}</span>
                </div>
                <div className="detalle_item">
                  <strong className="detalle_titulo">Encargado:</strong>
                  <span className="detalle_valor">{detalleBodega.encargado}</span>
                </div>
              </div>

            </div>
          )}
        </Box>
      </Modal>
    </section>
  );

};

export default Bodegas;
