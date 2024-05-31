import { NavLink, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';


import LogoCompañia from '../../public/logo.png'
// import ButtonComponent from '../otrosComponentes/ButtonComponent';
import { useState } from 'react';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';


// import Home from '../componentesPrivados/Home';




function Login() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');




    const handdleLogin = async (e) => {
        e.preventDefault();
        const data = {
            usuario: usuario,
            contrasena: contrasena,
        };

        try {
            const response = await fetch('http://localhost:4000/ingresar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: "Éxito",
                    text: result.message,
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false
                });
                // Redirigir al usuario a otra página si es necesario
                setTimeout(() => {
                    navigate('/Home', { replace: true });


                }, 1000);
            } else {
                Swal.fire({
                    title: "Error",
                    text: result.message,
                    icon: "error",
                    showConfirmButton: true,
                });
            }



        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
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
                        <form className='form-login' onSubmit={handdleLogin}>
                            <TextField
                                fullWidth
                                label="Usuario"
                                required
                                name='usuario'
                                InputLabelProps={{ className: 'custom-label' }}
                                onChange={(e) => setUsuario(e.target.value)}
                            />

                            <TextField
                                fullWidth
                                label="Contraseña"
                                required
                                name='contrasena'
                                type='password'
                                InputLabelProps={{ className: 'custom-label' }}
                                onChange={(e) => setContrasena(e.target.value)}
                            />


                            <label className='label' htmlFor="">
                                <input type="checkbox" name="" id="" />
                                Recordar Contraseña
                            </label>

                            <Button
                                type='submit'
                                variant="contained"
                                fullWidth
                                style={{
                                    height: '40px',
                                    fontSize: '1.2rem',
                                    backgroundColor: 'var(--segundo)'
                                }}

                            >
                                Login
                            </Button>

                        </form>
                        <NavLink
                            style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--tercero)' }}
                            to="/forgot-password"
                        >¿Olvidaste tu contraseña?</NavLink>
                    </section>
                </div>
            </div >
        </>
    );
}

export default Login;
