import { NavLink } from 'react-router-dom';

import ButtonComponent from '../otrosComponentes/ButtonComponent'; // Importa tu componente ButtonComponent

const NotFound = () => {
    return (

        <div className="not-found-container">
            <h2 className="not-found-title">Lo siento, página no encontrada</h2>

            <h2 className="not-found-title">404</h2>
            <p className="not-found-message">Lo siento, no pudimos encontrar la página que estás buscando. ¿Quizás has escrito mal la URL? Asegúrate de verificar tu ortografía.</p>

            <NavLink to="/" style={{ textDecoration: 'none', width: '300px' }}>
                <ButtonComponent
                    color="var( --secondary)"
                    width="100%"
                    height="50px"
                    fontSize="1.5rem"
                    text="Regresar al Inicio"
                />
            </NavLink>
        </div>


    );
}

export default NotFound;

