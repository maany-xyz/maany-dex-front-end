# Assets API

This document provides detailed information about the asset-related API endpoints in the Osmosis DEX frontend application.

## Overview

The Assets API provides endpoints for retrieving information about assets, including prices, balances, and metadata.

## Endpoints

### `edge.assets.getAssetPrice`

Retrieves the price of an asset.

**Method:** GET

**Request Parameters:**
```typescript
{
  coinMinimalDenom: string; // The minimal denomination of the coin (e.g., "uosmo")
}
```

**Response:**
```typescript
PricePretty | undefined // A price object or undefined if the price is not available
```

**Example Usage:**
```typescript
const { data: price, isLoading } = api.edge.assets.getAssetPrice.useQuery({
  coinMinimalDenom: "uosmo",
}, {
  enabled: Boolean(currency) && !currency?.coinMinimalDenom.startsWith("gamm"),
  cacheTime: 1000 * 3, // 3 seconds
  staleTime: 1000 * 3, // 3 seconds
});
```

**Notes:**
- The query is enabled only when the currency exists and doesn't start with "gamm"
- The cache time and stale time are set to 3 seconds to ensure fresh price data
- This endpoint is used by the `usePrice` hook in `hooks/queries/assets/use-price.ts`

### `edge.assets.getAssets`

Retrieves a list of assets.

**Method:** GET

**Request Parameters:** None

**Response:**
```typescript
{
  assets: Asset[]; // An array of asset objects
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.assets.getAssets.useQuery();
```

### `edge.assets.getAssetBalances`

Retrieves the balances of assets for a specific address.

**Method:** GET

**Request Parameters:**
```typescript
{
  address: string; // The address to get balances for
  chainId?: string; // Optional chain ID to filter by
}
```

**Response:**
```typescript
{
  balances: {
    amount: string;
    denom: string;
  }[];
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.assets.getAssetBalances.useQuery({
  address: "osmo123...",
  chainId: "osmosis-1",
});
```

## Related Hooks

### `usePrice`

A hook that fetches the price of a currency.

**Location:** `hooks/queries/assets/use-price.ts`

**Usage:**
```typescript
const { price, isLoading } = usePrice(currency);
```

### `useCoinFiatValue`

A hook that calculates the fiat value of a coin based on its price.

**Location:** `hooks/queries/assets/use-coin-fiat-value.ts`

**Usage:**
```typescript
const { fiatValue, isLoading } = useCoinFiatValue(coin, vsCurrency);
```