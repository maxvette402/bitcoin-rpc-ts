# bitcoin-rpc-ts
Bitcoin Core JSON-RPC client for Node.js.

## Prerequisites

A running Bitcoin Core node with RPC enabled. Default connection: `http://127.0.0.1:8332`. Copy `.env.example` to `.env` and fill in your node's credentials.

## Install

```bash
npm install
```

## Run

```bash
# Bitcoin-specific client (getblockchaininfo, getblockcount, etc.)
npm start

# Generic JSON-RPC client
npm run start:client
```

## Build

```bash
npm run build        # compiles TypeScript to dist/
node dist/rpc_client_axios.js
```
