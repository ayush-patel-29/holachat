import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { signIn, user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate('/app', { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#001220] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#031a2b] shadow-[20px_20px_60px_#00070d,-20px_-20px_60px_#01233d]">
        <h2 className="text-2xl font-bold text-center">Sign in</h2>
        <p className="text-gray-300 text-center mt-2">Choose a provider to continue</p>
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={() => signIn('google')}
            className="w-full px-6 py-3 rounded-xl bg-[#052039] shadow-[12px_12px_32px_#00070d,-12px_-12px_32px_#01233d] hover:shadow-[inset_12px_12px_32px_#00070d,inset_-12px_-12px_32px_#01233d] transition font-semibold"
          >
            Continue with Google
          </button>
          <button
            onClick={() => signIn('github')}
            className="w-full px-6 py-3 rounded-xl bg-[#052039] shadow-[12px_12px_32px_#00070d,-12px_-12px_32px_#01233d] hover:shadow-[inset_12px_12px_32px_#00070d,inset_-12px_-12px_32px_#01233d] transition font-semibold"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
