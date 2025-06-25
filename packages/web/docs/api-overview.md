# API Overview

This document provides an overview of the API endpoints used in the Osmosis DEX frontend application.

## API Structure

The application uses [tRPC](https://trpc.io/) for type-safe API calls. The API is organized into several routers:

1. **Edge Routers** - Fast, edge-optimized endpoints:
   - `edge.assets` - Asset-related operations (prices, balances, etc.)
   - `edge.pools` - Pool-related operations (liquidity, swaps, etc.)
   - `edge.staking` - Staking-related operations
   - `edge.earn` - Earning-related operations
   - `edge.transactions` - Transaction-related operations
   - `edge.orderbooks` - Orderbook-related operations
   - `edge.chains` - Chain-related operations

2. **Local Router** - Operations that can be performed locally:
   - `local.oneClickTrading` - One-click trading operations
   - `local.balances` - Balance-related operations
   - `local.quoteRouter` - Swap quote operations
   - `local.concentratedLiquidity` - Concentrated liquidity operations
   - `local.cms` - Content management operations
   - `local.bridgeTransfer` - Local bridge transfer operations
   - `local.portfolio` - Portfolio operations
   - `local.params` - Parameter operations
   - `local.orderbooks` - Local orderbook operations
   - `local.pools` - Local pool operations

3. **Node Router** - Operations requiring Node.js API (default router):
   - `bridgeTransfer` - Bridge transfer operations

## API Configuration

The API is configured in `utils/trpc.ts` with the following key features:

1. **Caching** - Query results are cached for 24 hours by default using IndexedDB storage.
2. **Serialization** - Data is serialized using SuperJSON for type-safe serialization.
3. **Router Splitting** - Requests are split between edge, local, and node routers based on the path prefix.
4. **Batch Skipping** - Batch requests are skipped to improve performance.
5. **Logging** - Request logging is enabled in development mode and for errors in production.

## API Usage

The API is accessed using the `api` object, which is created using `createTRPCNext`. Here's an example of how to use the API:

```typescript
// Query example (GET)
const { data, isLoading } = api.edge.assets.getAssetPrice.useQuery({
  coinMinimalDenom: "uosmo",
});

// Mutation example (POST/PUT)
const mutation = api.local.oneClickTrading.getAuthenticators.useMutation();
mutation.mutate({ userOsmoAddress: "osmo123..." });
```

## Authentication

Some API endpoints require authentication, which is handled by the wallet connection. The user's wallet address is used to authenticate requests.

## Error Handling

API errors are handled by the tRPC client. Errors are typed and can be handled in a type-safe way.

## Further Documentation

For detailed documentation on specific API endpoints, please refer to the following documents:

- [Assets API](./api-assets.md)
- [Pools API](./api-pools.md)
- [Staking API](./api-staking.md)
- [Transactions API](./api-transactions.md)
- [One-Click Trading API](./api-one-click-trading.md)
- [Bridge Transfer API](./api-bridge-transfer.md)
