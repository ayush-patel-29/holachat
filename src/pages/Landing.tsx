import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Landing = () => {
  const { signIn } = useAuth()

  return (
    <div className="min-h-screen bg-[#001220] text-white flex flex-col">

      <main className="flex-1 flex items-center justify-center px-6">
        <section className="max-w-5xl w-full text-center">
          <div className="mx-auto mb-10 w-28 h-28 rounded-2xl bg-[#031a2b] grid place-items-center shadow-[20px_20px_60px_#00070d,-20px_-20px_60px_#01233d]">
            <img src="/vite.svg" className="w-14 h-14 opacity-80" />
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold leading-tight">
            Fast Conversational Inference
          </h2>
          <p className="mt-4 text-gray-300 text-lg max-w-3xl mx-auto">
            Experience a futuristic chat interface with blazing-fast responses and a sleek neumorphism design.
          </p>

          <div id="get-started" className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 rounded-2xl bg-[#052039] shadow-[12px_12px_32px_#00070d,-12px_-12px_32px_#01233d] hover:shadow-[inset_12px_12px_32px_#00070d,inset_-12px_-12px_32px_#01233d] transition font-semibold"
            >
              Get Started
            </Link>
            
          </div>
        </section>
      </main>

      <footer className="h-16 flex items-center justify-center text-gray-400 text-sm">
        © {new Date().getFullYear()} HolaChat
      </footer>
    </div>
  )
}

export default Landing
