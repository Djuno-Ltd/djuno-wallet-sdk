import { render } from '@testing-library/react';
import { ClientConfigs } from '@djuno/wallet-sdk';
import { WalletProvider, useWallet } from './wallet-hook';
import { PropsWithChildren } from 'react';

// A wrapper component to provide the WalletProvider context for the hook
const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const clientConfigs: ClientConfigs = {
    accessKey: process.env.WalletApiAccess,
  };
  return (
    <WalletProvider clientConfigs={clientConfigs}>{children}</WalletProvider>
  );
};

describe('WalletHook', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Wrapper>
        <div></div>
      </Wrapper>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should provide wallet context successfully', () => {
    const TestComponent = () => {
      const { client, networks } = useWallet();
      expect(client).toBeTruthy(); // Ensure client is available
      expect(Array.isArray(networks)).toBe(true); // Ensure networks is an array
      return null;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );
  });
});
