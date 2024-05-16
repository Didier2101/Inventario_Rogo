import { NavLink } from "react-router-dom"

import { TextField } from "@mui/material"

import LogoCompañia from '../../public/logo.png'
import ButtonComponent from '../otrosComponentes/ButtonComponent';

const ForgotPassword = () => {
    return (
        <div className='container-all'>
            <div className="container-login shadow">
                <section className="berify">
                    <div className="contain-logo">
                        <img src={LogoCompañia} alt="" />
                    </div>
                    <div className="contain-description-company">
                        <h1>Sistema de inventario</h1>
                        <p>Controla todo el sistema de tu empresa desde aqui</p>
                    </div>
                </section>

                <section className='contain-form-login'>

                    <h2>¿Olvidaste tu contraseña?</h2>
                    <p>No te preocupes, ¡aquí estamos para ayudarte!</p>
                    <form className='form-login'>
                        <TextField fullWidth label="Correo Electronico" required InputLabelProps={{ className: 'custom-label' }} />





                        <ButtonComponent

                            color="var(--segundo)" width="100%" height="55px" fontSize="1.5rem" margin="2px" text="Rucuperar" />

                    </form>
                    <NavLink
                        style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--tercero)' }}
                        to="/"
                    >¿Quieres volver al inicio?</NavLink>
                </section>
            </div>
        </div>
    )
}

export default ForgotPassword