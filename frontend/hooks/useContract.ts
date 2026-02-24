import { useState, useEffect } from 'react';
// specific imports handled locally
export function useContract() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
