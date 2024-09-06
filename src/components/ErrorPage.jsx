import React from 'react'
import { Link } from 'react-router-dom'

function ErrorPage() {
  return (
    <div className='flex flex-col  min-h-[calc(100vh-72px)] w-full  sm:mt-[72px]  mt-16  '>
      <div className="flex flex-col items-center justify-center flex-1 gap-6 p-4 text-center ">
        <p className="font-bold text-red-500 text-8xl">404</p>
        <p className="mt-4 text-4xl font-semibold color">
          You have discovered a secret place
        </p>
        <p className="mt-2 text-lg light_color">
          Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to another URL.
        </p>
        <p className="mt-2 text-lg light_color">
          Why not go back and explore some of our latest writings?
        </p>
          <Link to="/" className="px-6 py-2 text-lg font-medium text-white transition duration-300 bg-blue-500 rounded-full hover:bg-blue-700">
            Take me home!
          </Link>
      </div>
    </div>
  )
}

export default ErrorPage
