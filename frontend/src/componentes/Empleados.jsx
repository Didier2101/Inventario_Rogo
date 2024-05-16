import { useEffect, useState } from "react";
import axios from 'axios';


import "../css/empleados.css";
import ButtonComponent from "../otrosComponentes/ButtonComponent";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [showSubMenuIndex, setShowSubMenuIndex] = useState(null);

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





  return (

    <section className="section-item">

      <section className="caja-section max-width">
        <h2 className="title-tabla">Lista de Empleados</h2>
        <ButtonComponent
          color="var(--tercero)"
          width="11%"
          height="30px"
          fontSize="1rem"
          margin="0"
          text="Nuevo" />
      </section>
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
                  <IconButton aria-label="delete" style={{ color: "var(--quinto)" }}>
                    <DeleteIcon size="medium" />
                    {/* <span>Eliminar</span> */}
                  </IconButton>
                  <IconButton aria-label="delete" style={{ color: "var(--octavo)" }}>
                    <EditIcon size="medium" />
                    {/* <span>Editar</span> */}
                  </IconButton>

                  <IconButton aria-label="delete" style={{ color: "var(--tercero)" }} >
                    <InfoIcon size="medium" />
                    {/* <span>Detalles</span> */}
                  </IconButton>
                </div>
              )}

            </div>
          </div>
        ))}
      </section>
    </section >

  );
};

export default Empleados;
