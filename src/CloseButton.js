const CloseButton = ({onClick}) => {
  return (
    <button 
      className="text-[#BBBBBB] hover:bg-[#E6E6E6]  m-2 p-[2px] rounded-sm hover:text-[#878787] transition-all duration-200 ease-in-out"
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[16px] w-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}

export default CloseButton