import React, { Suspense } from 'react';
import Loader from '@/components/Loader';

const ChatLayout = ({children}) => {
  return (
    <div className='px-0 min-h-screen bg-slate-50/50'>
      <Suspense 
       fallback={<Loader className="mt-12" />}
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

