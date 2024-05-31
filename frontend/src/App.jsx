import { Route, Routes } from 'react-router-dom'


import Login from './componentsPublic/Login'
import ForgotPassword from './componentsPublic/ForgotPassword'
import NotFound from './componentsPublic/NotFound'
import Home from './componentesPrivados/Home'
import Footer from './componentesPrivados/Footer'



function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={

          <Login />

        } />
        <Route path="/forgot-password" element={

          <ForgotPassword />

        } />
        <Route path="/*" element={

          <Home />

        } />
        <Route path="*" element={

          <NotFound />

        } />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
