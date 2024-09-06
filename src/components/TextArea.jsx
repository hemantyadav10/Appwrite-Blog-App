import React, { useEffect, useRef } from 'react'

const TextArea = ({
  value,
  onChange,
  rows = 1,
  disabled = false,
  className = '',
  placeholder = 'Type here...',
  ...props
}) => {
  const textAreaRef = useRef(null);

  const adjustHeight = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }

  useEffect(() => {
    adjustHeight();
  }, [value, props?.dependencies])

  return (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      placeholder={placeholder}
      className={` p-4  border rounded-lg resize-none   placeholder:italic placeholder:text-gray-500 focus:outline-none focus:bg-white dark:focus:bg-[#0d1117] dark:bg-[#0d1117] dark:border-[#30363D] dark:placeholder:text-[#8d96a0]  focus:ring-indigo-300 overflow-hidden focus:ring-1 w-full hover:border-gray-300 dark:hover:border-gray-600 focus:hover:border-transparent color  ${className}`}
      {...props}
    />
  )

}

export default TextArea
