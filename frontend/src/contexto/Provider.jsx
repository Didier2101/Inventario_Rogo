import { useReducer } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import miReducer from './miReducer';
import types from './types';

const valorInicial = {
    logueado: false,
};



const Provider = ({ children }) => {
    const loguearse = (user) => {
        const action = {
            type: types.login,
            payload: user,
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
    const [autentificacion, dispatch] = useReducer(miReducer, valorInicial);

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
