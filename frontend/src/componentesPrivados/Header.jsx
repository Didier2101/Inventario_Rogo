

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Badge } from "@mui/material";



const Header = ({ onMenuButtonClick }) => {


    return (
        <div className='encabezado-header'>
            <header className="header max-width">
                <div className="iconos-izquierda">
                    <ViewListIcon className='icono-menu' onClick={onMenuButtonClick} />
                    <AccountCircleIcon className='icono-usuario' />
                    <h2>Yuri</h2>  {/* // aqui quiro mostrar el nombre del usuario */}

                </div>

                <div className='iconos-derecha'>
                    <Badge variant="dot" color="secondary">
                        <MailIcon color="action" />
                    </Badge>
                    <Badge variant="dot" color="secondary">
                        <NotificationsActiveIcon color="action" />
                    </Badge>




                </div>
            </header>

        </div>

    )
}

export default Header