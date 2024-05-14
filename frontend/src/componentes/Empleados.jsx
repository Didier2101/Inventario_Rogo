import { useEffect, useState } from "react";
import axios from 'axios';
import Button from '@mui/material/Button';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";


import "../css/empleados.css";

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
      <section className="section-empleados">
        <section className="box">
          <h2 className="title-tabla">Lista de Empleados</h2>
          {/* <div className="container-buscar">
            <input type="text" placeholder="Buscar" />
            <SearchIcon className="icon-buscar" />
          </div> */}

          <Button
            variant="outlined"
            style={{
              width: "300px",
              fontSize: "0.8rem",
              backgroundColor: 'transparent',
              border: '1px solid var(--50)',
              color: 'var(--800)',
              padding: '4px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Agregar Empleado
          </Button>
        </section>

        <main>
          <div className="container-tabla">
            <table>
              <thead className="thead">
                <tr className="encabezado">
                  <th>#</th>
                  <th>Cédula</th>
                  <th>Nombres</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Direccion</th>
                  <th>Cargo</th>
                  <th>Salario</th>
                  <th>Fecha Ingreso</th>
                  <th>Fecha Nacimiento</th>
                  <th className="th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((empleado, index) => (
                  <tr className="tr" key={index}>
                    <td> <strong>{index + 1}</strong></td>
                    <td>{empleado.cedula}</td>
                    <td>{empleado.nombres}</td>
                    <td>{empleado.correo}</td>
                    <td>{empleado.telefono}</td>
                    <td>{empleado.direccion}</td>
                    <td>{empleado.cargo}</td>
                    <td>{empleado.salario}</td>
                    <td>{empleado.fecha_ingreso}</td>
                    <td>{empleado.fecha_nacimiento}</td>
                    <td className="acciones">
                      <InfoIcon
                        className="icon-acciones-info"
                        style={{ color: "9BCF53" }}
                      />
                      <EditIcon
                        className="icon-acciones-edit"
                        style={{ color: "#007bff" }}
                      />
                      <DeleteIcon
                        className="icon-acciones-delete"
                        style={{ color: "DF2E38" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </section>
    </>
  );
};

export default Empleados;
