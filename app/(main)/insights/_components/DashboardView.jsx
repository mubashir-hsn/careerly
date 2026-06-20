"use client"
import { updateIndustryInsights } from '@/actions/user';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';
import { Loader2, RefreshCcw } from 'lucide-react';
import MarketOverviewCards from './MarketOverviewCards';
import ChartAndSkills from './ChartAndSkills';
import LearningPath from './LearningPath';

const DashboardView = ({ insights }) => {

    const router = useRouter();

    const {
        loading: updating,
        fn: updateInsightFn,
        data: updatedData,
        error: updateError,
    } = useFetch(updateIndustryInsights);

    React.useEffect(() => {
        if (updatedData && !updating && !updateError) {
            toast.success("Industry Insights updated.");
            router.refresh();
        }
    }, [updatedData, updating, updateError]);

    const canUpdate = new Date() >= new Date(insights.nextUpdate);
    // Format dates using date-fns
    const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
    const nextUpdateDistance = formatDistanceToNow(
        new Date(insights.nextUpdate),
        { addSuffix: true }
    );

    const handleSubmit = async () => {
        await updateInsightFn();
    }

    if (!insights || !insights.salaryRanges || insights.salaryRanges.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-10 text-center bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-2xl mx-auto my-12">
                 <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                 <h2 className="text-2xl font-black text-slate-800 mb-2">Analyzing Industry Trends</h2>
                 <p className="text-slate-500 max-w-md font-medium text-sm leading-relaxed">
                     We are currently using AI to generate real-time Pakistan market insights, salary benchmarks, and learning paths for your specialization. Please check back in a few seconds or refresh the page.
                 </p>
            </div>
        )
    }

    return (
        <div className='space-y-6'>

            <div className='flex items-center justify-between'>
                <Button
                    variant={'default'}
                    disabled={updating || !canUpdate}
                    onClick={handleSubmit}
                >
                    {updating ? (
                        <>
                            <Loader2 className='w-4 h-4 animate-spin mr-2' /> Updating....
                        </>
                    ) : !canUpdate ? (
                        `Next update ${nextUpdateDistance}`
                    ) : (
                        <>
                            <RefreshCcw size={16} />
                            Update Insights
                        </>
                    )}
                </Button>

                <p className='font-medium tracking-wide text-sm text-slate-600 px-2 md:p-4'>Last updated: <br className='block md:hidden' /> {lastUpdatedDate}</p>
            </div>

            {/* Market Overview Cards */}
           <MarketOverviewCards insights={insights}/>

            {/* Chart and Skills */}
            <ChartAndSkills insights={insights}/>

            {/* Learning path section */}
            <LearningPath learningPaths={insights.learningPaths}/>
        
        </div>
    )
}

export default DashboardView