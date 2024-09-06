import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { Outlet, ScrollRestoration, useLocation, } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from 'react';
import { Container, Loader } from './components/index';
import Toast from './components/Toast';

function App() {
  const location = useLocation();
  const showFooter = location.pathname !== '/explore' && !location.pathname.startsWith('/editor')
  const showNavbar = !location.pathname.startsWith('/editor')

  return (
    <div className='flex flex-col min-h-screen dark:bg-[#0d1117] bg-white transition-all'>
      {showNavbar && <Navbar />}
      <ScrollRestoration />
      <Toast />
      <Suspense fallback={<Container><Loader size={4} className='justify-end ' /></Container>}>
        <Outlet />
      </Suspense>
      {showFooter && <Footer />}
    </div>
  )
}

export default App
