import { useEffect, useState } from "react";

import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "../css/empleados.css";
import ButtonComponent from "../otrosComponentes/ButtonComponent";

import { Divider, IconButton, TextField, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Empleados = () => {
  // const [loading, setLoading] = useState(false);

  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formAddEmpleado, setFormAddEmpleado] = useState(false);
  const [formData, setFormData] = useState({
    cedula: "",
    nombres: "",
    correo: "",
    telefono: "",
    direccion: "",
    cargo: "",
    salario: "",
    fechaIngreso: "",
    fechaNacimiento: "",
    usuario: "",
    contrasena: "",
  });
  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    })
      .format(value)
      .replace(/\$|COP/g, "");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Validaciones

    let newValue = value;
    if (name === "cedula" || name === "telefono" || name === "salario") {
      newValue = newValue.replace(/\D/g, ""); // Eliminar caracteres no numéricos
    }
    if (name === "nombres") {
      newValue = newValue.replace(/[^a-zA-Z\s]/g, ""); // Solo permitir letras y espacios   tengo un error aqui
    }
    if (name === "cedula" && newValue.length > 10) {
      newValue = newValue.slice(0, 10);
    }
    if (name === "telefono" && newValue.length > 10) {
      newValue = newValue.slice(0, 10);
    }
    if (name === "salario") {
      newValue = formatCurrency(newValue);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones adicionales
    if (formData.cedula.length > 10) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La cédula no puede tener mas de 10 digitos.",
      });
      return;
    }

    if (formData.telefono.length !== 10) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El teléfono debe tener exactamente 10 dígitos.",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El correo electrónico no es válido.",
      });
      return;
    }

    try {
      const formattedData = {
        ...formData,
        salario: parseInt(formData.salario.replace(/\D/g, "")),
        fechaIngreso: formatDate(formData.fechaIngreso),
        fechaNacimiento: formatDate(formData.fechaNacimiento),
      };
      const response = await axios.post(
        "http://localhost:4000/empleados",
        formattedData
      );
      // Mostrar un mensaje de éxito usando SweetAlert2
      await Swal.fire({
        icon: "success",
        title: "Empleado agregado",
        text: "El empleado ha sido agregado correctamente.",
      });
      // Limpiar el formulario después de enviar los datos
      setFormData({
        cedula: "",
        nombres: "",
        correo: "",
        telefono: "",
        direccion: "",
        cargo: "",
        salario: "",
        fechaIngreso: "",
        fechaNacimiento: "",
        usuario: "",
        contrasena: "",
      });
      // Cerrar el modal de formulario
      setFormAddEmpleado(false);
      fetchEmpleados();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      // Mostrar un mensaje de error usando SweetAlert2
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  // Función para formatear la fecha en el formato YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  // Función para abrir el modal
  const openFormAddEmpleado = () => {
    setFormAddEmpleado(true);
  };

  // Función para cerrar el modal
  const closeFormAddEmpleado = () => {
    setFormAddEmpleado(false);
  };

  // mostrar todos los empleados
  const fetchEmpleados = async () => {
    try {
      const response = await axios.get("http://localhost:4000/empleados");
      setEmpleados(response.data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Mostrar empleado por id
  const mostrarEmpleadoPorId = async (empleadoId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/empleados/${empleadoId}`
      );
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
        title: "Eliminar Empleado",
        text: `¿Seguro que quieres eliminar a ${empleadoNombre}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:4000/empleados/${empleadoId}`);
        setEmpleados(
          empleados.filter((empleado) => empleado.id_empleado !== empleadoId)
        );

        Swal.fire({
          title: "Eliminado!",
          text: `El empleado ${empleadoNombre} ha sido eliminado.`,
          icon: "success",
        });

        console.log("Empleado eliminado con éxito");
      }
      fetchEmpleados();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  // Función para formatear la fecha en el formato de MySQL (YYYY-MM-DD)
  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const año = fechaObj.getFullYear();
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
    const dia = fechaObj.getDate().toString().padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEmpleado(null);
  };

  const estilosFormEmpleado = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "1000px",
      padding: "20px",
      borderRadius: "10px",
      backgroundColor: "var(--primer)", // Fondo del contenido del modal
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      position: "relative",
    },
    overlay: {
      backgroundColor: "rgba(255, 255, 255, 0)", // Fondo del overlay
    },
  };
  const estilosDetalles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "1000px",
      padding: "20px",
      borderRadius: "10px",
      backgroundColor: "var(--primer)", // Fondo del contenido del modal
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      position: "relative",
    },
    overlay: {
      backgroundColor: "rgba(255, 255, 255, 0)", // Fondo del overlay
    },
  };
  const cargos = [
    {
      value: "",
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

  return (
    <section className="section-item">
      {/* Modal para agregar un nuevo empleado */}
      <Modal
        isOpen={formAddEmpleado}
        onRequestClose={closeFormAddEmpleado}
        style={estilosFormEmpleado}
      >
        <form className="grid-form" onSubmit={handleSubmit}>
          <h2 className="title-form">Ingresar Empleados</h2>
          <div className="contain-inputs">
            <TextField
              fullWidth
              label="Cedula"
              id="cedula"
              name="cedula"
              value={formData.cedula}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Nombres"
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Teléfono"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Dirección"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
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
              value={formData.cargo}
              onChange={handleInputChange}
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
              id="salario"
              name="salario"
              value={formData.salario}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Fecha de ingreso"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              id="fechaIngreso"
              name="fechaIngreso"
              value={formData.fechaIngreso}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Fecha de nacimiento"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
              required
            />
          </div>
          <Divider />
          <h2 className="title-form">Usuario</h2>
          <div className="contain-usuario">
            <TextField
              fullWidth
              label="Usuario"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleInputChange}
              required
            />
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
              text="Cancelar"
              required
            />
            <ButtonComponent
              type="submit"
              color="var(--segundo)"
              width="16%"
              height="40px"
              fontSize="1.1rem"
              margin="0"
              text={"Agregar"}
            />
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
          style={{ zIndex: 0 }}
          margin="0"
          text="Nuevo"
        />
      </section>
      <Divider />
      <section className="witches max-width">
        <ul className="witches-list">
          <li className="witches-item">
            Todos
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

            <div className="celda seven">{empleado.cargo}</div>
            <div className="celda salario eight">
              COP: {formatCurrency(empleado.salario)}
            </div>
            <div className="celda nine">
              <strong>{formatearFecha(empleado.fecha_ingreso)}</strong>
            </div>
            <div className="celda acciones  ten">
              <Tooltip
                title="Detalles"
                onClick={() => mostrarEmpleadoPorId(empleado.id_empleado)}
              >
                <IconButton size="small" color="success">
                  <InfoIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton size="small" color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Eliminar"
                onClick={() =>
                  eliminarEmpleado(empleado.id_empleado, empleado.nombres)
                }
              >
                <IconButton size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ))}
      </section>
      {selectedEmpleado && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={estilosDetalles}
          contentLabel="Detalles del Empleado"
        >
          <div className="detalles">
            <h2>Detalles del Empleado</h2>
            <div>
              <strong>Cédula:</strong> {selectedEmpleado.cedula}
            </div>
            <div>
              <strong>Nombres:</strong> {selectedEmpleado.nombres}
            </div>
            <div>
              <strong>Correo:</strong> {selectedEmpleado.correo}
            </div>
            <div>
              <strong>Teléfono:</strong> {selectedEmpleado.telefono}
            </div>
            <div>
              <strong>Dirección:</strong> {selectedEmpleado.direccion}
            </div>
            <div>
              <strong>Cargo:</strong> {selectedEmpleado.cargo}
            </div>
            <p>
              <strong>Salario:</strong> COP:{" "}
              {formatCurrency(selectedEmpleado.salario)}
            </p>
            <div>
              <strong>Fecha de Ingreso:</strong>{" "}
              {formatearFecha(selectedEmpleado.fecha_ingreso)}
            </div>
            <div>
              <strong>Fecha de nacimiento:</strong>{" "}
              {formatearFecha(selectedEmpleado.fecha_nacimiento)}
            </div>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default Empleados;
