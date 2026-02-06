import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const ChatLayout = ({children}) => {
  return (
    <div className='px-0'>
      <Suspense 
       fallback={<BarLoader className='mt-4' width={'100%'} color='gray'/>}
      >{children}</Suspense>
    </div>
  )
}

export default ChatLayout

export async function generateMetadata() {
  return {
    title: "AI Career Chatbot Assistant | Careerly",
    description: "Chat with an AI career assistant for job advice, interview prep, resume help, and career planning."
  }
}

