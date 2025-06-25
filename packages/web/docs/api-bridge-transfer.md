# Bridge Transfer API

This document provides detailed information about the bridge transfer API endpoints in the Osmosis DEX frontend application.

## Overview

The Bridge Transfer API provides endpoints for transferring assets between different blockchains using various bridge providers. It supports operations such as getting quotes, supported assets, transaction requests, and deposit addresses.

## Endpoints

### `bridgeTransfer.getQuoteByBridge`

Retrieves a quote for a bridge transfer.

**Method:** GET

**Request Parameters:**
```typescript
{
  bridge: string; // The bridge provider to use
  fromChain: {
    chainId: string;
    chainType: "evm" | "cosmos" | "bitcoin" | "solana" | "tron" | "penumbra" | "doge";
  };
  toChain: {
    chainId: string;
    chainType: "evm" | "cosmos" | "bitcoin" | "solana" | "tron" | "penumbra" | "doge";
  };
  fromAsset: {
    address: string;
    denom?: string;
    decimals: number;
    coinGeckoId?: string;
  };
  toAsset: {
    address: string;
    denom?: string;
    decimals: number;
    coinGeckoId?: string;
  };
  amount: string;
  fromAddress?: string;
  toAddress: string;
}
```

**Response:**
```typescript
{
  quote: {
    provider: {
      id: string;
      logoUrl: string;
    };
    input: {
      amount: CoinPretty;
      fiatValue: PricePretty;
      // Other properties from the request
    };
    expectedOutput: {
      amount: CoinPretty;
      fiatValue: PricePretty;
      // Other properties from the request
    };
    transferFee: {
      amount: CoinPretty;
      fiatValue?: PricePretty;
    };
    estimatedGasFee?: {
      amount: CoinPretty;
      fiatValue?: PricePretty;
    };
    totalFeeFiatValue?: PricePretty;
    // Other properties from the bridge provider
  };
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.bridgeTransfer.getQuoteByBridge.useQuery({
  bridge: "Axelar",
  fromChain: {
    chainId: "ethereum",
    chainType: "evm",
  },
  toChain: {
    chainId: "osmosis-1",
    chainType: "cosmos",
  },
  fromAsset: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC on Ethereum
    denom: "USDC",
    decimals: 6,
  },
  toAsset: {
    address: "uusdc", // USDC on Osmosis
    denom: "USDC",
    decimals: 6,
  },
  amount: "1000000", // 1 USDC (with 6 decimals)
  toAddress: "osmo123...",
});
```

### `bridgeTransfer.getSupportedAssetsByBridge`

Retrieves supported assets for a bridge provider.

**Method:** GET

**Request Parameters:**
```typescript
{
  bridge: string; // The bridge provider to use
  asset: {
    address: string;
    denom?: string;
    decimals: number;
    coinGeckoId?: string;
  };
}
```

**Response:**
```typescript
{
  supportedAssets: {
    providerName: string;
    inputAssetAddress: string;
    assetsByChainId: Record<string, {
      chainId: string;
      chainType: string;
      address: string;
      denom?: string;
      decimals: number;
      coinGeckoId?: string;
      providerName: string;
    }[]>;
    availableChains: {
      prettyName: string;
      chainName: string;
      chainId: string;
      chainType: string;
      logoUri?: string;
      color?: string;
      bech32Prefix?: string;
    }[];
  };
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.bridgeTransfer.getSupportedAssetsByBridge.useQuery({
  bridge: "Axelar",
  asset: {
    address: "uusdc",
    denom: "USDC",
    decimals: 6,
  },
});
```

### `bridgeTransfer.getTransactionRequestByBridge`

Retrieves a transaction request for a bridge transfer.

**Method:** GET

**Request Parameters:**
```typescript
{
  bridge: string; // The bridge provider to use
  // Same parameters as getQuoteByBridge
}
```

**Response:**
```typescript
{
  transactionRequest: {
    provider: {
      id: string;
      logoUrl: string;
    };
    // Transaction data from the bridge provider
  };
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.bridgeTransfer.getTransactionRequestByBridge.useQuery({
  bridge: "Axelar",
  // Same parameters as getQuoteByBridge
});
```

### `bridgeTransfer.getExternalUrls`

Retrieves external URLs for bridge transfers.

