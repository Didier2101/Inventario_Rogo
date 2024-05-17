import { useEffect, useState } from "react";

import axios from 'axios';
import Modal from 'react-modal';
import Swal from 'sweetalert2'

import "../css/empleados.css";
import ButtonComponent from "../otrosComponentes/ButtonComponent";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Divider, IconButton, TextField } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [showSubMenuIndex, setShowSubMenuIndex] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formAddEmpleado, setFormAddEmpleado] = useState(false);

  // Función para abrir el modal
  const openFormAddEmpleado = () => {
    setFormAddEmpleado(true);
  };

  // Función para cerrar el modal
  const closeFormAddEmpleado = () => {
    setFormAddEmpleado(false);
  };

  // mostrar todos los empleados
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await axios.get("http://localhost:4000/empleados");
        console.log("Datos de empleados:", response.data);
        setEmpleados(response.data);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
      }
    };

    fetchEmpleados();
  }, []);


  // Mostrar empleado por id
  const mostrarEmpleadoPorId = async (empleadoId) => {
    try {
      const response = await axios.get(`http://localhost:4000/empleados/${empleadoId}`);
      const empleado = response.data;
      setSelectedEmpleado(empleado);
      setModalIsOpen(true);
      console.log("Información del empleado por Id:", empleado);
    } catch (error) {
      console.error("Error al obtener empleado por ID:", error);
    }
  };

  // 
  const eliminarEmpleado = async (empleadoId, empleadoNombre) => {
    try {
      const result = await Swal.fire({
        title: 'Eliminar Empleado',
        text: `¿Seguro que quieres eliminar a ${empleadoNombre}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:4000/empleados/${empleadoId}`);
        setEmpleados(empleados.filter(empleado => empleado.id_empleado !== empleadoId));

        Swal.fire({
          title: 'Eliminado!',
          text: `El empleado ${empleadoNombre} ha sido eliminado.`,
          icon: 'success'
        });

        console.log("Empleado eliminado con éxito");
      }
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };



  const toggleSubMenu = (index) => {
    setShowSubMenuIndex(index === showSubMenuIndex ? null : index);
  };

  // Función para formatear la fecha con ceros adelante si es necesario
  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0'); // Agrega cero adelante si es necesario
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); // Agrega cero adelante si es necesario
    const año = fechaObj.getFullYear();
    return `${dia}/${mes}/${año}`;
  };


  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEmpleado(null);
  };
  const estilosFormEmpleado = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '1000px',
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: 'var(--primer)', // Fondo del contenido del modal
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    overlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.566)' // Fondo del overlay
    }
  };
  const cargos = [
    {
      value: '',
      label: '',
    },
    {
      value: 'Administrador',
      label: 'Administrador',
    },
    {
      value: 'bodeguero',
      label: 'Bodeguero',
    },
    {
      value: 'vendedor',
      label: 'Vendedor',
    },
  ];


  return (

    <section className="section-item">
      {/* Modal para agregar un nuevo empleado */}
      <Modal
        isOpen={formAddEmpleado}
        onRequestClose={closeFormAddEmpleado}
        contentLabel="Agregar Empleado"
        style={estilosFormEmpleado}
      >

        <form className="grid-form">
          <h2 className="title-form">Ingresar Empleados</h2>
          <div className="contain-inputs">
            <TextField fullWidth label="Cedula" id="fullWidth" />
            <TextField fullWidth label="Nombres" id="fullWidth" />
            <TextField fullWidth label="Correo electronico" id="fullWidth" type="email" />
            <TextField fullWidth label="Telefono" id="fullWidth" />
            <TextField fullWidth label="Direccion" id="fullWidth" />
            <TextField
              id="outlined-select-currency-native"
              select
              label="Seleccione un cargo"
              defaultValue="0"
              SelectProps={{
                native: true,
              }}
              variant="outlined"
              fullWidth
            >
              {cargos.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <TextField fullWidth label="Salario" id="fullWidth" />
            <TextField fullWidth label="Fecha de ingreso" id="fullWidth" type="date"
              InputLabelProps={{
                shrink: true,
              }} />
            <TextField fullWidth label="Fecha de nacimiento" id="fullWidth" type="date"
              InputLabelProps={{
                shrink: true,
              }} />
          </div>
          <Divider />
          <h2 className="title-form">Usuario</h2>
          <div className="contain-usuario">
            <TextField fullWidth label="Usuario" id="fullWidth" />

            <TextField fullWidth label="contraseña" id="fullWidth" type="password" />
          </div>
          <Divider />
          <div className="contain-btns">

            <ButtonComponent
              onClick={closeFormAddEmpleado}
              color="var(--quinto)"
              width="16%"
              height="40px"
              fontSize="1.1rem"
              margin="0"
              text="Cancelar" />

            <ButtonComponent
              type="submit"
              color="var(--segundo)"
              width="16%"
              height="40px"
              fontSize="1.1rem"
              margin="0"
              text="Agregar" />

          </div>
        </form>

      </Modal>

      <section className="caja-section max-width">
        <h2 className="title-tabla">Lista de Empleados</h2>
        <ButtonComponent
          onClick={openFormAddEmpleado}
          color="var(--tercero)"
          width="11%"
          height="30px"
          fontSize="1rem"
          margin="0"
          text="Nuevo" />
      </section>
      <Divider />
      <section className="witches max-width">
        <ul className="witches-list">
          <li className="witches-item">Todos
            <span className="cantidad-empleados">{empleados.length}</span>
          </li>
          {/* <li className="witches-item">Activos
            <span>14</span></li>
          <li className="witches-item">Pendientes
            <span>6</span></li> */}
        </ul>
      </section>

      <Divider />
      <section className="lista-items max-width">
        {empleados.map((empleado, index) => (
          <div className="fila" key={index}>

            <div className="celda index one"><strong> {index + 1}</strong></div>



            <div className="celda two">
              <strong>{empleado.cedula}</strong>
            </div>

            <div className="celda three">
              {empleado.nombres}
            </div>
            <div className="celda four">{empleado.correo}</div>
            <div className="celda five">{empleado.telefono}</div>
            <div className="celda direccion six">
              {empleado.direccion}
            </div>

            <div className="celda seven">{empleado.cargo}</div>
            <div className="celda salario eight">{empleado.salario}</div>
            <div className="celda nine"><strong>{formatearFecha(empleado.fecha_ingreso)}</strong></div>
            <div className="celda acciones ten">
              <IconButton aria-label="delete" size="small " onClick={() => toggleSubMenu(index)}>
                <MoreVertIcon fontSize="medium" />
              </IconButton>

              {showSubMenuIndex === index && (
                <div className="sub-menu">
                  <IconButton aria-label="delete" style={{ color: "var(--quinto)" }}
                    onClick={() => eliminarEmpleado(empleado.id_empleado, empleado.nombres)}
                  >
                    <DeleteIcon size="medium" />
                    {/* <span>Eliminar</span> */}
                  </IconButton>
                  <IconButton aria-label="delete" style={{ color: "var(--octavo)" }}>
                    <EditIcon size="medium" />
                    {/* <span>Editar</span> */}
                  </IconButton>

                  <IconButton aria-label="delete" style={{ color: "var(--tercero)" }}
                    onClick={() => mostrarEmpleadoPorId(empleado.id_empleado)}
                  >
                    <InfoIcon size="medium" />
                    {/* <span>Detalles</span> */}
                  </IconButton>
                </div>
              )}

            </div>

          </div>
        ))}
      </section>
      {
        selectedEmpleado && (
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Detalles del Empleado">
            <h2>Detalles del Empleado</h2>
            <div><strong>Cédula:</strong> {selectedEmpleado.cedula}</div>
            <div><strong>Nombres:</strong> {selectedEmpleado.nombres}</div>
            <div><strong>Correo:</strong> {selectedEmpleado.correo}</div>
            <div><strong>Teléfono:</strong> {selectedEmpleado.telefono}</div>
            <div><strong>Dirección:</strong> {selectedEmpleado.direccion}</div>
            <div><strong>Cargo:</strong> {selectedEmpleado.cargo}</div>
            <div><strong>Salario:</strong> {selectedEmpleado.salario}</div>
            <div><strong>Fecha de Ingreso:</strong> {formatearFecha(selectedEmpleado.fecha_ingreso)}</div>
            <div><strong>Fecha de Ing:</strong> {formatearFecha(selectedEmpleado.fecha_ingreso)}</div>
            <button onClick={closeModal}>Cerrar</button>
          </Modal>
        )
      }
    </section >

  );
};

export default Empleados;
