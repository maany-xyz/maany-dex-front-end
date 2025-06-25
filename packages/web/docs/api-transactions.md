# Transactions API

This document provides detailed information about the transaction-related API endpoints in the Osmosis DEX frontend application.

## Overview

The Transactions API provides endpoints for retrieving information about transactions, including transaction history and transaction details.

## Endpoints

### `edge.transactions.getTransactionHistory`

Retrieves transaction history for a specific address.

**Method:** GET

**Request Parameters:**
```typescript
{
  address: string; // The address to get transaction history for
  chainId?: string; // Optional chain ID to filter transactions by
  limit?: number; // Optional limit on the number of transactions to return
  offset?: number; // Optional offset for pagination
}
```

**Response:**
```typescript
{
  transactions: {
    hash: string;
    height: number;
    timestamp: string;
    gasUsed: number;
    gasWanted: number;
    success: boolean;
    messages: {
      typeUrl: string;
      value: any;
    }[];
    memo: string;
    fee: {
      amount: {
        denom: string;
        amount: string;
      }[];
      gasLimit: number;
      payer: string;
      granter: string;
    };
  }[];
  total: number;
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.transactions.getTransactionHistory.useQuery({
  address: "osmo123...",
  chainId: "osmosis-1",
  limit: 10,
  offset: 0,
});
```

### `edge.transactions.getTransaction`

Retrieves details for a specific transaction.

**Method:** GET

**Request Parameters:**
```typescript
{
  hash: string; // The hash of the transaction to retrieve
  chainId?: string; // Optional chain ID
}
```

**Response:**
```typescript
{
  transaction: {
    hash: string;
    height: number;
    timestamp: string;
    gasUsed: number;
    gasWanted: number;
    success: boolean;
    messages: {
      typeUrl: string;
      value: any;
    }[];
    memo: string;
    fee: {
      amount: {
        denom: string;
        amount: string;
      }[];
      gasLimit: number;
      payer: string;
      granter: string;
    };
    events: {
      type: string;
      attributes: {
        key: string;
        value: string;
      }[];
    }[];
  } | null;
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.edge.transactions.getTransaction.useQuery({
  hash: "0x123...",
  chainId: "osmosis-1",
});
```

### `edge.transactions.estimateGas`

Estimates the gas required for a transaction.

**Method:** POST

**Request Parameters:**
```typescript
{
  messages: {
    typeUrl: string;
    value: any;
  }[]; // The messages to include in the transaction
  memo?: string; // Optional memo to include in the transaction
  chainId?: string; // Optional chain ID
}
```

**Response:**
```typescript
{
  gasEstimate: number; // The estimated gas required for the transaction
}
```

**Example Usage:**
```typescript
const mutation = api.edge.transactions.estimateGas.useMutation();
mutation.mutate({
  messages: [
    {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: "osmo123...",
        toAddress: "osmo456...",
        amount: [
          {
            denom: "uosmo",
            amount: "1000000",
          },
        ],
      },
    },
  ],
  memo: "Test transaction",
  chainId: "osmosis-1",
});
```

## Related Hooks

### `useTransactionHistory`

A hook that fetches transaction history for an address.

**Location:** `hooks/use-transaction-history.ts`

**Usage:**
```typescript
const { data, isLoading } = useTransactionHistory({
  address: "osmo123...",
  chainId: "osmosis-1",
});
```