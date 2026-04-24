import { Axios } from 'axios'


import './App.css'
import Header from './components/Header'
import Register from './components/Register'

const axios = new Axios();


function App(){
  return (
    <div className="App">
      <Header />
      <main>
        <Register />
      </main>
    </div>
  )
}

export default App