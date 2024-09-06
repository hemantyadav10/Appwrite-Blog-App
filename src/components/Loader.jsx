import React from 'react'

function Loader({ size = 7, className = 'justify-center'}) {
  return (
    <div className={`flex items-center  p-1 ${className}`}>

      <div className={`border-2 dark:border-transparent rounded-full dark:border-r-white dark:border-t-white size-${size} border-t-black border-r-black animate-customSpin border-transparent transition-colors `}>

      </div>
    </div>
  )
}

export default Loader
