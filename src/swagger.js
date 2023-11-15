import swaggerAutogen from 'swagger-autogen';

const userDoc = {
    info: {
        version: '1.0.0',
        title: 'TELL API Documentation',
        description: 'English learning tool',
    },
    host: 'localhost:3000',
    basePath: '/api/user',
    schemes: ['http', 'https'],
};

const adminDoc = {
    info: {
        version: '1.0.0',
        title: 'TELL API Documentation',
        description: 'English learning tool',
    },
    host: 'localhost:3000',
    basePath: '/api/admin',
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
        const responseData = errorResponse(error);
        return res.status(400).json(responseData);    }
  };
  
  runSwagger();
  





