import { useContext } from "react"
import Contexto from "../context/Contexto"
import { Navigate } from "react-router-dom"


const RutasPrivadas = ({ children }) => {


    const { estado } = useContext(Contexto)

    return (estado)
        ? children
        : <Navigate to="/inicio" />

}

export default RutasPrivadas