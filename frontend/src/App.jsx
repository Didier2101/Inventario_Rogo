import { Route, Routes } from 'react-router-dom'


import Login from './componentsPublic/Login'
import ForgotPassword from './componentsPublic/ForgotPassword'
import NotFound from './componentsPublic/NotFound'
// import Vendedor from './Roles/Vendedor'
// import Bodeguero from './Roles/Bodeguero'
// import Auxiliar from './Roles/Auxiliar'
import Administrativo from './Roles/Administrativo'



function App() {



  return (


    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/administrativo/*" element={<Administrativo />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>


  )
}

export default App
