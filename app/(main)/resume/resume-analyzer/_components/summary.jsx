import React from 'react'
import ScoreGauge from './score-guage'
import ScoreBadge from './ScoreBadge'



const Category = ({ title, score = 75 }) => {
    const textColor = score > 70 ? 'text-green-600' : score > 49 ? 'text-yellow-600' : 'text-red-600'
    
    return (
        <>
            <div className='px-4 py-4 bg-slate-100 rounded-lg flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                    <p className='text-lg md:text-2xl'>{title}</p>
                    <ScoreBadge score={score}/>
                </div>
                <div>
                    <p className='text-lg md:text-2xl'><span className={`${textColor}`}>{score}</span>/100</p>
                </div>
            </div>
        </>
    )
}

const Summary = ({feedback}) => {
    return (
        <div className='max-w-lg'>
            <div className='bg-white w-full space-y-5 rounded-2xl shadow-lg py-3 md:py-12 px-4 '>
                <div className='flex flex-col md:flow-row justify-start items-center gap-5 p-2 pt-0 md:pt-0 md:p-4 mb-6'>
                    <ScoreGauge score={feedback.overallScore} />
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl md:text-2xl font-bold text-primary'>Your Resume Score</h2>
                        <p className='text-sm text-muted-foreground'>This score is calculated based on the variables listed below</p>
                    </div>
                </div>

                <div className='space-y-4'>
                    <Category title='Ton & Style' score={feedback.aiFeedback.toneAndStyle.score} />
                    <Category title='Content' score={feedback.aiFeedback.content.score} />
                    <Category title='Structure' score={feedback.aiFeedback.structure.score} />
                    <Category title='Skills' score={feedback.aiFeedback.skills.score} />
                </div>
            </div>
        </div>
    )
}

export default Summary