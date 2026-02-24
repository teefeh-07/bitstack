import { useState, useEffect } from 'react';
// specific imports handled locally
import { ChainhooksClient } from '@hirosystems/chainhooks-client';
export function useChainhooks() {
  const [isLoading, setIsLoading] = useState(false);
