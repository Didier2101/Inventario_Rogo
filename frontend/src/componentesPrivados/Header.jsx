import { NavLink } from "react-router-dom"

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


const Header = ({ onMenuButtonClick }) => {
    return (
        <div className='encabezado-header'>
            <header className="header max-width">
                <div className="iconos-izquierda">
                    <ViewListIcon className='icono-menu' onClick={onMenuButtonClick} />
                    <AccountCircleIcon className='icono-usuario' />
                    <h2>Yuri</h2>
                </div>

                <div className='iconos-derecha'>
                    <div className="contenedor-icono-alerta">
                        <span className="alerta-correo">3</span>
                        <EmailIcon className='icono-correo icono' />
                    </div>
                    <div className="contenedor-icono-alerta">
                        <span className="alerta-notificaciones">3</span>
                        <NotificationsActiveIcon className='icono-notificaciones icono' />
                    </div>

                    <NavLink to="/" className="enlace-salir">
                        <p className="texto-salir">Salir</p>
                        <ExitToAppIcon className="icono-salir" />
                    </NavLink>
                </div>
            </header>
        </div>

    )
}

export default Header