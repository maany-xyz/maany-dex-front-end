# One-Click Trading API

This document provides detailed information about the one-click trading API endpoints in the Osmosis DEX frontend application.

## Overview

The One-Click Trading API provides endpoints for managing one-click trading sessions, which allow users to perform trading operations with a single click without having to sign each transaction.

## Endpoints

### `local.oneClickTrading.getAuthenticators`

Retrieves authenticators for a specific address.

**Method:** GET

**Request Parameters:**
```typescript
{
  userOsmoAddress: string; // The Osmosis address to get authenticators for
}
```

**Response:**
```typescript
{
  authenticators: ParsedAuthenticator[]; // An array of authenticator objects
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.local.oneClickTrading.getAuthenticators.useQuery({
  userOsmoAddress: "osmo123...",
});
```

### `local.oneClickTrading.getSessionAuthenticator`

Retrieves the session authenticator for a specific address and public key.

**Method:** GET

**Request Parameters:**
```typescript
{
  userOsmoAddress: string; // The Osmosis address to get the session authenticator for
  publicKey: string; // The public key associated with the session
}
```

**Response:**
```typescript
{
  id: string; // The ID of the session authenticator
  authenticator: ParsedAuthenticator; // The authenticator object
}
```

**Example Usage:**
```typescript
const { data, isLoading } = api.local.oneClickTrading.getSessionAuthenticator.useQuery({
  userOsmoAddress: "osmo123...",
  publicKey: "base64-encoded-public-key",
});
```

## Related Hooks

### `useCreateOneClickTradingSession`

A hook that creates a one-click trading session.

**Location:** `hooks/mutations/one-click-trading/use-create-one-click-trading-session.tsx`

**Usage:**
```typescript
const mutation = useCreateOneClickTradingSession({
  onBroadcasted: () => {
    // Handle successful broadcast
  },
});

mutation.mutate({
  transaction1CTParams: {
    spendLimit: new CoinPretty(osmoDenom, "100"),
    sessionPeriod: { end: "1day" },
    networkFeeLimit: "0.1",
  },
  spendLimitTokenDecimals: 6,
});
```

**Description:**
This hook creates a one-click trading session by:
1. Generating a random private key
2. Creating an authenticator with spend limits and allowed messages
3. Sending transactions to add/remove authenticators
4. Storing session information in the account store

The session allows users to perform trading operations without having to sign each transaction, up to the specified spend limit and within the specified time period.

### `useRemoveOneClickTradingSession`

A hook that removes a one-click trading session.

**Location:** `hooks/mutations/one-click-trading/use-remove-one-click-trading-session.ts`

**Usage:**
```typescript
const mutation = useRemoveOneClickTradingSession();

mutation.mutate({
  authenticatorId: "123",
});
```

**Description:**
This hook removes a one-click trading session by:
1. Creating a message to remove the authenticator
2. Sending a transaction to remove the authenticator
3. Updating the local state to reflect the removed session
4. Displaying a toast notification to inform the user

## Session Parameters

### Spend Limit

The maximum amount that can be spent in a single session.

### Session Period

The duration of the session. Available options:
- 1 hour
- 1 day
- 7 days
- 30 days

### Allowed Messages

The types of messages that can be sent during the session:
- `/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn`
- `/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn`
- `/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut`
- `/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOut`
- `/osmosis.concentratedliquidity.v1beta1.MsgWithdrawPosition`
- `/osmosis.valsetpref.v1beta1.MsgSetValidatorSetPreference`