import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const CoverLetter = ({children}) => {
  return (
    <div className='py-5 px-2 md:px-5 bg-slate-100'>
      <Suspense 
         fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
        >
          {children}
        </Suspense>
    </div>
  )
}

export default CoverLetter