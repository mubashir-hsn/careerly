import Link from "next/link"
import AnalyzeResume from "./_components/analyze-resume"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const ResumeAnalyzerPage = () => {


    return (
        <div className="w-full space-y-4 px-4 py-2">
            <Link href={'/resume'}>
                <Button variant={'link'} className={'font-medium'}>
                    <ArrowLeft className='w-4 h-4' /> Back to resume page
                </Button>
            </Link>
            <AnalyzeResume />
        </div>
    )
}

export default ResumeAnalyzerPage
