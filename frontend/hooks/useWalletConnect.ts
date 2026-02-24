import { useState, useEffect } from 'react';
// specific imports handled locally
import { Web3Wallet } from '@walletconnect/web3wallet';
export function useWalletConnect() {
  const [isLoading, setIsLoading] = useState(false);
