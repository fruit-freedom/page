import FarmScene from './game/FarmScene'
import Hud from './game/Hud'

function App() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <FarmScene />
      <Hud />
    </div>
  )
}

export default App
