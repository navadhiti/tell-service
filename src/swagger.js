import swaggerAutogen from 'swagger-autogen';
import logger from './utils/handleServerLog.js';

const userDoc = {
    info: {
        version: '1.0.0',
        title: 'TELL API Documentation',
        description: 'Technology Enabled Language Learning',
    },
    host: 'localhost:3000',
    basePath: '/api/v1/user',
    schemes: ['http', 'https'],
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'x-auth-token',
            description: 'Authentication token',
        },
    },
    security: [{ apiKeyAuth: [] }],
};

const adminDoc = {
    info: {
        version: '1.0.0',
        title: 'TELL API Documentation',
        description: 'Technology Enabled Learning Language',
    },
    host: 'localhost:3000',
    basePath: '/api/v1/admin',
    schemes: ['http', 'https'],
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'x-auth-token',
            description: 'Authentication token',
        },
    },
    security: [{ apiKeyAuth: [] }],
};

const outputFileUser = './utils/swagger-output-user.json';
const outputFileAdmin = './utils/swagger-output-admin.json';

const runSwagger = async () => {
    try {
        await swaggerAutogen()(outputFileUser, ['./users/routes.js'], userDoc);
        await swaggerAutogen()(outputFileAdmin, ['./admins/routes.js'], adminDoc);
    } catch (error) {
        logger.log('error', 'Swagger Document generate Error:', error);
    }
};

runSwagger();
