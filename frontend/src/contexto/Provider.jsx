import PropTypes from 'prop-types';
import Context from './Context';
import miReducer from './miReducer';
import types from './types';
import { useReducer } from 'react';


const init = () => {
    const usuario = localStorage.getItem('valor');
    return {
        logueado: !!usuario,
        usuario: usuario
    }
}



const Provider = ({ children }) => {
    const [autentificacion, dispatch] = useReducer(miReducer, {}, init);


    const loguearse = (usuario) => {
        const action = {
            type: types.login,
            payload: usuario,
        };
        localStorage.setItem('valor', usuario);
        dispatch(action);
    };

    const desloguearse = () => {
        const action = {
            type: types.logout,
            payload: null,
        };
        localStorage.removeItem('valor');
        dispatch(action);
    };


    return (
        <Context.Provider value={{ ...autentificacion, loguearse, desloguearse }}>
            {children}
        </Context.Provider>
    );
};

Provider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Provider;