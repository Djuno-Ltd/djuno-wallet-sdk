import { Client, CreateWalletBody, UpdateWalletBody } from './wallet-sdk.js';

describe('Wallet SDK', () => {
  let client: Client;
  let walletId: string | undefined;

  beforeEach(() => {
    client = new Client({ accessKey: process.env.WalletApiAccess });
  });

  it('should fetch networks', async () => {
    const result = await client.networks();

    expect(result.status).toBe(true);
    expect(result.message).toBe('SUCCESS');
  });

  it('should create a wallet', async () => {
    const requestBody: CreateWalletBody = {
      NetworkId: 1,
      Name: 'My Wallet',
      UserId: 'user-123',
    };

    const result = await client.createWallet(requestBody);

    expect(result.status).toBe(true);
    expect(result.message).toBe('SUCCESS');

    // Store the wallet ID for use in subsequent tests
    if (result.data) {
      walletId = result.data.Id; // Assuming result.data contains the wallet object
      expect(walletId).toBeDefined(); // Ensure walletId was returned
    } else {
      fail('result.data is null');
    }
  });

  it('should update a wallet', async () => {
    const updateBody: UpdateWalletBody = {
      Name: 'Updated Wallet',
      UserId: 'user-123',
    };

    // Ensure walletId is set before attempting to update
    expect(walletId).toBeDefined();

    console.log({ walletId });

    const result = await client.updateWallet(walletId as string, updateBody);
    console.log({ result });
    expect(result.status).toBe(true);
    expect(result.message).toBe('SUCCESS');
  });

  it('should fetch a wallet by ID', async () => {
    // Ensure walletId is set before attempting to fetch the wallet
    expect(walletId).toBeDefined();

    const result = await client.getWallet(walletId as string);

    expect(result.status).toBe(true);
    expect(result.message).toBe('SUCCESS');
  });
});
