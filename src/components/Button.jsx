function Button({
  type = 'button',
  children,
  className = '',
  disabled = false,
  variant = 'primary',
  ...props
}) {
  const baseStyle = 'flex items-center justify-center text-center p-2 font-medium focus-visible:ring outline-none gap-2 transition-all';
  const variantStyles = {
    primary: `bg-black dark:bg-indigo-500  transition-colors ${disabled ? 'dark:opacity-50 text-gray-200 opacity-80' : 'hover:bg-gray-800 dark:hover:bg-indigo-600 active:bg-black dark:active:bg-indigo-500 text-white dark:text-[#E6EDF3]'}`,
    secondary: `bg-gray-100 border dark:bg-[#171B21] ${disabled ? 'opacity-40 border-gray-300' : 'border-[#1f1f1f] dark:border-indigo-300 hover:bg-gray-200 dark:hover:bg-[#252b35] active:bg-[rgb(239,239,239)] dark:active:bg-[#12161C]'} text-[#1f1f1f] dark:text-indigo-300  `,
    third: `hover:bg-gray-100 dark:hover:bg-[#21262d] active:opacity-80 color`,
    category: `bg-gray-100 dark:bg-indigo-500/80 hover:bg-gray-200 dark:hover:opacity-90 active:bg-gray-100 dark:active:opacity-100 text-[#1f1f1f] dark:text-white `
  }

  const buttonStyle = `${baseStyle} ${variantStyles[variant]} ${className}`;
  return (
    <button
      type={type}
      className={buttonStyle}
      disabled={disabled}
      {...props}
    >
    {children}
    </button>
  )
}

export default Button
