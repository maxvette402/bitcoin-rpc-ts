# bitcoin-rpc-ts
Bitcoin Core JSON-RPC client for Node.js.

## Prerequisites

A running Bitcoin Core node with RPC enabled. Default connection: `http://127.0.0.1:8332`. Edit the constants at the top of the source file to match your node's credentials.

## Install

```bash
npm install
```

## Run

```bash
# Start RPC Axios Client
node src/rpc_client_axios.js

# Get Bitcoin Blockchain Info
node src/rpc_client_axios_getblockchaininfo.js
```
