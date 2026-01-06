'use client'
import { Button } from '@/components/ui/button'
import React from 'react'

const Previewbtn = ({resumeUrl}) => {
    return (
        <Button
            onClick={() =>
                window.open(resumeUrl, "_blank", "noopener,noreferrer")
            }
        >
            View Resume
        </Button>
    )
}

export default Previewbtn