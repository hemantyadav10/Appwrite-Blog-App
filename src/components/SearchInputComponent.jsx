import React from 'react'
import { Input } from './index';
import { SearchIcon } from '../assets/index';

const SearchInputComponent = ({ setSearchParams, query, className = '' }) => {
  return (
    <div className={` ${className}`}>
      <p className='flex items-center justify-between w-full text-2xl font-bold text-transparent md:text-3xl bg-clip-text dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-gradient-to-b from-gray-500 to-black'>
        Search
      </p>
      <Input
        value={query || ''}
        onChange={(e) => setSearchParams(prev => {
          prev.set('q', e.target.value)
          return prev;
        }, { replace: true })}
        placeholder='Find users or explore blogs...'
        icon={SearchIcon}
        clearInputButton
        onClick={() => setSearchParams(prev => {
          prev.set('q', '');
          return prev;
        })
        }
        className={`rounded-full  focus:ring-indigo-300 pr-10`}
      />
    </div>

  )
}

export default SearchInputComponent
