import { useState, useEffect } from 'react';
// specific imports handled locally
export function useUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
