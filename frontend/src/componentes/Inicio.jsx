import { useState, useEffect } from 'react';

function Inicio() {
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // Simulamos la obtención de datos
  useEffect(() => {
    // Datos simulados
    setClientes(['Cliente 1', 'Cliente 2', 'Cliente 3']);
    setEmpleados(['Empleado 1', 'Empleado 2']);
    setProveedores(['Proveedor 1', 'Proveedor 2', 'Proveedor 3', 'Proveedor 4']);
  }, []);

  return (
    <div>
      <h1>Inicio</h1>
      <p>Cantidad de Clientes: {clientes.length}</p>
      <p>Cantidad de Empleados: {empleados.length}</p>
      <p>Cantidad de Proveedores: {proveedores.length}</p>
    </div>
  );
}

export default Inicio;
