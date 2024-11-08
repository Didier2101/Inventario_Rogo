
import { Navigate, Route, Routes } from "react-router-dom";


import Menu from "../componentesPrivados/Menu"
import Header from "../componentesPrivados/Header"
import Productos from '../componentes/Productos';
import Empleados from '../componentes/Empleados';
import Clientes from '../componentes/Clientes';
import Bodegas from '../componentes/Bodegas';
import PuntosVenta from '../componentes/PuntosVenta';


import { useState, useContext } from "react";
import Context from "../contexto/Context";
import useInactivity from "../hooks/useInactivity";



const Administrativo = () => {

    useInactivity(10 * 60 * 1000);


    const [menuVisible, setMenuVisible] = useState(true);
    const { usuario, logueado } = useContext(Context);

    if (!logueado) {
        return <Navigate to="/" />;
    }


    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <div className="flex-1">
            {menuVisible && <Menu userRole={usuario.cargo} />}
            <div className="flex-2">
                <Header onMenuToggle={toggleMenu} userRole={usuario.cargo} />
                <Routes>
                    <Route path="productos" element={< Productos userRole={usuario.cargo} />} />
                    <Route path="empleados" element={<Empleados />} />
                    <Route path="clientes" element={<Clientes />} />
                    <Route path="bodegas" element={<Bodegas />} />
                    <Route path="puntosVenta" element={<PuntosVenta />} />
                    <Route path="*" element={<Navigate to="productos" />} />
                </Routes>


            </div>
        </div>
    )
}

export default Administrativo