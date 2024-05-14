import { NavLink } from "react-router-dom";
import Button from '@mui/material/Button';


import '../../assets/css/header.css'



const Header = () => {

    return (
        <>
            <div className="container-header">

                <div className="header">
                    <figure>
                        <img className="usuario-nombre"
                            src="../../assets/img/perfil.jpg"
                            alt=""
                        />
                        <figcaption><strong>Yuri Lozano</strong></figcaption>
                    </figure>

                    <NavLink className="salir" to="/">
                        <Button>Cerrar Session</Button>
                    </NavLink>
                </div>
            </div>
        </>
    )
}

export default Header
