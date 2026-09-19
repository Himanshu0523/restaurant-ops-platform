

export default () => ({
    port: parseInt(process.env.PORT ?? '3000' , 10),
    env: process.env.NODE_env ?? 'development',

    mongo: {
        url: process.env.MONGODB_URL ?? '',
    },

    jwt: {
        secret: process.env.JWT_SECRET ?? '',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    },

    redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379' , 10),
        password: process.env.REDIS_PASSWORD ?? '',
    },

    email: {
        host: process.env.EMAIL_HOST ?? '',
        port: parseInt(process.env.EMAIL_PORT ?? '587' , 10),
        user: process.env.EMAIL_USER ?? '',
        pass: process.env.EMAIL_PASS ?? '',
    },

    frontend: {
        url : process.env.FRONTEND_URL ?? 'http://localhost:3001',
    },
});