
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';




const Header = () => {
    const navigate = useNavigate()

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
                navigate("/", { replace: true });
            }
        });
    }

    return (
        <div className='encabezado-header'>
            <header className="header">
                <div className="iconos-izquierda">
                    <ViewListIcon className='icono-menu' />
                    <AccountCircleIcon className='icono-usuario' />
                    <h2>Yuri</h2>  {/* // aqui quiro mostrar el nombre del usuario */}
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

export default Header