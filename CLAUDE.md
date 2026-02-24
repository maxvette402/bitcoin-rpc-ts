# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install              # install dependencies (axios, dotenv + typescript devDeps)
npm start                # run Bitcoin-specific client via ts-node
npm run start:client     # run generic JsonRPCClient via ts-node
npm run build            # compile TypeScript → dist/
```

## Architecture

Two TypeScript source files in [src/](src/):

**[src/rpc_client_axios_getblockchaininfo.ts](src/rpc_client_axios_getblockchaininfo.ts)** — Core layer. Exports `JsonRPCClient`, a generic class with `call<T>(method, params): Promise<T>`. Handles HTTP (axios POST), Basic Auth, JSON-RPC 2.0 envelope, and error handling. Validates that `BITCOIN_RPC_USER` and `BITCOIN_RPC_PASSWORD` are set at construction time. Also calls `dotenv.config()` at module load, so importing this file is sufficient to load env vars.

**[src/rpc_client_axios.ts](src/rpc_client_axios.ts)** — Bitcoin layer. Imports `JsonRPCClient`, creates a module-level singleton instance, and exports typed wrapper functions (`getBlockchainInfo`, `getBlockCount`, `getBestBlockHash`, `getBlock`, `getNetworkInfo`). Also exports TypeScript interfaces for the RPC response shapes (`BlockchainInfo`, `NetworkInfo`, `Block`).

The dependency is one-way: `rpc_client_axios.ts` → `rpc_client_axios_getblockchaininfo.ts`. To use just the generic client, import from the class file directly.

## Configuration

Credentials and endpoint are read from `.env` (gitignored). Copy `.env.example` to get started:

```
BITCOIN_RPC_ENDPOINT=http://127.0.0.1:8332   # mainnet default; testnet is 18332
BITCOIN_RPC_USER=
BITCOIN_RPC_PASSWORD=
```

The `JsonRPCClient` constructor also accepts `(endpoint, user, password)` as arguments for instantiating multiple clients (e.g. different networks) without touching `.env`.
