import {
  Client,
  ClientConfigs,
  Network,
  Wallet,
  CreateWalletBody,
  UpdateWalletBody,
} from '@djuno/wallet-sdk';
import React, { createContext, useContext, useState, useCallback } from 'react';

// Define the shape of the WalletContext
interface WalletContextType {
  client: Client;
  loading: Record<string, boolean>; // Tracks loading state for different operations
  networks: Network[]; // List of available networks
  wallets: Wallet[]; // List of wallets
  getNetworks: () => Promise<Network[]>; // Fetch available networks
  createWallet: (data: CreateWalletBody) => Promise<Wallet | null>; // Create a new wallet
  updateWallet: (id: string, data: UpdateWalletBody) => Promise<Wallet | null>; // Update an existing wallet
  getWallet: (id: string) => Promise<Wallet | null>; // Retrieve a wallet by ID
  deleteWallet: (id: string) => Promise<boolean>; // Delete a wallet by ID
  setAccessKey: (newAccessKey: string) => void; // Update the access key for API requests
}

// Create a React context for managing wallet-related state
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// WalletProvider component that manages the wallet state and API interactions
export const WalletProvider: React.FC<
  React.PropsWithChildren<{ clientConfigs: ClientConfigs }>
> = ({ children, clientConfigs }) => {
  // Initialize the wallet SDK client with provided configurations
  const client = React.useMemo(
    () => new Client(clientConfigs),
    [clientConfigs]
  );

  // State variables
  const [loading, setLoading] = useState<Record<string, boolean>>({}); // Loading state for API requests
  const [networks, setNetworks] = useState<Network[]>([]); // List of available networks
  const [wallets, setWallets] = useState<Wallet[]>([]); // List of user wallets

  // Utility function to handle loading state and errors for async operations
  const withLoading = useCallback(
    async (key: string, fn: () => Promise<any>) => {
      setLoading((prev) => ({ ...prev, [key]: true }));
      try {
        return await fn();
      } catch (error) {
        console.error(`Error in ${key}:`, error);
        return null; // Return null to avoid breaking the app
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    []
  );

  // Fetch available networks
  const getNetworks = useCallback(async (): Promise<Network[]> => {
    return await withLoading('networks', async () => {
      const response = await client.networks();
      const networks = response.data || [];
      if (response.status) setNetworks(networks);
      return networks;
    });
  }, [client, withLoading]);

  // Create a new wallet
  const createWallet = useCallback(
    async (data: CreateWalletBody): Promise<Wallet | null> => {
      return withLoading('createWallet', async () => {
        const response = await client.createWallet(data);
        const wallet = response.data;
        if (response.status && wallet) setWallets((prev) => [...prev, wallet]);
        return wallet;
      });
    },
    [client, withLoading]
  );

  // Update an existing wallet by ID
  const updateWallet = useCallback(
    async (id: string, data: UpdateWalletBody): Promise<Wallet | null> => {
      return withLoading('updateWallet', async () => {
        const response = await client.updateWallet(id, data);
        const wallet = response.data;
        if (response.status && wallet) {
          setWallets((prev) => prev.map((w) => (w.Id === id ? wallet : w)));
        }
        return wallet;
      });
    },
    [client, withLoading]
  );

  // Retrieve wallet details by ID
  const getWallet = useCallback(
    async (id: string): Promise<Wallet | null> => {
      return withLoading('getWallet', async () => {
        const response = await client.getWallet(id);
        const wallet = response.data;
        return wallet;
      });
    },
    [client, withLoading]
  );

  // Delete a wallet by ID
  const deleteWallet = useCallback(
    async (id: string): Promise<boolean> => {
      return withLoading('deleteWallet', async () => {
        const response = await client.deleteWallet(id);
        if (response.status)
          setWallets((prev) => prev.filter((w) => w.Id !== id));
        return response.status;
      });
    },
    [client, withLoading]
  );

  // Update the access key for API requests
  const setAccessKey = useCallback(
    (newAccessKey: string) => {
      client.setAccessKey(newAccessKey);
    },
    [client]
  );

  return (
    <WalletContext.Provider
      value={{
        client,
        loading,
        networks,
        wallets,
        getNetworks,
        createWallet,
        updateWallet,
        getWallet,
        deleteWallet,
        setAccessKey,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to access the wallet context
export const useWallet = () => {
  if (typeof Client === 'undefined') {
    console.warn(
      'The @djuno/wallet-sdk is not installed. Please run "npm install @djuno/wallet-sdk" to install it.'
    );
  }
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletProvider;
