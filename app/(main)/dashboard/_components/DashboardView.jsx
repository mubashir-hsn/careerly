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
    } = useFetch(updateIndustryInsights);

    React.useEffect(() => {
        if (updatedData && !updating) {
            toast.success("Industry Insights updated.");
            router.refresh();
        }
    }, [updatedData, updating]);

    const canUpdate = new Date() >= new Date(insights.nextUpdate);
    // Format dates using date-fns
    const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
    const nextUpdateDistance = formatDistanceToNow(
        new Date(insights.nextUpdate),
        { addSuffix: true }
    );

    const handleSubmit = async () => {
        try {
            await updateInsightFn();
            toast.success("Industry Insights updated.");
        } catch (err) {
            toast.error('Failed to update industry insights.')
            console.log("Error while updating insights: ", err)
        }
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