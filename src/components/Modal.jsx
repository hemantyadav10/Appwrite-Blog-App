import React, { useRef } from 'react';
import ReactDOM from 'react-dom'
import { useEffect } from 'react';


function Modal({ closeModal, isOpen, children, heading = 'Delete', onDelete, loading = false }) {
  const modalRef = useRef(null);

  const closePopup = (e) => {
    if (e.target === modalRef.current) {
      closeModal();
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = ''
    }

    return () => document.body.style.overflow = '';
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={modalRef}
      onClick={closePopup}
      className='fixed inset-0 z-50 flex items-end justify-center p-4 text-black dark:bg-black/50 backdrop-blur-sm sm:items-center bg-black/20 dark:text-[#E6EDF3] transition-colors opacity-100 duration-500'
    >
      <div className='w-full sm:max-w-md bg-white rounded-lg dark:bg-[#0d1117]  border border-transparent dark:border-[#30363D] transition-colors shadow-xl'>
        <div className='flex flex-col items-center justify-center gap-2 p-4 sm:px-6 sm:py-10 sm:flex-row sm:gap-4 sm:items-start'>
          <div className='flex flex-col w-full gap-4 py-4 sm:py-0'>
            <p className='text-lg font-medium text-center sm:text-left dark:text-[#E6EDF3] transition-colors text-black '>
              {heading}
            </p>
            <p className='text-center text-gray-500 sm:text-left dark:text-[#8d96a0] transition-colors'>
              {children || 'Delete this permanently?'}
            </p>
          </div>
        </div>
        <div className='flex flex-col w-full gap-2 px-4 py-3 text-white rounded-b-lg sm:px-6 bg-gray-50 sm:flex-row sm:justify-end sm:gap-4 dark:bg-[#0d1117]  dark:border-[#30363D] border-t border-transparent transition-colors'>
          <button
            disabled={loading}
            onClick={onDelete}
            className={`w-full px-3 py-1 font-medium bg-[#1f1f1f] border-2 border-transparent rounded-md sm:w-max sm:order-2 dark:text-[#E6EDF3] dark:bg-indigo-500   transition-colors ${loading ? 'opacity-70' : 'dark:hover:bg-indigo-600 dark:active:bg-indigo-700 hover:bg-gray-700 active:bg-[#1f1f1f]'}`}
          >
            Delete
          </button>
          <button
            onClick={closeModal}
            className='w-full px-3 py-1 font-medium text-black bg-white border-2 border-gray-200 rounded-md sm:w-max dark:bg-[#21262d] dark:border-transparent dark:text-[#E6EDF3] hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-[#3a424a] dark:active:bg-[#21262d] transition-colors'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('portal')
  )
}

export default Modal
