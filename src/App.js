import './App.css'
import { proxy } from 'valtio'

import Seal from './Seal.jsx'
import Draw from './Draw.jsx'
import Homepage from './Homepage.jsx'

export const proxyState = proxy({
  seal: {
    visible: false,
  },
  draw: {
    visible: false,
  },
  homepage: {
    visible: true,
  },
})

function App() {
  return (
    <div className='App'>
      <Seal />
      <Draw />
      <Homepage />
    </div>
  )
}

export default App
