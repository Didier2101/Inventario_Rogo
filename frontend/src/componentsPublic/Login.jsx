import { NavLink, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';


import LogoCompañia from '../../public/logo.png'
import ButtonComponent from '../otrosComponentes/ButtonComponent';



function Login() {
    const navigate = useNavigate();

    const Ingresar = () => {
        navigate("/Home");
    };
    return (
        <div className='container-all'>
            <div className="container-login shadow">
                <section className="berify">
                    <div className="contain-logo">
                        <img src={LogoCompañia} alt="" />
                    </div>
                    <div className="contain-description-company">
                        <h1 >Bienvenido al Sistema de Inventario</h1>
                        <p className=''>¡Impulsa el control total de tu empresa desde aquí!</p>
                    </div>
                </section>

                <section className='contain-form-login'>

                    <h2>¡Bienvenido de nuevo!</h2>
                    <p>¡Nos alegra mucho que hayas regresado!</p>
                    <form className='form-login'>
                        <TextField fullWidth label="Correo Electronico" required InputLabelProps={{ className: 'custom-label' }} />

                        <TextField fullWidth label="Contraseña" required InputLabelProps={{ className: 'custom-label' }} />


                        <label className='label' htmlFor="">
                            <input type="checkbox" name="" id="" />
                            Recordar Contraseña
                        </label>

                        <ButtonComponent
                            onClick={Ingresar}
                            color="var(--segundo)"
                            width="100%"
                            height="50px"
                            fontSize="1.5rem"
                            margin="20px"
                            text="Ingresar" />

                    </form>
                    <NavLink
                        style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--tercero)' }}
                        to="/forgot-password"
                    >¿Olvidaste tu contraseña?</NavLink>
                </section>
            </div>
        </div>
    );
}

export default Login;
