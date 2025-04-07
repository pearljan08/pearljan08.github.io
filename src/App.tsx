import { useState } from 'react'
import './App.css'
import { Button } from '@material-tailwind/react'
import me from './assets/me.jpg';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex items-center mx-64 my-5">
        <div className="grid grid-cols-3 grid-rows-3 gap-5 w-full h-screen">
          <div className="row-span-2 size-full rounded-xl shadow-lg border border-gray-100">
            
          </div>
          <div className="col-span-2 w-full h-full rounded-xl shadow-lg border border-gray-100">
            <div className="grid grid-cols-4 h-full">
              <div className="">
                
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div className="flex flex-col text-right">
                  <p className="text-3xl font-semibold">Pearl Jan Sabanal</p>
                  <p className="text-gray-600">Fullstack Developer</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="aspect-square w-full max-w-[160px] rounded-xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-center"
                    src={me}
                    alt="Pearl Jan Sabanal"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="size-full rounded-xl shadow-lg border-1 border-gray-100">
            <div className="flex items-center justify-center h-full">
            <p>This is me</p>
            </div>
          </div>
          <div className="size-full rounded-xl shadow-lg border-1 border-gray-100">
            <div className="flex items-center justify-center h-full">
            <p>This is me</p>
            </div>
          </div>
          <div className="col-span-2 size-full rounded-xl shadow-lg border-1 border-gray-100">
            <div className="flex items-center justify-center h-full">
            <p>This is me</p>
            </div>
          </div>
          <div className="size-full rounded-xl shadow-lg border-1 border-gray-100">
            <div className="flex items-center justify-center h-full">
            <p>This is me</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
