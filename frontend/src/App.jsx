import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import KeyGenerator from './pages/KeyGenerator.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import { useTheme } from './hooks/useTheme.js'
import { useLanguage } from './hooks/useLanguage.js'

function App() {
  // تهيئة الثيم واللغة عند التحميل
  useTheme()
  useLanguage()

  return (
    <>
      <CursorGlow />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/laptopland-adminlogin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/key-generator" element={<KeyGenerator />} />
      </Routes>
    </>
  )
}

export default App
