import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

function InPageNavigation({ routes, defaultIndex = 0, defaultHidden = [], children, sticky = true }) {
  const [routeIndex, setRouteIndex] = useState(0);
  const activeTabLineRef = useRef(null);
  const activeTabRef = useRef(null);
  const { pathname } = useLocation();

  const changeRoute = useCallback((btn, i) => {
    const { offsetWidth, offsetLeft } = btn;
    activeTabLineRef.current.style.width = offsetWidth + 'px';
    activeTabLineRef.current.style.left = offsetLeft + 'px';
    setRouteIndex(i);
  }, [])

  useEffect(() => {
    changeRoute(activeTabRef.current, routeIndex);
  }, [changeRoute, defaultIndex, pathname]);

  return (
    <>
      <div className={` flex flex-col gap-2 border-b bg-white  dark:bg-[#0d1117] dark:border-b-[#30363D] dark:text-[#8d96a0] transition-colors ${sticky ? ' sticky top-16 sm:top-[72px] z-30' : 'relative'}`}>
        <div className='flex gap-6 mb-1'>
          {routes.map((route, i) => (
            <button

              ref={defaultIndex === i ? activeTabRef : null}
              key={i}
              onClick={(e) => {
                changeRoute(e.target, i)
              }}
              className={`${routeIndex === i ? 'text-[#1f1f1f]  dark:text-indigo-300 ' : 'light_color'}  text-sm py-2  px-4 rounded-md ${defaultHidden.includes(route) ? 'hidden ' : ' '} transition-colors hover:bg-gray-100 dark:hover:bg-[#171B21] hover:text-[#1f1f1f] font-medium dark:hover:text-indigo-300`}
            >
              {route}
            </button>
          ))}
        </div>
        <hr ref={activeTabLineRef} className='absolute bottom-0 transition-all border-t-2 border-t-black dark:border-t-indigo-300 ' />
      </div>
      {Array.isArray ? children[routeIndex] : children}
    </>
  )
}

export default InPageNavigation;

