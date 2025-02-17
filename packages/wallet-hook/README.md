# Djuno Wallet SDK React Provider

A React Context provider for the [Djuno Wallet SDK](./../wallet-sdk/README.md), designed to simplify wallet management and API interaction in React applications. This provider allows you to easily access wallet data, create, update, delete wallets, and interact with supported blockchain networks.

## Features

- **Context Provider** for easy integration with React components
- **State Management** for wallet and network data
- **Loading State** to track ongoing operations
- **API Interaction** for creating, updating, retrieving, and deleting wallets
- **Access Key Management** for secure API requests

## Installation

First, install the Djuno Wallet SDK via npm or yarn:

```sh
npm install @djuno/wallet-sdk
```

or

```sh
yarn add @djuno/wallet-sdk
```

Next, install the React provider in your project:

```sh
npm install @djuno/wallet-provider
```

or

```sh
yarn add @djuno/wallet-provider
```

## Usage

### 1. Wrap Your Application with the WalletProvider

In your app entry point, wrap your application with the `WalletProvider` to make the wallet context available throughout your app.

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { WalletProvider } from '@djuno/wallet-provider';

const clientConfigs = {
  endpointUrl: 'https://wallets.djuno.cloud',
  accessKey: 'your-access-key',
};

ReactDOM.render(
  <WalletProvider clientConfigs={clientConfigs}>
    <App />
  </WalletProvider>,
  document.getElementById('root')
);
```

To create a wallet access key, visit the [Djuno Panel](https://djuno.io/wallet-api/api-keys).

### 2. Use the WalletContext in Your Components

To access wallet-related data and methods in your components, use the `useWallet` hook.

#### Example: Fetching Networks

```tsx
import React, { useEffect } from 'react';
import { useWallet } from '@djuno/wallet-provider';

const NetworkList: React.FC = () => {
  const { getNetworks, networks, loading } = useWallet();

  useEffect(() => {
    getNetworks();
  }, [getNetworks]);

  if (loading.networks) {
    return <div>Loading networks...</div>;
  }

  return (
    <div>
      <h2>Available Networks</h2>
      <ul>
        {networks.map((network) => (
          <li key={network.Id}>{network.Name}</li>
        ))}
      </ul>
    </div>
  );
};

export default NetworkList;
```

#### Example: Creating a Wallet

```tsx
import React, { useState } from 'react';
import { useWallet } from '@djuno/wallet-provider';

const CreateWalletForm: React.FC = () => {
  const { createWallet, loading } = useWallet();
  const [walletName, setWalletName] = useState('');
  const [networkId, setNetworkId] = useState(1); // Replace with a valid network ID

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const walletData = {
      NetworkId: networkId,
      Name: walletName,
      UserId: 'user-123',
    };
    const newWallet = await createWallet(walletData);
    if (newWallet) {
      console.log('Wallet Created:', newWallet);
    } else {
      console.error('Error creating wallet');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Wallet Name:
          <input
            type="text"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" disabled={loading.createWallet}>
        {loading.createWallet ? 'Creating Wallet...' : 'Create Wallet'}
      </button>
    </form>
  );
};

export default CreateWalletForm;
```

### Available Methods

The following methods are available through the `useWallet` hook:

- **getNetworks**: Fetches the available blockchain networks.
- **createWallet**: Creates a new wallet with the provided data.
- **updateWallet**: Updates an existing wallet by ID.
- **getWallet**: Retrieves wallet details by ID.
- **deleteWallet**: Deletes a wallet by ID.
- **setAccessKey**: Updates the API access key.

### Accessing State

- **networks**: A list of supported blockchain networks.
- **wallets**: A list of the user's wallets.
- **loading**: An object that tracks the loading state of various operations (`networks`, `createWallet`, etc.).

### Error Handling

If an operation fails, the respective method will log the error in the console and return `null` for operations that require data. Ensure to implement proper error handling in your UI (e.g., displaying user-friendly messages).

### Example: Updating Wallet

```tsx
import React, { useState } from 'react';
import { useWallet } from '@djuno/wallet-provider';

const UpdateWalletForm: React.FC = () => {
  const { updateWallet, loading } = useWallet();
  const [walletName, setWalletName] = useState('');
  const [walletId, setWalletId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateData = { Name: walletName, UserId: 'user-123' };
    const updatedWallet = await updateWallet(walletId, updateData);
    if (updatedWallet) {
      console.log('Wallet Updated:', updatedWallet);
    } else {
      console.error('Error updating wallet');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Wallet ID:
          <input
            type="text"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Wallet Name:
          <input
            type="text"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" disabled={loading.updateWallet}>
        {loading.updateWallet ? 'Updating Wallet...' : 'Update Wallet'}
      </button>
    </form>
  );
};

export default UpdateWalletForm;
```

Here's the updated configuration section with the detailed `ClientConfigs` type:

---

## Configuration

The `WalletProvider` accepts the following configuration:

| Option        | Type                                | Description                                                                                        |
| ------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| `endpointUrl` | `string` (optional)                 | The API endpoint URL for the wallet service (defaults to `https://wallets.djuno.cloud`).           |
| `accessKey`   | `string` (optional)                 | The access key used for authenticating API requests.                                               |
| `version`     | `string` (optional)                 | The version of the API to interact with (optional).                                                |
| `headers`     | `Record<string, string>` (optional) | Custom headers to include in API requests. Use this to set authentication tokens or other headers. |

### Example Client Config

```ts
const clientConfigs: ClientConfigs = {
  endpointUrl: 'https://wallets.djuno.cloud',
  accessKey: 'your-access-key',
  version: 'v1',
  headers: {
    'Custom-Header': 'value',
  },
};
```

## License

MIT License. See [LICENSE](LICENSE) for details.
