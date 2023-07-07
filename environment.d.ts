declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENVIRONMENT: 'dev' | 'prod';

            PROD_BOT_TOKEN: string;
            PROD_CLIENT_ID: string;
            PROD_GUILD_ID: string;
            PROD_MONGODB_URI: string;

            DEV_CLIENT_ID: string;
            DEV_GUILD_ID: string;
            DEV_MONGODB_URI: string;
            DEV_BOT_TOKEN:  string;
        }
    }
}

export {};