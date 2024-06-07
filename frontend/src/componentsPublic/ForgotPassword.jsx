import { NavLink } from "react-router-dom"

import { TextField } from "@mui/material"


import ButtonComponent from '../otrosComponentes/ButtonComponent';

const ForgotPassword = () => {
    return (
        <div className='container-all'>
            <section className="img">

            </section>
            <div className="container-login">

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