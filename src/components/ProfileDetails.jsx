import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './index'
import { useUserContext } from '../context/UserContext'
import { convertToReadableTime } from '../utils/index'
import { UsernameIcon } from '../assets'

function ProfileDetails({ profileImage, username, name, profileId, loadingBlogs, blogLength, bio, createdAt, showBio = false }) {
  const { user } = useUserContext();
  return (
    <>
      <div className='rounded-full size-24 '>
        <img src={profileImage ? profileImage : ''} alt="profile image" className='object-cover object-center w-full h-full rounded-full' />
      </div>
      <p className='flex items-center text-lg font-semibold color'>
        <UsernameIcon className='size-6'/>
        {username}
      </p>
      <p className='capitalize color'>
        {name}
      </p>
      {loadingBlogs ? <span className='h-[20px] w-16  animate-customPulse bg-gray-100 dark:bg-gray-800'></span> : <p className='text-sm color'>
        {blogLength === 1
          ? `${blogLength} blog`
          : `${blogLength} blogs`}
      </p>
      }
      {profileId === user?.id && <Link className='w-max' to={'/settings/edit-profile'}>
        <Button
          variant='secondary'
          className='px-6 text-sm rounded-md'
        >
          Edit Profile
        </Button>
      </Link>}
      {showBio &&
        <>
          <p className='mt-2 whitespace-pre-wrap color'>{bio ? bio : 'No bio available.'}</p>
          <div className='mt-6 text-sm light_color'>
            Joined on {convertToReadableTime(createdAt)}
          </div>
        </>
      }

    </>
  )
}

export default ProfileDetails