**Method:** GET

**Request Parameters:**
```typescript
{
  fromChain?: {
    chainId: string;
    chainType: string;
  };
  toChain?: {
    chainId: string;
    chainType: string;
  };
  fromAsset?: {
    address: string;
    denom?: string;
    decimals: number;
    coinGeckoId?: string;
  };
  toAsset?: {
    address: string;
    denom?: string;
    decimals: number;
    coinGeckoId?: string;
  };
  bridges?: string[]; // Optional list of bridge providers to include
}
```

**Response:**
```typescript
{
  externalUrls: {
    urlProviderName: string;
    logo: string;
    url: URL;
  }[];
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.bridgeTransfer.getExternalUrls.useQuery({
  fromChain: {
    chainId: "ethereum",
    chainType: "evm",
  },
  toChain: {
    chainId: "osmosis-1",
    chainType: "cosmos",
  },
  fromAsset: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    denom: "USDC",
    decimals: 6,
  },
  toAsset: {
    address: "uusdc",
    denom: "USDC",
    decimals: 6,
  },
  bridges: ["Axelar", "Wormhole"],
});
```

### `bridgeTransfer.getDepositAddress`

Retrieves a deposit address for a bridge transfer.

**Method:** GET

**Request Parameters:**
```typescript
{
  bridge: string; // The bridge provider to use
  toAddress: string; // The destination address
  fromChain: {
    chainId: string;
    chainType: string;
  };
  toChain: {
    chainId: string;
    chainType: string;
  };
  fromAsset: {
    address: string;
    denom?: string;
    decimals: number;
    coinGeckoId?: string;
  };
  toAsset: {
    address: string;
    denom?: string;
    decimals: number;
    coinGeckoId?: string;
  };
}
```

**Response:**
```typescript
{
  depositData: {
    depositAddress: string;
    memo?: string;
    minimumDeposit: {
      amount: CoinPretty;
      fiatValue?: PricePretty;
    };
    networkFee: {
      amount: CoinPretty;
      fiatValue?: PricePretty;
    };
    // Other properties from the bridge provider
  };
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.bridgeTransfer.getDepositAddress.useQuery({
  bridge: "Nomic",
  toAddress: "osmo123...",
  fromChain: {
    chainId: "bitcoin",
    chainType: "bitcoin",
  },
  toChain: {
    chainId: "osmosis-1",
    chainType: "cosmos",
  },
  fromAsset: {
    address: "btc",
    denom: "BTC",
    decimals: 8,
  },
  toAsset: {
    address: "factory/osmo1z6r6qdknhgsc0zeracktgpcxf43j6sekq07nw8sxduc9lg0qjjlqfu25e3/alloyed/allBTC",
    denom: "allBTC",
    decimals: 8,
  },
});
```

### `bridgeTransfer.getNomicPendingDeposits`

Retrieves pending Nomic deposits for a user.

**Method:** GET

**Request Parameters:**
```typescript
{
  userOsmoAddress: string; // The user's Osmosis address
}
```

**Response:**
```typescript
{
  pendingDeposits: {
    depositAddress: string;
    amount: CoinPretty;
    fiatValue: PricePretty;
    networkFee: {
      amount: CoinPretty;
      fiatValue?: PricePretty;
    };
    providerFee: {
      amount: CoinPretty;
      fiatValue?: PricePretty;
    };
    userOsmoAddress: string;
    // Other properties from the Nomic bridge provider
  }[];
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.bridgeTransfer.getNomicPendingDeposits.useQuery({
  userOsmoAddress: "osmo123...",
});
```

## Related Utilities

### Bridge Logo URLs

The application provides logo URLs for various bridge providers.

**Location:** `utils/bridge.ts`

```typescript
export const BridgeLogoUrls: Record<Bridge, string> = {
  Skip: "/bridges/skip.png",
  Squid: "/bridges/squid.svg",
  Axelar: "/bridges/axelar.svg",
  IBC: "/bridges/ibc.svg",
  Nomic: "/bridges/nomic.svg",
  Wormhole: "/bridges/wormhole.svg",
  Nitro: "/bridges/nitro.svg",
  Picasso: "/bridges/picasso.svg",
  Penumbra: "/networks/penumbra.svg",
  Int3face: "/bridges/int3face.svg",
};
```