import "../../assets/css/menu.css";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";

import { NavLink } from "react-router-dom";

const Menu = () => {
  return (
    <>
      <section className="section-menu">


        <ul>
          <NavLink to="/inicio" className="menu-item">
            <span>
              <HomeIcon />
              <p className="text">Inicio</p>
            </span>
          </NavLink>

          <NavLink to="/productos" className="menu-item">
            <span>
              <Inventory2Icon />
              <p className="text">Productos</p>
            </span>
          </NavLink>

          <NavLink to="/empleados" className="menu-item">
            <span>
              <GroupAddIcon />
              <p className="text">Empleados</p>
            </span>
          </NavLink>

          <NavLink to="/clientes" className="menu-item">
            <span>
              <SupervisorAccountIcon />
              <p className="text">Clientes</p>
            </span>
          </NavLink>

          <NavLink to="/proveedores" className="menu-item">
            <span>
              <BusinessCenterIcon />
              <p className="text">Proveedores</p>
            </span>
          </NavLink>

          <NavLink to="/puntos_venta" className="menu-item">
            <span>
              <AddBusinessIcon />
              <p className="text">Puntos de venta</p>
            </span>
          </NavLink>

          <NavLink to="/bodegas" className="menu-item">
            <span>
              <MapsHomeWorkIcon />
              <p className="text">Bodegas</p>
            </span>
          </NavLink>

          <NavLink to="/ventas" className="menu-item">
            <span>
              <AddShoppingCartIcon />
              <p className="text">Ventas</p>
            </span>
          </NavLink>

          <NavLink to="/facturas" className="menu-item">
            <span>
              <ReceiptLongIcon />
              <p className="text">Facturas</p>
            </span>
          </NavLink>
        </ul>
        {/* <button>Logout</button> */}
      </section>
    </>
  );
};

export default Menu;
