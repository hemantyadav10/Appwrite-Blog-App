import React, { useEffect, useState } from 'react';
import { blogCategories } from '../utils/BlogCategories';
import { toast } from 'react-toastify';
import { useThemeContext, useUserContext } from '../context/UserContext';
import { TextEditor, Tooltip, Loader, TextArea, Logo, ErrorPage } from '../components/index'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useContentContext } from '../context/EditorContent';
import { useCreateBlog, useGetBlogById, useUpdateBlog } from '../lib/react-query/queries';
import { slugify } from '../utils/index';
import { CloseButton } from '../assets/index';


function EditorPage() {
  const { id } = useParams()
  const { data, isLoading: loading } = useGetBlogById(id);
  const navigate = useNavigate();
  const [banner, setBanner] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [tagName, setTagName] = useState('');
  const [tags, setTags] = useState([]);
  const { user, } = useUserContext();
  const location = useLocation();
  const isUpdatePostRoute = location.pathname.startsWith('/update-post/');
  const { theme, setTheme } = useThemeContext();
  const { content, setContent } = useContentContext()
  const [publish, setPublish] = useState(true);
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Uncategorized');
  const { mutate: createBlog } = useCreateBlog();
  const { mutate: updateBlog } = useUpdateBlog(id);

  useEffect(() => {
    if (id && data) {
      setFeaturedImage(data.featuredImage || null)
      setDescription(data.description || '')
      setTags(data.tags || [])
      setBanner(data.featuredImage || '')
      setTitle(data.title || '')
      setSelectedCategory(data.category || 'Uncategorized');
      setContent({
        content: data.content || '',
        readTime: data.readTime || 0,
      });
    }
  }, [data, id]);

  const changeTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  const slug = slugify(title);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) e.preventDefault();
  }

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()
      const finalValue = tagName?.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      if (finalValue && !tags.includes(finalValue)) {
        setTags(prev => ([...prev, finalValue]))
      }
      setTagName('');
    }
  }

  const autoSubmitTags = (e) => {
    const finalValue = tagName?.trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    if (finalValue && !tags.includes(finalValue)) {
      setTags(prev => ([...prev, finalValue]))
    }
    setTagName('');
  }

  const removeTag = (indexToRemove) => {
    const filteredTags = tags.filter((_, i) => i !== indexToRemove)
    setTags(filteredTags)
  }

  const publishBlog = (e) => {
    e.preventDefault();

    if (!featuredImage) return toast.error('A header image is required.');
    if (!title.trim().length) return toast.error('A title is required.');
    if (!description.trim().length) return toast.error('A description is required.')
    if (!tags.length) return toast.error('At least one tag is required.')
    if (!content.content.length) return toast.error('Write something in your blog.')

    const blogData = {
      userId: user.id,
      category: selectedCategory,
      title,
      description,
      tags,
      content: content.content,
      readTime: content.readTime,
      featuredImage: featuredImage,
      isPublished: publish
    }

    if (id) {
      const toastId = toast.loading(data?.isPublished ? 'Updating Blog...' : 'Publishing Blog');
      updateBlog({ ...blogData, blogId: id, imageId: data.imageId }, {
        onSuccess: () => {
          toast.update(toastId, { render: data?.isPublished ? 'Blog Updated' : 'Blog Published', type: "success", isLoading: false, autoClose: 5000, closeOnClick: true });
          navigate(`/blog/${slug}-${id}`);
        },
        onError: (error) => {
          console.log(error);
          toast.update(toastId, { render: error.message, type: "error", isLoading: false, autoClose: 5000, closeOnClick: true });
        }
      });

    }
    else {
      const toastId = toast.loading(publish ? 'Publishing Blog...' : 'Saving Draft...');
      createBlog(blogData, {
        onSuccess: (newBlog) => {
          toast.update(toastId, { render: publish ? "Blog Published" : "Draft Saved", type: "success", isLoading: false, autoClose: 5000, closeOnClick:true });
          if (publish) return navigate(`/blog/${slug}-${newBlog.$id}`);
          else return navigate('/dashboard/blogs');
        },
        onError: (error) => {
          console.log(error);
          toast.update(toastId, { render: error.message, type: "error", isLoading: false, autoClose: 5000, closeOnClick:true });
        }
      });
    }
  }

  useEffect(() => {
    return () => setContent({ content: '', readTime: 0 })
  }, [])


  if (id && loading) return <div className='flex items-center justify-center w-full p-6'><Loader /></div>

  if (id && data?.creator.$id !== user.id) {
    return <ErrorPage />
  }

  if (isUpdatePostRoute && !data) {
    return <div>No blog data found</div>;
  }

  return (
    <form onSubmit={publishBlog} className='flex flex-col items-center w-full  dark:text-[#E6EDF3]  flex-1 dark:bg-[#0d1117] bg-white  transition-all '>
      <div className='flex items-center justify-between  h-16 gap-3 px-4 text-xs font-semibold md:gap-4 md:text-sm lg:px-10 sm:px-6 sm:h-[72px] sticky top-0 z-20 bg-white/90 w-full dark:bg-[#0d1117]/80 backdrop-blur-md border-b dark:border-b-[#30363D] transition-colors'>
        <div><Logo /></div>
        <div className='flex items-center gap-3 md:gap-4'>
          <button
            className={`active:opacity-100  bg-[#1f1f1f] text-white flex items-center gap-1   dark:text-[#E6EDF3] px-2 rounded-full  py-1  group dark:bg-indigo-500 hover:opacity-80 order-2 transition-colors`}
          >
            {id && data?.isPublished ? 'Update' : 'Publish'}
          </button>
          {id && <Link
            to={-1}
            className={`active:opacity-100  bg-gray-200 text-[#1f1f1f] flex items-center gap-1 dark:text-[#E6EDF3] px-2 rounded-full  py-1  group dark:bg-[#3a424a] hover:opacity-80  order-2 transition-colors`}
          >
            Cancel
          </Link>}
          <button
            onClick={() => setPublish(false)}
            type='submit'
            className={`flex items-center gap-1 text-gray-500 transition-colors rounded-md hover:text-black group active:text-gray-500 active:scale-95  dark:text-[#E6EDF3] dark:hover:bg-[#21262d] order-3 ${id && 'hidden'}`}
          >
            Save Draft
          </button>
          <div className='relative'>
            <button
              type='button'
              onClick={changeTheme}
              aria-label='toggle theme'
              className='size-8  transition-colors rounded-full  bg-gray-100 hover:bg-gray-200 group dark:hover:bg-[#2b313a]  peer    focus-visible:ring outline-none flex items-center justify-center dark:bg-[#21262d]'>
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
        </div>
      </div>
      <div className='flex flex-col items-center w-full gap-4 p-4 md:p-8 pb-10 dark:text-[#E6EDF3]  '>
        <div className={`w-full max-w-[850px]  mx-8 mt-2   ${banner ? 'aspect-auto' : ' hover:opacity-50 bg-gray-100 aspect-video'} relative dark:bg-[#222f3e] dark:border-[#8d96a0] transition-all `}
        >
          {banner && <button
            aria-label='remove banner'
            type='button'
            onClick={() => {
              setBanner('')
              setFeaturedImage(null)
            }}
            className='absolute right-0 z-10 flex items-center justify-center translate-x-1/2 translate-y-1/2 bg-white rounded-full shadow-md bottom-full active:scale-90 hover:bg-gray-50 group size-4 md:size-5 '
          >
            <CloseButton className='stroke-red-500 size-3' />
          </button>
          }
          {banner && <img src={banner} alt={'blog banner image'}
            className='object-cover object-center w-full aspect-video' />}
          {!banner && <label htmlFor="uploadThumbnail" className='flex flex-col items-center justify-center md:text-4xl font-semibold text-gray-300 transition-colors size-full dark:text-[#8d96a0] text-2xl cursor-pointer gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-8 md:size-12 ">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            {/* <MdOutlineFileUpload className='size-14' /> */}
            Upload Banner
            <input
              id='uploadThumbnail'
              type="file"
              accept='.png, .jpg, .jpeg'
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                setBanner(file ? URL.createObjectURL(file) : undefined)
                setFeaturedImage(file)
              }}
            />
          </label>
          }
        </div>
        <div
          className='max-w-[850px] w-full relative  md:mt-8 mt-4 space-y-2 md:space-y-4 '>
          <div className='flex flex-col '>
            <TextArea
              value={title}
              onChange={handleTitleChange}
              placeholder='Blog Title'
              onKeyDown={handleKeyDown}
              maxLength='150'
              className='px-2 text-3xl font-bold border-none hover:placeholder:opacity-50 md:text-4xl'
            />
            <div className='text-xs text-right text-gray-500 dark:placeholder:text-[#8d96a0] transition-colors'>
              {title.length}/150
            </div>
            {/* <hr className='dark:border-[#30363D] transition-colors opacity-50' /> */}
          </div>
          <div className='flex flex-col'>
            <TextArea
              value={description}
              onChange={handleDescriptionChange}
              placeholder='Description'
              onKeyDown={handleKeyDown}
              maxLength='200'
              className='px-2 text-lg italic border-none placeholder:font-bold placeholder:hover:opacity-50'
            />
            <div className='text-xs text-right text-gray-500 dark:placeholder:text-[#8d96a0] transition-colors'>
              {description.length}/200
            </div>
          </div>
          <div className="w-full">
            <select
              aria-label='select category'
              name='category'
              id="underline_select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
              className="block w-full px-1 py-4 -my-1 font-medium bg-white  dark:bg-[#0d1117] focus:outline-none color focus:ring-1 focus:ring-indigo-300 rounded-md"
            >
              {blogCategories.map(category => (
                <option key={category} value={category} className=''>{category}</option>
              ))}
            </select>
          </div>
          {/* blog tags */}
          <div className='relative'>
            <TextArea
              placeholder={tags.length === 5 ? 'Tags:' : 'Tags'}
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              onKeyDown={handleEnter}
              onBlur={autoSubmitTags}
              disabled={tags.length === 5}
              className='border-none disabled:bg-white disabled:placeholder-black disabled:placeholder:font-medium dark:bg-[#0d1117] dark:placeholder:text-[#8d96a0] dark:disabled:placeholder-[#E6EDF3] hover:placeholder:opacity-50 disabled:placeholder:hover:opacity-100 px-2 placeholder:font-bold '
            />
            {tags.length < 5 && (
              <div className='absolute text-xs text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:placeholder:text-[#8d96a0] transition-colors'>
                {5 - tags.length} {tags.length !== 4 ? 'Tags' : 'Tag'} left
              </div>
            )}
          </div>
          {tags.length > 0 && <div className='flex flex-wrap gap-3'>
            {tags.map((tag, i) => (
              <p key={i} className='flex items-center gap-1  p-1 px-2 text-sm bg-gray-100 rounded-full  dark:text-[#c9d1d9] dark:bg-[#21262d] transition-colors font-semibold jsutify-center'>
                <span>
                  {tag}
                </span>
                <button
                  aria-label='remove tag'
                  type='button'
                  onClick={() => removeTag(i)}
                  className='transition-color rounded-full hover:bg-gray-300 size-4 dark:hover:bg-[#434d5b]'
                >
                  <CloseButton className='color size-4' />
                </button>
              </p>
            ))}
          </div>}
          <TextEditor />
        </div>
      </div>
    </form >
  )
}
export default EditorPage;
