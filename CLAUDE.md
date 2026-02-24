# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Early-stage prototype. Despite the `-ts` name, the current source files are plain JavaScript (`.js`). The intent is to migrate to TypeScript. There is no `package.json` yet — `axios` must be installed before running any script.

## Running Scripts

```bash
# Install the only dependency first (no package.json yet)
npm install axios

# Run the functional RPC client
node src/rpc_client_axios.js

# Run the class-based RPC client
node src/rpc_client_axios_getblockchaininfo.js
```

Both scripts require a running Bitcoin Core node. Default connection: `http://127.0.0.1:8332` with credentials `bitcoink:bitcoink` (hardcoded as constants at the top of each file).

## Architecture

Two parallel implementations exist in [src/](src/):

**[rpc_client_axios.js](src/rpc_client_axios.js)** — Functional style. A `makeRpcCall(method, params)` core function with Bitcoin-specific wrappers (`getBlockchainInfo`, `getBlockCount`, `getBestBlockHash`, `getBlock`, `getNetworkInfo`). Uses JSON-RPC `1.0`. Exports all functions as a module.

**[rpc_client_axios_getblockchaininfo.js](src/rpc_client_axios_getblockchaininfo.js)** — Class-based style. A generic `JsonRPCClient` class with a configurable constructor `(endpoint, user, password)` and a single `call(method, params)` method. Uses JSON-RPC `2.0` with an auto-incrementing `id`. Exports the class.

Both use Basic Auth (`Buffer.from(user:pass).toString('base64')`) and POST to the RPC endpoint with `Content-Type: application/json`.

## Connection Configuration

Change the constants at the top of each file to point to a different node:

```js
const ENDPOINT = 'http://127.0.0.1:8332'; // mainnet default; testnet is 18332
const USER = 'bitcoink';
const PASSWORD = 'bitcoink';
```

The class-based client also accepts these as constructor arguments, making it easier to instantiate for different networks without editing constants.
