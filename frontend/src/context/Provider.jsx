import { useReducer } from "react"
import Contexto from "./Contexto"
import MiReducer from "./MiReducer"
import types from "./types"

const init = () => {
    const valor = localStorage.getItem('estado')
    return {
        estado: !!valor
    }
}

const Provider = ({ children }) => {
    const [logeado, dispatch] = useReducer(MiReducer, {}, init)

    const loguearme = () => {
        const action = {
            type: types.login
        }
        localStorage.setItem('estado', true)
        dispatch(action)
    }

    const desloguearme = () => {
        const action = {
            type: types.logout
        }
        localStorage.removeItem('estado')
        dispatch(action)
    }


    return (
        <Contexto.Provider value={{
            ...logeado,
            loguearme,
            desloguearme
        }}>
            {children}
        </Contexto.Provider>
    )
}

export default Provider