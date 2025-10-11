import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import './App.css'
import Login from './pages/Login'

const App = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#001220]">
      <nav className="text-white h-16 flex items-center justify-between px-6">
        <Link to="/" className="h-full flex items-center gap-3">
          <img src="/logo.jpg" alt="logo" className="h-10 w-10 rounded-lg" />
          <h1 className="text-2xl font-bold">Hola Chat</h1>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl bg-[#031a2b] shadow-[inset_8px_8px_16px_#00070d,inset_-8px_-8px_16px_#01233d] hover:shadow-[8px_8px_16px_#00070d,-8px_-8px_16px_#01233d] transition"
          >
            Get Started
          </button>
          {user && (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-xl bg-[#031a2b] shadow-[8px_8px_16px_#00070d,-8px_-8px_16px_#01233d] hover:shadow-[inset_8px_8px_16px_#00070d,inset_-8px_-8px_16px_#01233d] transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
