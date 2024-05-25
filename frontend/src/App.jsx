import { Route, Routes } from 'react-router-dom'


import Login from './componentsPublic/Login'
import ForgotPassword from './componentsPublic/ForgotPassword'
import NotFound from './componentsPublic/NotFound'
import Home from './componentesPrivados/Home'
import Provider from './context/Provider'
import RutasPublicas from './router/RutasPublicas'
import RutasPrivadas from './router/RutasPrivadas'




function App() {


  return (
    <Provider>
      <Routes>
        <Route path="/" element={
          <RutasPublicas>
            <Login />
          </RutasPublicas>
        } />
        <Route path="/forgot-password" element={
          <RutasPublicas>
            <ForgotPassword />
          </RutasPublicas>
        } />
        <Route path="/*" element={
          <RutasPrivadas>
            <Home />
          </RutasPrivadas>
        } />
        <Route path="*" element={
          <RutasPublicas>
            <NotFound />
          </RutasPublicas>
        } />
      </Routes>
    </Provider>

  )
}

export default App
