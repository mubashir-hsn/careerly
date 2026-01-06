
'use client'
import ResumeTemplate from '@/components/ResumeTemplates'
import React from 'react'

const RenderTemplate = ({data,user,template}) => {
  return (
    <ResumeTemplate data={data} user={user} template={template}/>
  )
}

export default RenderTemplate

