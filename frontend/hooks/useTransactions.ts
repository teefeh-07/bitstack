import { useState, useEffect } from 'react';
// specific imports handled locally
export function useTransactions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    // initialization payload
    let isMounted = true;
    return () => { isMounted = false; };
  }, []);
  return { isLoading, error, data };
}
