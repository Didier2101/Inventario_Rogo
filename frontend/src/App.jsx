import { Route, Routes } from 'react-router-dom'


import Login from './componentsPublic/Login'
import ForgotPassword from './componentsPublic/ForgotPassword'
import NotFound from './componentsPublic/NotFound'
// import Vendedor from './Roles/Vendedor'
// import Bodeguero from './Roles/Bodeguero'
// import Auxiliar from './Roles/Auxiliar'
import Administrativo from './Roles/Administrativo'
import { useState } from 'react'







function App() {

  const [userRole, setUserRole] = useState('administrador');

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/administrativo/*" element={<Administrativo userRole={userRole} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
