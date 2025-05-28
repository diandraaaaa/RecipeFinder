import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../constants/config';

type Method = 'GET' | 'POST';

interface FetchOptions {
    method?: Method;
    body?: any; // used only if method is POST
    dependencies?: any[]; // list of things to watch for refetching
}

export const useFetch = <T>(
    endpoint: '/recipes' | '/recommend',
    options: FetchOptions = {}
) => {
    const { method = 'GET', body = null, dependencies = [] } = options;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`${BACKEND_URL}${endpoint}`, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    ...(method === 'POST' && body ? { body: JSON.stringify(body) } : {}),
                });

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const result = await res.json();
                setData(result);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, dependencies);

    return { data, loading, error };
};
