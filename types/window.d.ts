declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      isTrust?: boolean;
      isRainbow?: boolean;
      isOkxWallet?: boolean;
      isBitKeep?: boolean;
      isRabby?: boolean;
      providers?: any[];
      request?: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
    };
    phantom?: {
      solana?: {
        connect: () => Promise<{ publicKey: any }>;
        disconnect: () => Promise<void>;
        isConnected: boolean;
      };
      ethereum?: {
        request: (args: { method: string; params?: any[] }) => Promise<any>;
        on?: (event: string, callback: (...args: any[]) => void) => void;
        removeListener?: (event: string, callback: (...args: any[]) => void) => void;
      };
    };
    starknet_argent?: any;
    starknet_braavos?: any;
  }
}

export {};
