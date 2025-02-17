import axios, { AxiosInstance } from 'axios';

type ClientConfigs = {
  endpointUrl?: string;
  accessKey?: string;
  version?: string;
  headers?: Record<string, string>;
};

interface GeneralResult<T> {
  status: boolean;
  message: string;
  data: null | T;
}

type Network = {
  Id: number;
  NetworkName: string;
  NetworkCode: string;
};

type Wallet = {
  Id: string;
  Network: string;
  Status: 'Active';
  Name: string;
  Address: string;
  PrivateKey: string | null;
  Seed: string | null;
  DateCreated: string;
  SigningKey: {
    Curve: string; //'secp256k1'
    Scheme: string; //'ECDSA'
    PublicKey: string;
  };
};

type CreateWalletBody = {
  NetworkId: number;
  Name: string;
  UserId: string;
  Tags?: string[];
};

type UpdateWalletBody = {
  Name: string;
  UserId: string;
};

const initClientOptions: ClientConfigs = {
  endpointUrl: 'https://wallets.djuno.cloud',
  version: 'v1',
};

class Client {
  private httpClient: AxiosInstance;
  private readonly basePath = '';

  constructor(configs: ClientConfigs = {}) {
    const { endpointUrl, version, accessKey, headers } = {
      ...initClientOptions,
      ...configs,
    };

    if (!accessKey) {
      throw new Error('Access Key is required');
    }

    this.httpClient = axios.create({
      baseURL: endpointUrl + '/' + version,
      headers: {
        'x-api-key': accessKey,
        ...headers,
      },
    });
  }

  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        status: false,
        message: error.response?.data?.message || error.message,
        data: null,
      };
    }
    return {
      status: false,
      message: 'An unknown error occurred',
      data: null,
    };
  }

  setAccessKey(newAccessKey: string) {
    this.httpClient.defaults.headers['x-api-key'] = newAccessKey;
  }

  networks = async (): Promise<GeneralResult<Network[]>> => {
    try {
      const response = await this.httpClient.get(this.basePath + '/networks');
      return {
        data: response.data.Result,
        status: true,
        message: response.data.Message,
      };
    } catch (error) {
      return this.handleError(error);
    }
  };

  createWallet = async (
    data: CreateWalletBody
  ): Promise<GeneralResult<Wallet>> => {
    try {
      const response = await this.httpClient.post(
        this.basePath + '/wallets',
        data
      );

      return {
        data: response.data.Result,
        status: true,
        message: response.data.Message,
      };
    } catch (error) {
      return this.handleError(error);
    }
  };

  updateWallet = async (
    id: string,
    data: UpdateWalletBody
  ): Promise<GeneralResult<Wallet>> => {
    try {
      const response = await this.httpClient.put(
        this.basePath + '/wallets/' + id,
        data
      );

      return {
        data: response.data.Result,
        status: true,
        message: response.data.Message,
      };
    } catch (error) {
      return this.handleError(error);
    }
  };

  getWallet = async (id: string): Promise<GeneralResult<Wallet>> => {
    try {
      const response = await this.httpClient.get(
        this.basePath + '/wallets/' + id
      );

      return {
        data: response.data.Result,
        status: true,
        message: response.data.Message,
      };
    } catch (error) {
      return this.handleError(error);
    }
  };
}

export type {
  ClientConfigs,
  GeneralResult,
  Network,
  CreateWalletBody,
  UpdateWalletBody,
  Wallet,
};
export { Client };
