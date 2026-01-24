import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const ChatLayout = ({children}) => {
  return (
    <div className='px-0 md:px-0 py-4'>
      <Suspense 
       fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
      >{children}</Suspense>
    </div>
  )
}

export default ChatLayout