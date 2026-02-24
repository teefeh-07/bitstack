import { useState, useEffect } from 'react';
// specific imports handled locally
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
