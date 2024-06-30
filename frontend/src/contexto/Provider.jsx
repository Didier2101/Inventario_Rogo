import { useReducer } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import miReducer from './miReducer';
import types from './types';

const valorInicial = {
    logueado: false,
    usuario: null,
};



const Provider = ({ children }) => {
    const [autentificacion, dispatch] = useReducer(miReducer, valorInicial);
    const loguearse = (usuario) => {
        console.log('Usuario en loguearse:', usuario); // Añadir este log
        const action = {
            type: types.login,
            payload: usuario,
        };
        dispatch(action);
    };

    const desloguearse = () => {
        const action = {
            type: types.logout,
            payload: null,
        };
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
