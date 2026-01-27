"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

const PdfButton = ({ data, user, activeStyle, fileName }) => {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGenerating(true)

    try {
      // API call to generate PDF
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, user, activeStyle }),
      })

      if (!response.ok) throw new Error("PDF generation failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // Trigger download
      const a = document.createElement("a")
      a.href = url
      a.download = fileName || 'document.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

    } catch (err) {
      console.error(err)
      toast.error("Failed to generate PDF. Try again!")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={handleGeneratePDF} disabled={isGenerating}>
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </>
      )}
    </Button>
  )
}

export default PdfButton
