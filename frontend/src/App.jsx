import { Route, Routes } from 'react-router-dom'


import Login from './componentsPublic/Login'
import ForgotPassword from './componentsPublic/ForgotPassword'
import NotFound from './componentsPublic/NotFound'
import Administrador from './componentesPrivados/Administrador'





function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/*" element={<Administrador />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
