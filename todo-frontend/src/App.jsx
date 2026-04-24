import { Axios } from 'axios'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import Header from './components/Header'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import Dashboard from './components/Dashboard'

const axios = new Axios();


function App(){
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}

export default App