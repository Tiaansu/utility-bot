declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENVIRONMENT: 'dev' | 'prod';

            DEV_GUILD_ID: string;
            DATABASE_URL: string;
            BOT_TOKEN:  string;
        }
    }
}

export {};