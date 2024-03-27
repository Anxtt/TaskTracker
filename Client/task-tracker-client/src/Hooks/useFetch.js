import React, { useCallback, useEffect, useState } from 'react'

export default function useFetch({ url, options }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState();

    const callBack = useCallback(async () => {
        setIsLoading(true);

        const response = await fetch(url, options);
        const data = await response.json();

        setIsLoading(false);
        setData(data);
    }, [url, options])

    useEffect(() => {
        callBack();
    }, [callBack]);

    return { data, isLoading };
}

// example usage:
/* 
    const { data, loading } = useFetch("https://yesno.wtf/api");

  return (
    <div className="App">{loading ? "loading" : JSON.stringify(data)}</div>
  );
*/