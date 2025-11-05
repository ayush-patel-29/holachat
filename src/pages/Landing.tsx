import { Link } from 'react-router-dom'

const Landing = () => {

  return (
    <div className="min-h-screen bg-[#001220] text-white flex flex-col">

      <main className="flex-1 flex items-center justify-center px-6">
        <section className="max-w-5xl w-full text-center">
          <div className="relative p-[3px] rounded-2xl glow-button-wrapper mx-auto mb-10 w-28 h-28">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#0a1929] to-[#001220] grid place-items-center">
              <img src="/logoTbg.png" className="w-24 h-24 opacity-80" />
            </div>
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold leading-tight">
            Fast Conversational Inference
          </h2>
          <p className="mt-4 text-gray-300 text-lg max-w-3xl mx-auto">
            Experience a futuristic chat interface with blazing-fast responses and a sleek neumorphism design.
          </p>

          <div id="get-started" className="mt-10 flex flex-wrap items-center justify-center gap-4 relative">
            <div className="relative p-[3px] rounded-2xl glow-button-wrapper">
              <Link
                to="/login"
                className="relative block px-6 py-3 rounded-2xl bg-gradient-to-br from-[#0a1929] to-[#001220] hover:from-[#0d2137] hover:to-[#021a2e] transition-all duration-300 font-semibold"
              >
                Get Started
              </Link>
              
              {/* Doodle Arrow pointing from below */}
              <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 hidden lg:block pointer-events-none">
                <svg 
                  width="100" 
                  height="110" 
                  viewBox="0 0 100 110" 
                  className="doodle-arrow"
                >
                  <defs>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" className="gradient-stop-1" />
                      <stop offset="33%" className="gradient-stop-2" />
                      <stop offset="66%" className="gradient-stop-3" />
                      <stop offset="100%" className="gradient-stop-4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 100 Q 30 80, 35 60 Q 40 40, 45 25 Q 48 15, 50 5"
                    stroke="url(#arrowGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    className="arrow-path"
                  />
                  <path
                    d="M 45 10 L 50 3 L 55 10"
                    stroke="url(#arrowGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="arrow-head"
                  />
                </svg>
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
            
            @keyframes float {
              0%, 100% {
                transform: translateY(0px) translateX(0px);
              }
              25% {
                transform: translateY(-8px) translateX(2px);
              }
              50% {
                transform: translateY(-4px) translateX(-2px);
              }
              75% {
                transform: translateY(-10px) translateX(1px);
              }
            }
            
            .glow-button-wrapper {
              background: linear-gradient(45deg, 
                #3b82f6, #8b5cf6, #ec4899, #22d3ee, #3b82f6);
              background-size: 300% 300%;
              animation: rotate-gradient 3s ease infinite;
              filter: blur(0px);
            }
            
            .glow-button-wrapper::before {
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
            
            .arrow-path {
              stroke-dasharray: 300;
              stroke-dashoffset: 300;
              animation: draw 2.5s ease-in-out infinite;
              filter: drop-shadow(0 0 8px rgba(234, 179, 8, 0.8)) 
                      drop-shadow(0 0 12px rgba(234, 179, 8, 0.5));
            }
            
            .arrow-head {
              opacity: 0;
              animation: show-head 2.5s ease-in-out infinite;
              filter: drop-shadow(0 0 8px rgba(234, 179, 8, 0.8))
                      drop-shadow(0 0 12px rgba(234, 179, 8, 0.5));
            }
            
            @keyframes gradient-shift {
              0%, 100% {
                stop-color: #fbbf24;
              }
              25% {
                stop-color: #f59e0b;
              }
              50% {
                stop-color: #eab308;
              }
              75% {
                stop-color: #fcd34d;
              }
            }
            
            .gradient-stop-1 {
              animation: gradient-shift 3s ease infinite;
              animation-delay: 0s;
            }
            
            .gradient-stop-2 {
              animation: gradient-shift 3s ease infinite;
              animation-delay: 0.75s;
            }
            
            .gradient-stop-3 {
              animation: gradient-shift 3s ease infinite;
              animation-delay: 1.5s;
            }
            
            .gradient-stop-4 {
              animation: gradient-shift 3s ease infinite;
              animation-delay: 2.25s;
            }
            
            @keyframes draw {
              0% {
                stroke-dashoffset: 300;
              }
              50%, 80% {
                stroke-dashoffset: 0;
              }
              100% {
                stroke-dashoffset: 300;
              }
            }
            
            @keyframes show-head {
              0%, 45% {
                opacity: 0;
              }
              50%, 80% {
                opacity: 1;
              }
              100% {
                opacity: 0;
              }
            }
            
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
          `}</style>
        </section>
      </main>

      <footer className="h-16 flex items-center justify-center text-gray-400 text-sm">
        © {new Date().getFullYear()} HolaChat
      </footer>
    </div>
  )
}

export default Landing
