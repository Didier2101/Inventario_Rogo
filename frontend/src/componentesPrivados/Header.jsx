import PropTypes from 'prop-types';
import LogoutIcon from '@mui/icons-material/Logout';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { IconButton } from "@mui/material";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../contexto/Context';



const Header = ({ onMenuToggle, userRole }) => {
    const navigate = useNavigate()

    const { desloguearse, usuario } = useContext(Context)
    JSON.parse(localStorage.getItem('valor'));


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
                desloguearse();
                navigate("/", { replace: true });
            }
        });
    }

    return (
        <div className='encabezado-header'>
            <header className="header">
                <div className="iconos-izquierda">
                    {(userRole === 'administrador') && (<DragHandleIcon className='icono-menu' onClick={onMenuToggle} />)}
                    {/* <AccountCircleIcon className='icono-usuario' /> */}
                    <h2><span style={{ textTransform: 'uppercase', marginLeft: '4px' }}>{usuario.cargo} : {usuario.usuario}</span></h2>
                </div>
                <div className='iconos-derecha'>
                    <IconButton
                        onClick={CerrarSesion}
                        variant="outlined">
                        <LogoutIcon />
                    </IconButton>
                </div>
            </header>
        </div>

    )
}
// Agregar validación de prop-types
Header.propTypes = {
    onMenuToggle: PropTypes.func.isRequired, userRole: PropTypes.string.isRequired,
};

export default Header