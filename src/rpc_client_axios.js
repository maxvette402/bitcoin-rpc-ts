const axios = require('axios');

// Configuration Constants
const ENDPOINT = 'http://127.0.0.1:8332';
const USER = 'bitcoink';
const PASSWORD = 'bitcoink';

async function makeRpcCall(method, params = []) {
    // Prepare the JSON-RPC request body
    const requestBody = {
        'jsonrpc': '1.0',
        'id': 'curltest',
        'method': method,
        'params': params
    };

    // Prepare Basic Authentication
    const authentication = Buffer.from(`${USER}:${PASSWORD}`).toString('base64');
    
    // Prepare headers
    const headers = {
        'Authorization': `Basic ${authentication}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    console.log(`Making RPC Call to: '${ENDPOINT}'`);
    console.log(`Method: '${method}'`);
    console.log(`Params: ${JSON.stringify(params)}`);
    console.log('---'.repeat(20));

    try {
        // CORRECT: Pass data directly, and headers in config object
        const response = await axios.post(ENDPOINT, requestBody, { headers });
        
        console.log(`✓ Status Code: ${response.status}`);
        console.log('✓ Response Data:');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('---'.repeat(20));
        
        // Check for JSON-RPC errors
        if (response.data.error) {
            console.error('❌ RPC Error:', response.data.error);
            throw new Error(`RPC Error: ${JSON.stringify(response.data.error)}`);
        }
        
        return response.data.result;
        
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('❌ HTTP Error Response:');
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Status Text: ${error.response.statusText}`);
            console.error(`   Data:`, error.response.data);
            
            if (error.response.status === 401) {
                console.error('\n💡 Authentication failed. Check your USER and PASSWORD constants.');
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('❌ No response received from Bitcoin node.');
            console.error('💡 Is Bitcoin Core running? Check the endpoint:', ENDPOINT);
        } else {
            // Something happened in setting up the request
            console.error('❌ Error:', error.message);
        }
        
        throw error;
    }
}

// Convenience functions for common RPC methods
async function getBlockchainInfo() {
    return await makeRpcCall('getblockchaininfo');
}

async function getBlockCount() {
    return await makeRpcCall('getblockcount');
}

async function getBestBlockHash() {
    return await makeRpcCall('getbestblockhash');
}

async function getBlock(blockhash, verbosity = 1) {
    return await makeRpcCall('getblock', [blockhash, verbosity]);
}

async function getNetworkInfo() {
    return await makeRpcCall('getnetworkinfo');
}

// Main function
async function main() {
    console.log('='.repeat(60));
    console.log('BITCOIN CORE RPC CLIENT (Node.js/Axios)');
    console.log('='.repeat(60));
    console.log(`Endpoint: ${ENDPOINT}`);
    console.log(`User: ${USER}`);
    console.log('='.repeat(60));
    console.log('');
    
    try {
        // Test 1: Get blockchain info
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
        
        // Test 2: Get block count
        console.log('TEST 2: Getting block count...');
        const blockCount = await getBlockCount();
        console.log(`✓ Current block count: ${blockCount}`);
        console.log('');
        
        // Test 3: Get best block hash
        console.log('TEST 3: Getting best block hash...');
        const bestHash = await getBestBlockHash();
        console.log(`✓ Best block hash: ${bestHash}`);
        console.log('');
        
        console.log('='.repeat(60));
        console.log('✓ ALL TESTS PASSED! Bitcoin RPC client is working correctly.');
        console.log('='.repeat(60));
        
    } catch (error) {
        console.log('');
        console.log('='.repeat(60));
        console.log('❌ TEST FAILED');
        console.log('='.repeat(60));
        console.log('Please check the error messages above for troubleshooting.');
        process.exit(1);
    }
}

// Export functions for use as a module
module.exports = {
    makeRpcCall,
    getBlockchainInfo,
    getBlockCount,
    getBestBlockHash,
    getBlock,
    getNetworkInfo
};

// Run main if executed directly
if (require.main === module) {
    main();
}