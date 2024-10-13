import { useState } from 'react'

const App = () => {
  return (
    <div className='h-[100vh] w-full flex flex-col justify-between'>
      <nav className='text-white h-16 flex items-center '>
        <a href="/" className='h-full flex items-center gap-4'>
          <img src="/logo.jpg" alt="logo" className='h-20 w-20' />
          <h1 className='text-2xl font-bold '>Hola Chat</h1>
        </a>
      </nav>
      <div className='text-white h-full flex text-center border-2'>
        <h1 className='w-full text-4xl'>Hola Chat is Fast</h1>
      </div>
    </div>
  )
}

export default App
