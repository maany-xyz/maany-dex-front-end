# Staking API

This document provides detailed information about the staking-related API endpoints in the Osmosis DEX frontend application.

## Overview

The Staking API provides endpoints for retrieving information about validators, delegations, and staking operations.

## Endpoints

### `edge.staking.getValidators`

Retrieves a list of validators.

**Method:** GET

**Request Parameters:**
```typescript
{
  chainId?: string; // Optional chain ID to filter validators by
}
```

**Response:**
```typescript
{
  validators: {
    operatorAddress: string;
    consensusPubkey: string;
    jailed: boolean;
    status: string;
    tokens: string;
    delegatorShares: string;
    description: {
      moniker: string;
      identity: string;
      website: string;
      securityContact: string;
      details: string;
    };
    unbondingHeight: string;
    unbondingTime: string;
    commission: {
      commissionRates: {
        rate: string;
        maxRate: string;
        maxChangeRate: string;
      };
      updateTime: string;
    };
    minSelfDelegation: string;
  }[];
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.staking.getValidators.useQuery({
  chainId: "osmosis-1",
});
```

### `edge.staking.getDelegations`

Retrieves delegations for a specific address.

**Method:** GET

**Request Parameters:**
```typescript
{
  address: string; // The address to get delegations for
  chainId?: string; // Optional chain ID to filter delegations by
}
```

**Response:**
```typescript
{
  delegations: {
    delegatorAddress: string;
    validatorAddress: string;
    shares: string;
    balance: {
      denom: string;
      amount: string;
    };
  }[];
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.staking.getDelegations.useQuery({
  address: "osmo123...",
  chainId: "osmosis-1",
});
```

### `edge.staking.getUnbondingDelegations`

Retrieves unbonding delegations for a specific address.

**Method:** GET

**Request Parameters:**
```typescript
{
  address: string; // The address to get unbonding delegations for
  chainId?: string; // Optional chain ID to filter unbonding delegations by
}
```

**Response:**
```typescript
{
  unbondingDelegations: {
    delegatorAddress: string;
    validatorAddress: string;
    entries: {
      creationHeight: string;
      completionTime: string;
      initialBalance: string;
      balance: string;
    }[];
  }[];
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.staking.getUnbondingDelegations.useQuery({
  address: "osmo123...",
  chainId: "osmosis-1",
});
```

### `edge.staking.getRewards`

Retrieves staking rewards for a specific address.

**Method:** GET

**Request Parameters:**
```typescript
{
  address: string; // The address to get rewards for
  chainId?: string; // Optional chain ID to filter rewards by
}
```

**Response:**
```typescript
{
  rewards: {
    validatorAddress: string;
    reward: {
      denom: string;
      amount: string;
    }[];
  }[];
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.staking.getRewards.useQuery({
  address: "osmo123...",
  chainId: "osmosis-1",
});
```

## Related Hooks

### `useICNSName`

A hook that fetches ICNS (Interchain Name Service) names for an address, which can be used to display human-readable names for validators.

**Location:** `hooks/queries/osmosis/use-icns-name.ts`

**Usage:**
```typescript
const { data, isLoading } = useICNSName({ address: "osmo123..." });
```