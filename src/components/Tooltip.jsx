import React from 'react';

function Tooltip({ content, className = 'transition-all peer-hover:delay-200' }) {
  return (
    <>
      <div
        className={`absolute z-20  flex-col items-center justify-center font-medium  -translate-x-1/2 opacity-0 pointer-events-none translate-y-1/4 top-[105%] left-1/2 peer-hover:opacity-100  hidden lg:flex ${className}`}
        role='tooltip'>
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-b-[6px] border-b-gray-800 border-r-[6px] border-r-transparent -mb-[1px] dark:border-b-gray-700">
        </div>
        <div className='px-2 py-1 text-xs text-white bg-gray-800 border-none rounded dark:bg-gray-700 w-max'>
          {content}
        </div>
      </div>
    </>
  )
}
export default Tooltip;
