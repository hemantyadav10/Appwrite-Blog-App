import React from 'react'
import { Link } from 'react-router-dom'

function UserCard({user}) {
  return (
    <Link to={`/profile/${user.$id}`} className='flex gap-4 p-2 transition-colors hover:bg-gray-100 dark:hover:bg-[#20242b] active:opacity-80 dark:active:opacity-80 rounded-lg'>
      <div className='rounded-full size-16'>
        <img src={user.imageUrl} alt={user.name} className='object-cover object-center w-full h-full rounded-full'/>
      </div>
      <div className='flex flex-col justify-start gap-1'>
        <p className='text-base font-medium capitalize color'>{user.name}</p>
        <p className='text-sm font-normal color'>@{user.username}</p>
      </div>
    </Link>
  )
}

export default UserCard
