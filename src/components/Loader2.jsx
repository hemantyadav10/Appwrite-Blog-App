import React from 'react'

function Loader2() {
  return (
    <div className="flex flex-row gap-3">
      <div className="bg-black rounded-full size-4 animate-bounce dark:bg-indigo-400"></div>
      <div className="size-4 rounded-full bg-black animate-bounce [animation-delay:-.3s] dark:bg-indigo-300"></div>
      <div className="size-4 rounded-full bg-black animate-bounce [animation-delay:-.5s] dark:bg-indigo-300"></div>
    </div>
  )
}

export default Loader2
