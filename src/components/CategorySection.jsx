import React, { useCallback } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { blogCategories } from '../utils/BlogCategories';



function CategorySection({ loading, loadingMore }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category')?.toLowerCase();
  const { pathname } = useLocation();

  const handleCategoryClick = useCallback((category) => {
    if (currentCategory === category) {
      searchParams.delete('category')
      setSearchParams(searchParams);
    }
    else {
      searchParams.set('category', category);
      setSearchParams(searchParams)
    }
    navigate(`/explore?${searchParams.toString().toLowerCase()}`, { preventScrollReset: pathname !== '/' });
  }, [currentCategory, searchParams, pathname])


  return (
    <div className='flex flex-wrap gap-3'>
      {blogCategories.map((category, index) => (
        <button
        aria-label={`category:${category}`}
          disabled={loading || loadingMore}
          key={index}
          onClick={() => handleCategoryClick(category?.toLowerCase())}
          className={`${currentCategory === category.toLowerCase() ? 'bg-[#1f1f1f] text-white dark:bg-indigo-500' : 'hover:bg-[#1f1f1f] hover:text-white bg-gray-100 dark:bg-[#21262d] dark:hover:bg-indigo-500 dark:hover:text-[#E6EDF3]'} px-3 py-2 text-xs font-medium text-center   rounded-md   active:opacity-80 text-[#1f1f1f] transition-colors   dark:bg-[#21262d]   dark:text-[#E6EDF3] `}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategorySection
