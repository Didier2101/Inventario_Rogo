import { useEffect, useState } from "react";
import axios from 'axios';



import "../css/empleados.css";
import ButtonComponent from "../otrosComponentes/ButtonComponent";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);

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


  return (
    <>
      <section className="section-item">
        <section className="box max-width">
          <h2 className="title-tabla">Lista de Empleados</h2>


          <ButtonComponent
            color="var(--secondary)"
            width="80px"
            height="30px"
            fontSize="1rem"
            margin="0"
            text="Nuevo" />
        </section>


        <section className="lista-items max-width">
          {empleados.map((empleado, index) => (
            <div className="fila" key={index}>
              <div className="celda"># <strong> {index + 1}</strong></div>
              <div className="celda">{empleado.cedula}</div>
              <div className="celda">{empleado.nombres}</div>
              <div className="celda">{empleado.correo}</div>
              <div className="celda">{empleado.telefono}</div>
              <div className="celda">{empleado.direccion}</div>
              <div className="celda">{empleado.cargo}</div>
              <div className="celda">{empleado.salario}</div>
              <div className="celda">{empleado.fecha_ingreso}</div>
              <div className="celda">{empleado.fecha_nacimiento}</div>
            </div>
          ))}
        </section>
      </section >
    </>
  );
};

export default Empleados;
