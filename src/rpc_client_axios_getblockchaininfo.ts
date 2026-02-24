import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface RpcRequest {
    jsonrpc: '2.0';
    id: number;
    method: string;
    params: unknown[];
}

interface RpcResponse<T = unknown> {
    id: number;
    result: T | null;
    error: { code: number; message: string } | null;
}

export class JsonRPCClient {
    private endpoint: string;
    private user: string;
    private password: string;
    private id: number;

    constructor(
        endpoint = process.env.BITCOIN_RPC_ENDPOINT ?? 'http://127.0.0.1:8332',
        user = process.env.BITCOIN_RPC_USER,
        password = process.env.BITCOIN_RPC_PASSWORD,
    ) {
        if (!user || !password) {
            throw new Error(
                'Missing credentials. Set BITCOIN_RPC_USER and BITCOIN_RPC_PASSWORD in .env',
            );
        }
        this.endpoint = endpoint;
        this.user = user;
        this.password = password;
        this.id = 0;
    }

    async call<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
        this.id++;

        const requestBody: RpcRequest = {
            jsonrpc: '2.0',
            id: this.id,
            method,
            params,
        };

        const auth = Buffer.from(`${this.user}:${this.password}`).toString('base64');
        const headers = {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };

        console.log(`Making RPC Call to: '${this.endpoint}'`);
        console.log(`Method: '${method}'`);
        if (params.length > 0) {
            console.log(`Params: ${JSON.stringify(params)}`);
        }
        console.log('---'.repeat(20));

        try {
            const response = await axios.post<RpcResponse<T>>(this.endpoint, requestBody, { headers });

            console.log(`✓ Status Code: ${response.status}`);
            console.log('✓ Response Data:');
            console.log(JSON.stringify(response.data, null, 2));
            console.log('---'.repeat(20));

            if (response.data.error) {
                console.error('❌ RPC Error:', response.data.error);
                throw new Error(`RPC Error: ${JSON.stringify(response.data.error)}`);
            }

            return response.data.result as T;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('❌ HTTP Error Response:');
                console.error(`   Status: ${error.response.status}`);
                console.error(`   Status Text: ${error.response.statusText}`);
                console.error(`   Data:`, error.response.data);

                if (error.response.status === 401) {
                    console.error(
                        '\n💡 Authentication failed. Check BITCOIN_RPC_USER and BITCOIN_RPC_PASSWORD in .env',
                    );
                }
            } else if (axios.isAxiosError(error) && error.request) {
                console.error('❌ No response received from RPC server.');
                console.error('💡 Is the service running? Check the endpoint:', this.endpoint);
            } else if (error instanceof Error) {
                console.error('❌ Error:', error.message);
            }

            throw error;
        }
    }
}

async function main(): Promise<void> {
    console.log('='.repeat(60));
    console.log('GENERIC JSON-RPC CLIENT (Node.js/Axios)');
    console.log('='.repeat(60));
    console.log(`Endpoint: ${process.env.BITCOIN_RPC_ENDPOINT ?? 'http://127.0.0.1:8332'}`);
    console.log(`User: ${process.env.BITCOIN_RPC_USER}`);
    console.log('='.repeat(60));
    console.log('');

    try {
        const client = new JsonRPCClient();

        console.log('Making RPC call...');
        const result = await client.call('getblockchaininfo');
        console.log('');
        console.log('SUCCESS! RPC call completed.');
        console.log('Result:', result);
        console.log('');

        console.log('='.repeat(60));
        console.log('✓ RPC client is working correctly.');
        console.log('='.repeat(60));
    } catch {
        console.log('');
        console.log('='.repeat(60));
        console.log('❌ RPC CALL FAILED');
        console.log('='.repeat(60));
        console.log('Please check the error messages above for troubleshooting.');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
