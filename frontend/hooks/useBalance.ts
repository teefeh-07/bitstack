import { useState, useEffect } from 'react';
// specific imports handled locally
export function useBalance() {
  const [isLoading, setIsLoading] = useState(false);
