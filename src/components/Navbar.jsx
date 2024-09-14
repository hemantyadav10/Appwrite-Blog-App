import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SettingsIcon, WriteIcon, ProfileIcon, DashboardIcon, LogoutIcon, UsernameIcon, SearchIcon, CloseButton } from '../assets/index';
import { Link, NavLink, useLocation, useNavigate, } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logo, Tooltip, Button, Input } from '../components/index'
import { useThemeContext, useUserContext } from '../context/UserContext';
import { useSignOutAccount } from '../lib/react-query/queries';
import { capitalizeWords } from '../utils';

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const { user, setUser, setIsAuthenticated, isAuthenticated } = useUserContext();
  const { theme, setTheme } = useThemeContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('')
  const { mutate: signOut, isPending: loading } = useSignOutAccount();
  const navItems = [
    {
      name: 'Home',
      slug: '/'
    },
    {
      name: 'Explore',
      slug: '/explore'
    },
    {
      name: 'Write',
      slug: '/editor'
    }
  ]

  const menuItems = [
    {
      name: 'Profile',
      slug: `/profile/${user?.id}`,
      icon: ProfileIcon
    },
    {
      name: 'Write',
      slug: '/editor',
      icon: WriteIcon
    },
    {
      name: 'Dashboard',
      slug: '/dashboard/blogs',
      icon: DashboardIcon

    },
    {
      name: 'Settings',
      slug: '/settings/edit-profile',
      icon: SettingsIcon

    }
  ]

  const handleSearch = (e) => {
    if (e.keyCode === 13 && searchValue.length) {
      navigate(`/explore?q=${searchValue}`)
      setSearchValue('')
    }
  }

  const handleClick = () => {
    setOpenMenu(prev => !prev);
  }

  const closeMenu = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenu(false);
    }
  }

  useEffect(() => {
    if (isMenuVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuVisible])


  const handleLogout = async () => {
    signOut(undefined, {
      onSuccess: () => {
        setUser(null);
        setIsAuthenticated(false);
        setOpenMenu(false);
        localStorage.removeItem('user');
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      }
    })
  }

  const changeTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  const focusSearchBar = useCallback((e) => {
    const activeElement = document.activeElement;
    const isInputActive = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
    if (e.key === '/' && !isInputActive && searchRef.current) {
      e.preventDefault();
      searchRef.current.focus();
    }
    if (e.key === 'Escape' && searchRef.current === document.activeElement) {
      e.preventDefault();
      searchRef.current.blur();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', focusSearchBar)
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', focusSearchBar);
    }
  }, []);

  const handleCloseMenu = () => setIsMenuVisible(false);
  const toggleMenu = () => setIsMenuVisible(prev => !prev)


  return (
    <>
      <nav className={`navbar  fixed top-0 z-50   w-full h-16 sm:h-[72px] dark:bg-[#151b23]  border-transparent  dark:border-b-[#30363D]  dark:text-[#E6EDF3] text-sm sm:px-6  lg:px-10   px-4 md:grid grid-cols-10 flex justify-between bg-white shadow-md  transition-all border-b `} >
        {/* border-b */}
        <div className={` md:hidden absolute left-0 w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)] bg-white top-full  ${!isMenuVisible && ' hidden '} gap-2 flex flex-col items-center  text-2xl text-white z-10 color dark:bg-[#0d1117] px-8 `}>
          <div className='w-full my-4 text-right '>
            <button
              aria-label='close menu'
              onClick={handleCloseMenu}
              className=''
            >
              <CloseButton />
            </button>
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.slug}
              onClick={handleCloseMenu}
              className={({ isActive }) => `${isActive && 'text-indigo-500  bg-gray-100 dark:bg-[#21262d] dark:text-indigo-400'} w-full text-center active:opacity-80 rounded-lg  p-2 hover:bg-gray-100 transition-colors dark:hover:bg-[#21262d]`}
            >
              {item.name}
            </NavLink>
          ))}
          <button
            disabled={loading}
            onClick={() => {
              handleCloseMenu();
              handleLogout();
            }}
            className={`w-full text-center ${!isAuthenticated && 'hidden'}`}
          >
            {loading ? 'Logging out' : 'Logout'}
          </button>
        </div>
        <div className='flex items-center justify-start col-span-3 gap-3 font-medium sm:gap-6 sm:cols-span-5'>
          <button
            aria-label='show menu'
            onClick={toggleMenu}
            className='p-1 rounded-full md:hidden'
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 color">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <Logo className='text-[#1f1f1f] transition-colors dark:text-indigo-400' />
          {location.pathname !== '/explore' && (
            <div>
              <button
                aria-label='search button'
                onClick={() => {
                  navigate('/explore')
                  handleCloseMenu();
                }}
                className='flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 xl:hidden dark:bg-[#212830] transition-colors focus dark:hover:bg-[#262c36] dark:active:bg-[#2a313c]'>
                <SearchIcon className='size-4 medium_color' />
              </button>
              <div className='relative hidden xl:flex'>
                <Input
                  ref={searchRef}
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  icon={SearchIcon}
                  onKeyDown={handleSearch}
                  className='font-normal rounded-full focus:ring-indigo-300 w-72 focus:w-80 dark:bg-[#0d1117] '
                />
                {searchValue.length === 0 && <span className='absolute gap-1 italic font-normal -translate-y-1/2 pointer-events-none top-1/2 left-10 light_color '>
                  Type <span className=' px-[4px] text-[12px] py-[1px] border rounded-[4px] light_color border-[#4b5563]    dark:border-[#8d96a0] mx-[2px]'>/</span> to Search
                </span>}
                {/* <span className='absolute py-[3px] px-[6px] text-[10px] border rounded-sm light_color right-3 -translate-y-1/2 top-1/2 border-[#8d96a0]/50 bg-white leading-none dark:bg-[#0d1117] pointer-events-none'>/</span> */}
              </div>
            </div>)
          }
        </div>
        <div className='justify-center hidden col-span-4 gap-8 font-medium md:flex'>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.slug}
              className={({ isActive }) => `items-center gap-1   transition-colors  hover:opacity-80 group active:opacity-100   dark:hover:text-indigo-400 hidden md:flex ${isActive ? ' dark:text-indigo-400 text-indigo-600 underline  underline-offset-[6px]  ' : '  dark:text-[#E6EDF3]  text-[#1f1f1f]'}`}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
        <div className='flex items-center justify-end col-span-3 gap-3 md:gap-6 sm:cols-span-5'>
          <div className='relative'>
            <button
              onClick={changeTheme}
              aria-label='toggle theme'
              className='size-8  transition-colors rounded-full  bg-gray-100 hover:bg-gray-200 group dark:hover:bg-[#262c36]  peer    focus-visible:ring outline-none flex items-center justify-center dark:bg-[#212830]'>
              {theme === 'light'
                ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 color">
                  <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" />
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 fill-indigo-300">
                  <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z" clipRule="evenodd" />
                </svg>
              }
            </button>
            <Tooltip content={theme === 'dark' ? 'Switch to Light Mode' : 'Switch To Dark Mode'} />
          </div>
          {isAuthenticated ? (
            <>
              <div
                ref={menuRef}
                className='relative flex items-center gap-6'
              >
                <button
                  onClick={handleClick}
                  className={`flex items-center justify-center transition-colors rounded-full hover:brightness-90 size-8  ${!openMenu && 'peer'} aspect-square`}>
                  {user?.imageUrl ?
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className='object-cover object-center rounded-full size-8 aspect-square'
                      width='104'
                      height='104'
                    />
                    :
                    <div className="relative overflow-hidden transition-all bg-gray-100 rounded-full size-8 dark:bg-gray-600">
                      <svg className="absolute w-10 h-10 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    </div>
                  }
                </button>
                <Tooltip content={capitalizeWords(user.name)} />
                <div
                  className={`absolute  border shadow-md right-0 translate-y-4 top-full bg-white   w-56  ${openMenu ? '' : 'hidden'} rounded-lg  z-10 py-2  text-sm   dark:border-[#30363D] dark:bg-[#151b23] color dark:shadow-black/50`}
                >
                  <ul className='flex flex-col gap-1 list-none'>
                    <li className='flex flex-col items-start gap-2 px-4 color'>
                      <p className='capitalize '>{user.name}</p>
                      <p className='flex items-center '>
                        <UsernameIcon className=' size-5' />{user?.username}
                      </p>
                    </li>
                    <hr className='my-2 dark:border-[#30363D] transition-colors' />
                    {menuItems.map((item) => (
                      <NavLink
                        to={item.slug}
                        key={item.name}
                        onClick={() => setOpenMenu(false)}
                        className={({ isActive }) => `${isActive && 'bg-gray-100  dark:bg-[#2b313a]'} flex items-center gap-2  medium_color group active:bg-gray-200  hover:bg-gray-100 py-3 px-4 w-full dark:hover:bg-[#262c36]  dark:active:bg-[#2a313c]`}
                      >
                        {item.icon && <item.icon className='size-5 medium_color' />}
                        {item.name}
                      </NavLink>
                    ))}
                    <hr className='my-2 dark:border-[#30363D] transition-colors' />
                    <button
                      disabled={loading}
                      onClick={handleLogout}
                      className='flex items-center gap-2 medium_color transition-colors active:bg-gray-200  hover:bg-gray-100 py-3 px-4 w-full dark:hover:bg-[#262c36]  dark:active:bg-[#2a313c] disabled:opacity-80'
                    >
                      <LogoutIcon className='medium_color size-5' />
                      {loading ? 'Signing out...' : 'Sign out'}
                    </button>
                  </ul>
                </div>
              </div>
            </>
          )
            : (location.pathname === '/login'
              ? (
                <Link to='/signup'>
                  <Button
                    onClick={handleCloseMenu}
                    variant='secondary'
                    className=' text-xs border-2 border-indigo-300 rounded-lg dark:border-indigo-300 w-[72px]'
                  >
                    Sign Up
                  </Button>
                </Link>
              )
              : (
                <Link to='/login'>
                  <Button
                    onClick={handleCloseMenu}
                    variant='secondary'
                    className='text-xs border-2 border-indigo-300 rounded-lg dark:border-indigo-300 w-[72px]'
                  >
                    Sign In
                  </Button>
                </Link>
              ))
          }
        </div>
      </nav >
    </>
  )
}

export default React.memo(Navbar);
