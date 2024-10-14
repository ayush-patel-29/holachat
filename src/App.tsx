import { useState } from 'react'
import { main } from './lib/groq';
import "./App.css"

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [content,setContent] = useState([]);


  const getContent = async ():Promise<void> =>{
    
    try{
      const res:string = await main(prompt);
      setPrompt("")
      console.log(res)
      // setContent(res);

    }catch(err:unknown){
      if(err instanceof Error){
        console.error(err.message);
        throw err;
      }
    }
  }
  return (
    <div className='h-[100vh] w-full flex flex-col justify-between'>
      <nav className='text-white h-16 flex items-center '>
        <a href="/" className='h-full flex items-center gap-4'>
          <img src="/logo.jpg" alt="logo" className='h-20 w-20' />
          <h1 className='text-2xl font-bold '>Hola Chat</h1>
        </a>
      </nav>
      <div className='text-white h-full flex flex-col text-center'>
        <h1 className='w-full text-4xl font-bold my-10'>HolaChat is Fast Conversational Inference</h1>
        <div className='w-full h-full flex items-center justify-center'>
          <div className='w-[70%] h-[90%] border-2 relative rounded-xl'>
            <div className='w-full px-7 flex flex-row py-4 items-end'>
              <textarea
                placeholder='Type Your Prompt'
                className='textArea '
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button className={`w-[70px] text-white h-full flex justify-center items-center mb-2 ${prompt.length == 0 && 'pointer-events-none cursor-not-allowed'} `} onClick={getContent}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </div>
            <div>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
