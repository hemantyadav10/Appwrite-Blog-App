import React, { useMemo, useState } from 'react'
import { Container } from './index'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'
import { PasswordIcon, ProfileIcon, WriteIcon, BlogsIcon, CloseButton } from '../assets/index'


function SideNavbar() {
  const { isAuthenticated } = useUserContext();
  const [showMenu, setShowMenu] = useState(false);


  const sideNavItems = useMemo(() => [
    {
      heading: 'Dashboard',
      subHeadings: [
        {
          name: 'Blogs',
          slug: '/dashboard/blogs',
          icon: BlogsIcon
        },
        {
          name: 'Write',
          slug: '/editor',
          icon: WriteIcon
        }
      ]
    },
    {
      heading: 'Settings',
      subHeadings: [
        {
          name: 'Edit Profile',
          slug: '/settings/edit-profile',
          icon: ProfileIcon
        },
        {
          name: 'Change Password',
          slug: '/settings/change-password',
          icon: PasswordIcon
        }
      ]
    }
  ], [])

  return (
    !isAuthenticated ? <Navigate to={'/login'} /> :
      <Container>
        <div className='flex flex-col w-full bg-white sm:flex-row dark:bg-[#0d1117] transition-colors'>
          <button aria-label='open side navbar' onClick={() => setShowMenu(true)} className='flex mt-6 ml-6 transition-colors sm:hidden w-max hover:opacity-70 active:opacity-100'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 color">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
          <section className={`  min-w-[250px] py-6 dark:border-r-[rgb(48,54,61)]  border-r sm:flex flex-col gap-12 lg:pl-24 min-h-[calc(100vh-72px)] sm:pl-6 max-w-[300px] lg:w-full color fixed bg-white z-40 sm:z-0  ${!showMenu && ' hidden '}  dark:bg-[#0d1117] transition-colors  shadow-lg sm:shadow-none bottom-0 top-16 left-0 sm:relative sm:top-0`} >
            <div className='relative flex flex-col gap-12'>
              <button aria-label='Close Menu' className='absolute flex right-2 sm:hidden hover:opacity-70 active:opacity-100 color top-1' onClick={() => setShowMenu(prev => !prev)}>
                <CloseButton />
              </button>
              {sideNavItems.map((item, i) => (
                <div key={i} className='flex flex-col gap-6 '>
                  <div className='flex flex-col gap-2 sm:pr-4 '>
                    <p className='px-4 text-lg font-medium color'>
                      {item.heading}
                    </p>
                    <hr className='w-full dark:border-[#30363D] color' />
                  </div>
                  <ul className='flex flex-col gap-2 '>
                    {item.subHeadings.map((subItems, j) => (
                      <li key={j}>
                        <NavLink
                          onClick={() => setShowMenu(false)}
                          to={subItems.slug}
                          className={({ isActive }) => `${isActive ? 'bg-gray-100 border-r-[3px] border-r-[#1f1f1f] dark:bg-[#2b313a] dark:border-r-indigo-400 color ' : ' hover:bg-gray-100  active:bg-gray-200 dark:hover:bg-[#2b313a] dark:active:bg-[#2b313a]/80 medium_color hover:text-[#1f1f1f] dark:hover:text-[#E6EDF3]'} flex items-center gap-3  py-3 px-4 transition-colors`}
                        >
                          <subItems.icon className={`size-5 medium_color`} />
                          {subItems.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <Outlet />
        </div>
      </Container>
  )
}

export default SideNavbar


