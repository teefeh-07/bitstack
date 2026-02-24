import { useState, useEffect } from 'react';
// specific imports handled locally
export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
