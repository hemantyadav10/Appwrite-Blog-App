import { Link } from "react-router-dom"

function HomeCoverSection({ }) {
  return (
    <div className='relative w-full p-2 pt-10 text-center md:pt-20 '>
      <div className='space-y-4 '>
        <p className='text-3xl font-bold text-transparent transition-colors md:text-5xl bg-clip-text dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-gradient-to-b from-gray-500 to-black'>
          <span  className='text-transparent transition-colors bg-gradient-to-r from-indigo-400 to-indigo-900 bg-clip-text'>Infinite</span>Ink: Where Ideas Flow</p>
        <p className='max-w-md mx-auto text-base md:text-lg medium_color'>Join Infinite Ink to explore ideas, share your creativity, and discover endless possibilities in storytelling and writing</p>
      </div>
      <Link to={'/explore'}>
        <button className='px-6 py-3 mt-4 transition-colors border border-indigo-300 shadow-md focus:outline-none focus-visible:ring shadow-indigo-400/50 rounded-2xl color hover:bg-indigo-400 hover:text-white dark:hover:bg-indigo-400 active:bg-indigo-500 dark:active:bg-indigo-500'>Explore Blogs</button>
      </Link>
    </div>
  )
}

export default HomeCoverSection
