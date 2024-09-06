import React from 'react'
import { Slide, ToastContainer } from 'react-toastify'
import { useThemeContext } from '../context/UserContext'

function Toast() {
  const { theme } = useThemeContext();
  return (
    <>
      <ToastContainer
        position='top-right'
        transition={Slide}
        theme={theme === 'light' ? 'dark' : 'light'}
        closeOnClick
        hideProgressBar
        closeButton={false}
      />
    </>
  )
}

export default Toast
