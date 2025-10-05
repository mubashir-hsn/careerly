"use client";
import MDEditor from '@uiw/react-md-editor'
import React from 'react'

const CoverLetterPreview = ({content}) => {
  return (
    <div className='py-4 px-2'>
        <MDEditor value={content} preview='preview' height={"700px"}/>
    </div>
  )
}

export default CoverLetterPreview