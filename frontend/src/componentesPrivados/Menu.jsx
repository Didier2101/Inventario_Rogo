import { NavLink } from "react-router-dom"

import PropTypes from 'prop-types';



import Inventory2Icon from "@mui/icons-material/Inventory2";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";







const Menu = ({ userRole }) => {

    return (

        <>
            {(userRole === 'administrador') && (
                <section className='section-menu'>
                    <ul>

                        <NavLink to="/administrativo/productos" className="navlink-menu">
                            <Inventory2Icon className="icon-menu" />
                            <p className="text">Productos</p>
                        </NavLink>

                        {(userRole === 'administrador') && (
                            <>
                                <NavLink to="/administrativo/empleados" className="navlink-menu">
                                    <GroupAddIcon className="icon-menu" />
                                    <p className="text">Empleados</p>
                                </NavLink>
                                <NavLink to="/administrativo/clientes" className="navlink-menu">
                                    <GroupAddIcon className="icon-menu" />
                                    <p className="text">Clientes</p>
                                </NavLink>

                                <NavLink to="/administrativo/puntosVenta" className="navlink-menu">
                                    <BusinessCenterIcon className="icon-menu" />
                                    <p className="text">Puntos de venta</p>
                                </NavLink>
                                <NavLink to="/administrativo/bodegas" className="navlink-menu">
                                    <MapsHomeWorkIcon className="icon-menu" />
                                    <p className="text">Puntos de almacenamiento</p>
                                </NavLink>

                            </>
                        )}
                    </ul>
                </section>
            )}
        </>
    )
}
Menu.propTypes = {
    userRole: PropTypes.string.isRequired,
};
export default Menu