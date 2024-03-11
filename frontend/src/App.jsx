import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Dashboard } from './pages/Dashboard';
import { Send } from './pages/Send';
import { lazy } from 'react';
import { Index } from './components/Index';


function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/signin' element={<Signin/>}></Route>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/send' element={<Send/>}></Route>
          <Route path='/' element={<Index/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
