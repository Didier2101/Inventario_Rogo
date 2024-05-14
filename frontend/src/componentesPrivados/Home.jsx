import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";


import Menu from "../componentesPrivados/Menu"
import Header from "../componentesPrivados/Header"
import Inicio from "../componentesPrivados/Inicio"
import Productos from '../componentes/Productos';
import Empleados from '../componentes/Empleados';
import Clientes from '../componentes/Clientes';
import Proveedores from '../componentes/Proveedores';
import PuntosVenta from '../componentes/PuntosVenta';
import Bodegas from '../componentes/Bodegas';
import Ventas from '../componentes/Ventas';
import Facturas from '../componentes/Facturas';


const Home = () => {

    const [menuVisible, setMenuVisible] = useState(true);

    const toggleMenuVisibility = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <div className="flex-1">
            <Menu visible={menuVisible} />
            <div className="flex-2">
                <Header onMenuButtonClick={toggleMenuVisibility} />
                <Routes>
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/empleados" element={<Empleados />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/proveedores" element={<Proveedores />} />
                    <Route path="/puntosVenta" element={<PuntosVenta />} />
                    <Route path="/bodegas" element={<Bodegas />} />
                    <Route path="/ventas" element={<Ventas />} />
                    <Route path="/facturas" element={<Facturas />} />
                    <Route path="/" element={<Navigate to="/inicio" />} />
                </Routes>


            </div>
        </div>
    )
}

export default Home