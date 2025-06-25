# Pools API

This document provides detailed information about the pool-related API endpoints in the Osmosis DEX frontend application.

## Overview

The Pools API provides endpoints for retrieving information about liquidity pools, including pool details, liquidity, and swap operations.

## Endpoints

### `edge.pools.getPools`

Retrieves a list of all pools.

**Method:** GET

**Request Parameters:** None

**Response:**
```typescript
{
  pools: Pool[]; // An array of pool objects
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.pools.getPools.useQuery();
```

### `edge.pools.getPool`

Retrieves details for a specific pool.

**Method:** GET

**Request Parameters:**
```typescript
{
  poolId: string; // The ID of the pool to retrieve
}
```

**Response:**
```typescript
{
  pool: Pool | null; // The pool object or null if not found
}
```

**Example Usage:**
```typescript
const { data: poolData, isLoading } = api.edge.pools.getPool.useQuery({
  poolId: "1",
});
```

### `edge.pools.getConcentratedLiquidityPoolsTickLiquidity`

Retrieves tick liquidity data for concentrated liquidity pools.

**Method:** GET

**Request Parameters:**
```typescript
{
  poolId: string; // The ID of the pool to retrieve tick liquidity for
}
```

**Response:**
```typescript
{
  liquidity: {
    tick: number;
    liquidityNet: string;
    liquidityGross: string;
  }[];
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.pools.getConcentratedLiquidityPoolsTickLiquidity.useQuery({
  poolId: "1",
});
```

### `edge.pools.getConcentratedLiquidityPositions`

Retrieves concentrated liquidity positions for a specific address.

**Method:** GET

**Request Parameters:**
```typescript
{
  address: string; // The address to get positions for
}
```

**Response:**
```typescript
{
  positions: {
    id: string;
    poolId: string;
    address: string;
    lowerTick: number;
    upperTick: number;
    liquidity: string;
    joinTime: string;
  }[];
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.pools.getConcentratedLiquidityPositions.useQuery({
  address: "osmo123...",
});
```

### `edge.pools.getSwapEstimate`

Estimates the result of a swap operation.

**Method:** GET

**Request Parameters:**
```typescript
{
  tokenInDenom: string; // The denomination of the input token
  tokenOutDenom: string; // The denomination of the output token
  tokenInAmount: string; // The amount of the input token
}
```

**Response:**
```typescript
{
  tokenOutAmount: string; // The estimated amount of the output token
  spotPrice: string; // The spot price of the swap
  priceImpact: string; // The price impact of the swap
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.pools.getSwapEstimate.useQuery({
  tokenInDenom: "uosmo",
  tokenOutDenom: "uatom",
  tokenInAmount: "1000000",
});
```

## Related Components

### Concentrated Liquidity Pool Detail

The concentrated liquidity pool detail component uses several pool-related API endpoints to display pool information and allow users to interact with the pool.

**Location:** `components/pool-detail/concentrated.tsx`

**API Usage:**
- Uses `useHistoricalAndLiquidityData` hook which likely calls pool-related endpoints
- Displays pool information including assets, spread factor, and liquidity
- Allows users to add liquidity to the pool