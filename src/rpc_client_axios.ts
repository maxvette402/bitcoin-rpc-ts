import { JsonRPCClient } from './rpc_client_axios_getblockchaininfo';

// Types for common Bitcoin Core RPC responses
export interface BlockchainInfo {
    chain: string;
    blocks: number;
    headers: number;
    bestblockhash: string;
    difficulty: number;
    verificationprogress: number;
    chainwork: string;
    pruned: boolean;
}

export interface NetworkInfo {
    version: number;
    subversion: string;
    protocolversion: number;
    connections: number;
    relayfee: number;
}

export interface Block {
    hash: string;
    height: number;
    time: number;
    tx: string[];
    nTx: number;
    difficulty: number;
}

const client = new JsonRPCClient();

export async function getBlockchainInfo(): Promise<BlockchainInfo> {
    return client.call<BlockchainInfo>('getblockchaininfo');
}

export async function getBlockCount(): Promise<number> {
    return client.call<number>('getblockcount');
}

export async function getBestBlockHash(): Promise<string> {
    return client.call<string>('getbestblockhash');
}

export async function getBlock(blockhash: string, verbosity = 1): Promise<Block> {
    return client.call<Block>('getblock', [blockhash, verbosity]);
}

export async function getNetworkInfo(): Promise<NetworkInfo> {
    return client.call<NetworkInfo>('getnetworkinfo');
}

async function main(): Promise<void> {
    console.log('='.repeat(60));
    console.log('BITCOIN CORE RPC CLIENT (Node.js/Axios)');
    console.log('='.repeat(60));
    console.log(`Endpoint: ${process.env.BITCOIN_RPC_ENDPOINT ?? 'http://127.0.0.1:8332'}`);
    console.log(`User: ${process.env.BITCOIN_RPC_USER}`);
    console.log('='.repeat(60));
    console.log('');

    try {
        console.log('TEST 1: Getting blockchain info...');
        const blockchainInfo = await getBlockchainInfo();
        console.log('');
        console.log('SUCCESS! Key blockchain information:');
        console.log(`  Chain: ${blockchainInfo.chain}`);
        console.log(`  Blocks: ${blockchainInfo.blocks}`);
        console.log(`  Best Block Hash: ${blockchainInfo.bestblockhash}`);
        console.log(`  Difficulty: ${blockchainInfo.difficulty}`);
        console.log(`  Verification Progress: ${(blockchainInfo.verificationprogress * 100).toFixed(2)}%`);
        console.log('');

        console.log('TEST 2: Getting block count...');
        const blockCount = await getBlockCount();
        console.log(`✓ Current block count: ${blockCount}`);
        console.log('');

        console.log('TEST 3: Getting best block hash...');
        const bestHash = await getBestBlockHash();
        console.log(`✓ Best block hash: ${bestHash}`);
        console.log('');

        console.log('='.repeat(60));
        console.log('✓ ALL TESTS PASSED! Bitcoin RPC client is working correctly.');
        console.log('='.repeat(60));
    } catch {
        console.log('');
        console.log('='.repeat(60));
        console.log('❌ TEST FAILED');
        console.log('='.repeat(60));
        console.log('Please check the error messages above for troubleshooting.');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
