import React, { forwardRef, useState } from 'react';
import { EyeIcon, EyeOff, CloseButton, ErrorIcon } from '../assets/index';

const Input = forwardRef(function Input({
  type = 'text',
  placeholder,
  icon: Icon,
  showPasswordToggle,
  className = '',
  disabled = false,
  clearInputButton = false,
  divClassName = '',
  error = null,
  onClick,
  ...props
}, ref) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='flex flex-col w-full gap-1'>
      <div className={`relative ${divClassName}`}>
        <input
          type={showPasswordToggle && showPassword ? 'text' : type}
          placeholder={placeholder}
          disabled={disabled}
          className={` placeholder:italic bg-gray-100 border  p-3 placeholder:text-gray-500 focus:ring-1 outline-none focus:bg-white dark:focus:bg-[#0d1117] dark:placeholder:text-[#8d96a0] dark:bg-[#21262d] dark:border-[#30363D]  transition-colors pl-10 w-full  ${error ? 'focus:ring-[#b3261e] border-[#b3261e] dark:border-[#FF6B6B]/70 dark:focus:ring-[#FF6B6B]/70' : 'focus:ring-indigo-300 hover:border-gray-300 dark:hover:border-gray-600 focus:border-transparent'}  ${className} color`}
          ref={ref}
          {...props}
        />
        {Icon && <span className="absolute flex items-center justify-center -translate-y-1/2 top-1/2 left-3 light_color ">
          <Icon />
        </span>}

        {showPasswordToggle && (
          <button
            type="button"
            aria-label={showPassword ? 'hide password' : 'show password'}
            className="absolute p-1 -translate-y-1/2 rounded-full right-2 top-1/2 hover:bg-gray-200 dark:hover:bg-[#2b313a] light_color"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeIcon />
            ) : (
              <EyeOff />
            )}
          </button>
        )}
        {clearInputButton && props.value &&
          <button
          aria-label='clear input'
            onClick={onClick}
            className='absolute flex items-center justify-center -translate-y-1/2 rounded-full top-1/2 right-3 group hover:bg-gray-100 dark:hover:bg-[#2c323b] transition-colors'
          >
            <CloseButton />
          </button>
        }
      </div>
      {error && <div className='text-[#b3261e] dark:text-[#FF4C4C] text-xs  flex gap-1 font-medium transition-colors'>
        <span className='flex items-center'>
          <ErrorIcon className='size-4' />
        </span>
        <p>{error.message}</p>
      </div>}
    </div>
  );
});

export default Input;
