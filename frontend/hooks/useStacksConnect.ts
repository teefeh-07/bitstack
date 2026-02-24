import { useState, useEffect } from 'react';
import { showConnect } from '@stacks/connect';
export function useStacksConnect() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
