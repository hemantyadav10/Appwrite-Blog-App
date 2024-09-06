import React from 'react'
import { SignupComponent } from '../components/index'

function Signup() {
  return (
    <div className='flex items-center justify-center w-full sm:mt-[72px] mt-16 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] p-6'>
      <div className='flex items-center justify-center w-full '>
      <div className='w-[492px] min-w-[420px] hidden md:block'>
          <img src="/loginImage.svg" alt='illustration' width={492} height={492}/>
        </div>
        <SignupComponent />
      </div>
    </div>
  )
}

export default Signup
