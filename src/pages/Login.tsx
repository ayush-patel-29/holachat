import { useAuth } from '../context/AuthContext'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

const Login = () => {
  const { signIn } = useAuth()

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#001220] text-white flex items-center justify-center px-6">
      <div className="relative p-[3px] rounded-2xl glow-card-wrapper w-full max-w-md">
        <div className="w-full p-8 rounded-2xl bg-gradient-to-br from-[#0a1929] to-[#001220]">
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
          <p className="text-gray-300 text-center mt-2">Choose a provider to continue</p>
          <div className="mt-8 flex flex-col gap-4">
            <button
              onClick={() => signIn('google')}
              className="w-full px-6 py-3 rounded-xl bg-[#052039] shadow-[12px_12px_32px_#00070d,-12px_-12px_32px_#01233d] hover:shadow-[inset_12px_12px_32px_#00070d,inset_-12px_-12px_32px_#01233d] transition font-semibold flex items-center justify-center gap-3"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>
            <button
              onClick={() => signIn('github')}
              className="w-full px-6 py-3 rounded-xl bg-[#052039] shadow-[12px_12px_32px_#00070d,-12px_-12px_32px_#01233d] hover:shadow-[inset_12px_12px_32px_#00070d,inset_-12px_-12px_32px_#01233d] transition font-semibold flex items-center justify-center gap-3"
            >
              <FaGithub className="text-xl" />
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes rotate-gradient {
          0% {
            background: linear-gradient(45deg, 
              #3b82f6, #8b5cf6, #ec4899, #22d3ee, #3b82f6);
            background-size: 300% 300%;
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 100%;
          }
          100% {
            background: linear-gradient(45deg, 
              #3b82f6, #8b5cf6, #ec4899, #22d3ee, #3b82f6);
            background-size: 300% 300%;
            background-position: 0% 50%;
          }
        }
        
        .glow-card-wrapper {
          background: linear-gradient(45deg, 
            #3b82f6, #8b5cf6, #ec4899, #22d3ee, #3b82f6);
          background-size: 300% 300%;
          animation: rotate-gradient 3s ease infinite;
          filter: blur(0px);
        }
        
        .glow-card-wrapper::before {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 1.25rem;
          background: linear-gradient(45deg, 
            #3b82f6, #8b5cf6, #ec4899, #22d3ee, #3b82f6);
          background-size: 300% 300%;
          animation: rotate-gradient 3s ease infinite;
          filter: blur(20px);
          opacity: 0.7;
          z-index: -1;
        }
      `}</style>
    </div>
  )
}

export default Login
