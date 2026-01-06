import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb)=>{
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fn = async(...arg) => {
        setLoading(true);
        setError(null);
     
        try {
            const response = await cb(arg[0]);
            setData(response);
            setError(null)
        } catch (error) {
            setError(error);
            toast.error(error.message);
        }finally{
            setLoading(false)
        }
    };

    return {data,setData,loading,error,fn};

} 

export default useFetch;