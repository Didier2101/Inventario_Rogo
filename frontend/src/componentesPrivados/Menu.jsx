import { NavLink } from "react-router-dom"



import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';



const Menu = ({ visible }) => {


    return (
        <section className={visible ? 'show-menu section-menu' : 'hide-menu '}>

            <ul>
                <NavLink to="/inicio" className="navlink-menu">
                    <HomeIcon className="icon-menu" />
                    <p className="text">Inicio</p>
                </NavLink>

                <NavLink to="/productos" className="navlink-menu">
                    <Inventory2Icon className="icon-menu" />
                    <p className="text">Productos</p>
                </NavLink>

                <NavLink to="/empleados" className="navlink-menu">
                    <GroupAddIcon className="icon-menu" />
                    <p className="text">Empleados</p>
                </NavLink>

                <NavLink to="/clientes" className="navlink-menu">
                    <SupervisorAccountIcon className="icon-menu" />
                    <p className="text">Clientes</p>
                </NavLink>

                <NavLink to="/proveedores" className="navlink-menu">
                    <BusinessCenterIcon className="icon-menu" />
                    <p className="text">Proveedores</p>
                </NavLink>

                <NavLink to="/puntos-venta" className="navlink-menu">
                    <AddBusinessIcon className="icon-menu" />
                    <p className="text">Puntos de venta</p>
                </NavLink>

                <NavLink to="/bodegas" className="navlink-menu">
                    <MapsHomeWorkIcon className="icon-menu" />
                    <p className="text">Bodegas</p>
                </NavLink>

                <NavLink to="/ventas" className="navlink-menu">
                    <AddShoppingCartIcon className="icon-menu" />
                    <p className="text">Ventas</p>
                </NavLink>

                <NavLink to="/facturas" className="navlink-menu">
                    <ReceiptLongIcon className="icon-menu" />
                    <p className="text">Facturas</p>
                </NavLink>

                <NavLink to="/" className="enlace-salir">
                    <ExitToAppIcon className="icono-salir" />
                    <p className="text-salir">salir</p>
                </NavLink>
            </ul>



        </section>
    )
}

export default Menu