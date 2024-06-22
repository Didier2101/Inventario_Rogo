
import { Navigate, Route, Routes } from "react-router-dom";


import Menu from "../componentesPrivados/Menu"
import Header from "../componentesPrivados/Header"
import Inicio from "../componentes/Inicio"
import Productos from '../componentes/Productos';
import Empleados from '../componentes/Empleados';
import Clientes from '../componentes/Clientes';
import Proveedores from '../componentes/Proveedores';
import PuntosVenta from '../componentes/PuntosVenta';
import Bodegas from '../componentes/Bodegas';

const Administrador = () => {
    return (
        <div className="flex-1">
            <Menu />
            <div className="flex-2">
                <Header />
                <Routes>
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/empleados" element={<Empleados />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/proveedores" element={<Proveedores />} />
                    <Route path="/puntos" element={<PuntosVenta />} />
                    <Route path="/bodegas" element={<Bodegas />} />
                    <Route path="/*" element={<Navigate to="/inicio" />} />
                </Routes>


            </div>
        </div>
    )
}

export default Administrador