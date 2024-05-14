import { Route, Routes } from 'react-router-dom'


import Login from './componentsPublic/Login'
import ForgotPassword from './componentsPublic/ForgotPassword'
import NotFound from './componentsPublic/NotFound'
import Home from './componentesPrivados/Home'

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/*" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
