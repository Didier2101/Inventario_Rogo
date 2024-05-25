import { NavLink, useNavigate } from "react-router-dom"

import LogoutIcon from '@mui/icons-material/Logout';
import { Button, Tooltip } from "@mui/material";


import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import Swal from "sweetalert2";
import { useContext } from "react";
import Contexto from "../context/Contexto";



const Menu = ({ visible }) => {

    const navigate = useNavigate()
    const { desloguearme } = useContext(Contexto)


    const CerrarSesion = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Realmente quieres cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí puedes añadir la lógica para cerrar sesión, por ejemplo, eliminar los datos del usuario en el estado
                Swal.fire({
                    title: "Terminaste",
                    text: 'Sesion terminada',
                    icon: "warning",
                    timer: 2000,
                    showConfirmButton: false,
                });
                // Lógica adicional para cerrar sesión, como redirigir a la página de inicio de sesión
                desloguearme()
                navigate("/", { replace: true });
            }
        });
    }

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

                <Tooltip title="Cerrar Sesion" placement="right-start">
                    <Button

                        onClick={CerrarSesion}

                        variant="outlined"
                    >
                        <LogoutIcon />
                    </Button>
                </Tooltip>


            </ul>



        </section>
    )
}

export default Menu