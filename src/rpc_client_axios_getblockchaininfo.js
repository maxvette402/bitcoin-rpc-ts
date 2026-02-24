const axios = require('axios');
require('dotenv').config();

// Configuration Constants
const ENDPOINT = process.env.BITCOIN_RPC_ENDPOINT || 'http://127.0.0.1:8332';
const USER = process.env.BITCOIN_RPC_USER;
const PASSWORD = process.env.BITCOIN_RPC_PASSWORD;

class JsonRPCClient {
    constructor(endpoint = ENDPOINT, user = USER, password = PASSWORD) {
        this.endpoint = endpoint;
        this.user = user;
        this.password = password;
        this.id = 0;
    }

    async call(method, params = []) {
        this.id++;

        // Prepare the JSON-RPC request body
        const requestBody = {
            'jsonrpc': '2.0',
            'id': this.id,
            'method': method,
            'params': params
        };

        // Prepare Basic Authentication
        const authentication = Buffer.from(`${this.user}:${this.password}`).toString('base64');
        
        // Prepare headers
        const headers = {
            'Authorization': `Basic ${authentication}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        console.log(`Making RPC Call to: '${this.endpoint}'`);
        console.log(`Method: '${method}'`);
        if (params.length > 0) {
            console.log(`Params: ${JSON.stringify(params)}`);
        }
        console.log('---'.repeat(20));

        try {
            const response = await axios.post(this.endpoint, requestBody, { headers });
            
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
                console.error('❌ HTTP Error Response:');
                console.error(`   Status: ${error.response.status}`);
                console.error(`   Status Text: ${error.response.statusText}`);
                console.error(`   Data:`, error.response.data);
                
                if (error.response.status === 401) {
                    console.error('\n💡 Authentication failed. Check your USER and PASSWORD constants.');
                }
            } else if (error.request) {
                console.error('❌ No response received from RPC server.');
                console.error('💡 Is the service running? Check the endpoint:', this.endpoint);
            } else {
                console.error('❌ Error:', error.message);
            }
            
            throw error;
        }
    }
}

// Main function
async function main() {
    console.log('='.repeat(60));
    console.log('GENERIC JSON-RPC CLIENT (Node.js/Axios)');
    console.log('='.repeat(60));
    console.log(`Endpoint: ${ENDPOINT}`);
    console.log(`User: ${USER}`);
    console.log('='.repeat(60));
    console.log('');
    
    try {
        const client = new JsonRPCClient();
        
        // Example RPC call - change method name as needed
        console.log('Making RPC call...');
        const result = await client.call('getblockchaininfo');
        console.log('');
        console.log('SUCCESS! RPC call completed.');
        console.log('');
        
        console.log('='.repeat(60));
        console.log('✓ RPC client is working correctly.');
        console.log('='.repeat(60));
        
    } catch (error) {
        console.log('');
        console.log('='.repeat(60));
        console.log('❌ RPC CALL FAILED');
        console.log('='.repeat(60));
        console.log('Please check the error messages above for troubleshooting.');
        process.exit(1);
    }
}

// Export the client class
module.exports = JsonRPCClient;

// Run main if executed directly
if (require.main === module) {
    main();
}