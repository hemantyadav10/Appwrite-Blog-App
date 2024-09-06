import React from 'react'

function Container({ children }) {
  return (
    <div className='flex flex-col  min-h-[calc(100vh-64px)] w-full  sm:mt-[72px] sm:min-h-[calc(100vh-72px)]  mt-16 '>
      {children}
    </div>
  )
}

export default Container
