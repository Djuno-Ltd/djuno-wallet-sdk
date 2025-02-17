# Djuno Wallet SDK

A TypeScript SDK from [Djuno](https://www.djuno.io/) that provides an easy way for developers to interact with Djuno's wallet API.

## Features

- Fetch available blockchain networks
- Create and manage wallets
- Secure authentication via API key
- Built-in error handling

## Installation

The SDK requires **Node.js v16 or higher**.

Install via npm:

```sh
npm install @djuno/wallet-sdk
```

Or using yarn:

```sh
yarn add @djuno/wallet-sdk
```

## Usage

### Initialize the Client

```ts
import { Client } from '@djuno/wallet-sdk';

const client = new Client({
  endpointUrl: 'https://wallets.djuno.cloud',
  accessKey: 'your-access-key',
});
```

To create a wallet access key, visit the [Djuno Panel](https://djuno.io/wallet-api/api-keys).

### Fetch Available Networks

Retrieve a list of supported blockchain networks:

```ts
client.networks().then((response) => {
  if (response.status) {
    console.log('Networks:', response.data);
  } else {
    console.error('Error:', response.message);
  }
});
```

### Create a Wallet

```ts
const walletData = {
  NetworkId: 1, // Replace with a valid network ID
  Name: 'MyWallet',
  UserId: 'user-123',
};

client.createWallet(walletData).then((response) => {
  if (response.status) {
    console.log('Wallet Created:', response.data);
  } else {
    console.error('Error:', response.message);
  }
});
```

### Retrieve a Wallet

```ts
client.getWallet('wallet-id').then((response) => {
  if (response.status) {
    console.log('Wallet Details:', response.data);
  } else {
    console.error('Error:', response.message);
  }
});
```

### Update a Wallet

```ts
const updateData = {
  Name: 'UpdatedWalletName',
  UserId: 'user-123',
};

client.updateWallet('wallet-id', updateData).then((response) => {
  if (response.status) {
    console.log('Wallet Updated:', response.data);
  } else {
    console.error('Error:', response.message);
  }
});
```

## Configuration

The `Client` constructor accepts the following configuration options:

| Option        | Type                     | Description                                                            |
| ------------- | ------------------------ | ---------------------------------------------------------------------- |
| `endpointUrl` | `string`                 | The base URL of the wallet API. Default: `https://wallets.djuno.cloud` |
| `accessKey`   | `string`                 | Required API key for authentication.                                   |
| `version`     | `string`                 | API version. Default: `v1`                                             |
| `headers`     | `Record<string, string>` | Optional headers to include in requests.                               |

## Error Handling

All methods return a `GeneralResult<T>` object with the following structure:

```ts
interface GeneralResult<T> {
  status: boolean; // true if successful, false otherwise
  message: string; // Response message or error description
  data: T | null; // Response data if successful, otherwise null
}
```

If an API request fails, the `message` field will contain the error details.

## License

MIT License. See [LICENSE](LICENSE) for details.
