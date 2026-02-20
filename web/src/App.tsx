import { Routes, Route } from 'react-router-dom'
import Layout from './shared/Layout'
import EditPage from './pages/Edit'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<EditPage />} />
        <Route path="/about" element={<div>About Page</div>} />
      </Route>
    </Routes>
  )
}

export default App
