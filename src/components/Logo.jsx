import React from 'react'
import { Link } from 'react-router-dom'

function Logo() {
  return (
    <Link
      to='/'
      className={`font-black text-lg sm:text-2xl flex items-center sm:scale-100 text-[#1f1f1f] dark:text-[#E6EDF3] transition-colors  `}
    >
      <span className='text-transparent transition-colors bg-gradient-to-r from-indigo-300 to-indigo-800 bg-clip-text'>
        Infinite
      </span>
      Ink
    </Link>
  )
}

export default Logo
