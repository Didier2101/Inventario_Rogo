import { Route, Routes } from 'react-router-dom'


import Login from './componentsPublic/Login'
import NotFound from './componentsPublic/NotFound'
import Administrativo from './Roles/Administrativo'
import RutasPublicas from './rutas/RutasPublicas'
import RutasPrivadas from './rutas/RutasPrivadas'



function App() {


  return (


    <Routes>

      <Route path="/" element={
        <RutasPublicas>
          <Login />
        </RutasPublicas>

      } />

      <Route path="/administrativo/*" element={
        <RutasPrivadas>
          <Administrativo />
        </RutasPrivadas>
      } />


      <Route path="*" element={
        <NotFound />
      } />

    </Routes>


  )
}

export default App