import { useParams } from 'react-router-dom'
import { InPageNavigation, MoreFromAuthorCard, Loader, ProfileDetails, ErrorPage } from '../components/index'
import { ID } from 'appwrite'
import { useUserContext } from '../context/UserContext'
import { convertToReadableTime } from '../utils/index'
import { useGetSavedBlogs, useGetUserBlogs, useGetUserById } from '../lib/react-query/queries'

function Profile() {
  const { id } = useParams()
  const { user } = useUserContext();

  const { data: profileDetails, isLoading: loadingProfileDetails, error, } = useGetUserById(id || "");

  const { data: blogs, isLoading: loadingBlogs, } = useGetUserBlogs(id);

  const published = blogs?.documents.filter((blog) => blog.isPublished);

  const { data: savedBlogs, isLoading: loadingSavedBlogs } = useGetSavedBlogs(id, user?.id);

  if (loadingProfileDetails) return <>
    <div className='sm:min-h-[calc(100vh-72px)] w-full mt-[72px] p-4 min-h-[calc(100vh-64px)] '>
      <Loader />
    </div>
  </>

  if (error?.code === 404) return <>
    <ErrorPage />
  </>

  return (
    <>
      <div className='flex justify-center min-h-[calc(100vh-72px)] w-full mt-[72px] gap-4 '>
        {/* left section */}
        <div className='flex flex-col w-full gap-6 md:gap-8  max-w-[750px]  md:py-6 px-6 py-4'>
          <div className='flex flex-col items-center justify-center w-full gap-4 lg:hidden'>
            <ProfileDetails
              profileImage={profileDetails?.imageUrl}
              username={profileDetails?.username}
              name={profileDetails?.name}
              profileId={profileDetails?.$id}
              loadingBlogs={loadingBlogs}
              blogLength={published?.length}
            />
          </div >
          {/* ------------------------------------> INPAGE NAVIGATION */}
          <div className='flex flex-col gap-5 pb-16 '>
            <InPageNavigation routes={['Published', 'About', 'Saved']} defaultHidden={id === user?.id ? [] : 'Saved'}>
              {/* ------------------------------------>  PUBLISHES BLOGS SECTION*/}
              {loadingBlogs
                ? <div className='flex items-center justify-center'><Loader /></div>
                : published?.length > 0
                  ? < div className='grid w-full gap-5 sm:grid-cols-2'>
                    {published?.map((blog) => (
                      <div key={ID.unique()} className='w-full col-span-1'>
                        <MoreFromAuthorCard blog={blog} />
                      </div>
                    ))}
                  </div>
                  : <div className='dark:bg-[#21262d] p-2 rounded-md text-center bg-gray-50  text-sm transition-colors dark:text-[#E6EDF3] text-[#1f1f1f] w-full'>
                    No published blogs found.
                  </div>
              }
              {/* ------------------------------------>  ABOUT SECTION*/}
              {loadingProfileDetails
                ? <div className='flex items-center justify-center'><Loader /></div>
                :
                <div className='flex flex-col gap-6 break-words whitespace-pre-wrap color'>
                  <div>
                    {profileDetails?.bio ? profileDetails.bio : <div className='dark:bg-[#21262d] p-2 rounded-md text-center bg-gray-50  text-sm   w-full color'>
                      No bio available.
                    </div>}
                  </div>
                  <div className='text-sm light_color'>
                    Joined on {convertToReadableTime(profileDetails?.$createdAt)}
                  </div>
                </div>
              }
              {/* ------------------------------------>  SAVED BLOGS SECTION*/}
              {id === user?.id && (loadingSavedBlogs ?
                <div className='flex items-center justify-center'>
                  <Loader />
                </div>
                :
                savedBlogs?.documents.length > 0 ?
                  <div className='grid w-full gap-5 sm:grid-cols-2 '>
                    {savedBlogs?.documents.map((blogs) => (
                      <div key={ID.unique()} className='w-full col-span-1'>
                        <MoreFromAuthorCard blog={blogs.blog} />
                      </div>
                    ))}
                  </div>
                  :
                  <div className='dark:bg-[#21262d] p-2 rounded-md text-center bg-gray-50  text-sm transition-colors dark:text-[#E6EDF3] text-[#1f1f1f] w-full'>
                    No saved blogs found.
                  </div>
              )
              }
            </InPageNavigation>

          </div>
        </div >
        {/* right section */}
        < div className=' hidden px-8 border-l min-w-[400px] lg:block w-[400px] py-6 dark:border-l-[#30363D] transition-colors' >
          <div className='sticky flex flex-col gap-4 top-[96px]'>
            <ProfileDetails
              profileImage={profileDetails?.imageUrl}
              username={profileDetails?.username}
              name={profileDetails?.name}
              profileId={profileDetails?.$id}
              loadingBlogs={loadingBlogs}
              blogLength={published?.length}
              bio={profileDetails?.bio}
              showBio={true}
              createdAt={profileDetails?.$createdAt}
            />
          </div >
        </div>
      </div >
    </>

  )
}

export default Profile


{/* <div className='border lg:hidden'>
            <div className='flex flex-col items-center justify-center w-full gap-4 '>
              <div className='rounded-full size-24'>
                <img src={profileDetails?.imageUrl ? profileDetails.imageUrl : ''} alt="" className='object-cover object-center w-full h-full rounded-full' />
              </div>
              <p className='flex items-end justify-center text-lg font-semibold color'>
                <MdAlternateEmail className='size-6' />{profileDetails?.username}
              </p>
              <p className='capitalize color'>
                {profileDetails?.name}
              </p>
              {loadingBlogs ? <span className='h-[20px] w-16  animate-customPulse bg-gray-100 dark:bg-gray-800'></span> : <p className='text-sm color'>
                {published?.length === 1
                  ? `${published?.length} blog`
                  : `${published?.length} blogs`}
              </p>
              }
              {profileDetails?.$id === user?.id && <Link to={'/settings/edit-profile'}>
                <Button
                  variant='secondary'

                  className='px-6 text-sm rounded-md'
                >
                  Edit Profile
                </Button>
              </Link>}

            </div>
          </div> */}


//   <div className='rounded-full size-24'>
//   <img src={profileDetails?.imageUrl ? profileDetails.imageUrl : ''} alt="" className='object-cover object-center w-full h-full rounded-full' />
// </div>
// <p className='flex items-end text-lg font-semibold color'>
//   <MdAlternateEmail className='size-6' />{profileDetails?.username}
// </p>
// <p className='capitalize color'>
//   {profileDetails?.name}
// </p>
// {loadingBlogs ? <span className='h-[20px] w-16  animate-customPulse bg-gray-100 dark:bg-gray-800'></span> : <p className='text-sm color'>
//   {published?.length === 1
//     ? `${published?.length} blog`
//     : `${published?.length} blogs`}
// </p>
// }
// {profileDetails?.$id === user?.id && <Link to={'/settings/edit-profile'} className=' px-6 py-2  text-sm font-medium transition-colors border border-[#1f1f1f] rounded-md bg-gray-100 hover:bg-gray-200 dark:border-[#E6EDF3] dark:text-[#E6EDF3] text-[#1f1f1f]  dark:bg-[#171B21] dark:hover:bg-[#252b35] dark:active:bg-[#12161C] active:bg-[#EFEFEF] w-max'>Edit Profile</Link>}
// <p className='mt-2 whitespace-pre-wrap color'>{profileDetails?.bio ? profileDetails.bio : 'No bio available.'}</p>
// <div className='mt-6 text-sm light_color'>
//   Joined on {convertToReadableTime(profileDetails?.$createdAt)}
// </div>
