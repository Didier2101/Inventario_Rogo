// Clientes.jsx


import "../css/empleados.css";
import ButtonComponent from "../otrosComponentes/ButtonComponent";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";



const Clientes = () => {

  const [showSubMenuIndex, setShowSubMenuIndex] = useState(null);

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
        <h2 className="title-tabla">Lista de Clientes</h2>
        <ButtonComponent
          color="var(--tercero)"
          width="11%"
          height="30px"
          fontSize="1rem"
          margin="0"
          text="Nuevo" />
      </section>


      <section className="lista-items max-width">

        <div className="fila" >
          <div className="celda index"><strong></strong></div>



          <div className="celda">
            <strong>cedula</strong>
          </div>
          <div className="celda">
            nombres
          </div>
          <div className="celda">correo</div>
          <div className="celda">telefono</div>
          <div className="celda direccion">
            direccion
          </div>




          <div className="celda acciones">
            <IconButton aria-label="delete" size="small ">
              <MoreVertIcon fontSize="medium" />
            </IconButton>


            <div className="sub-menu">
              <IconButton aria-label="delete" style={{ color: "var(--quinto)" }}>
                <DeleteIcon size="medium" />

              </IconButton>
              <IconButton aria-label="delete" style={{ color: "var(--octavo)" }}>
                <EditIcon size="medium" />

              </IconButton>

              <IconButton aria-label="delete" style={{ color: "var(--tercero)" }}>
                <InfoIcon size="medium" />

              </IconButton>
            </div>


          </div>
        </div>

      </section>
    </section >

  );
};

export default Clientes;
