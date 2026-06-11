const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gun Store API',
      version: '1.0.0',
      description: 'Hunting & firearms e-commerce REST API',
    },
    servers: [{ url: 'http://localhost:5000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Hunting Rifle' },
            description: { type: 'string', nullable: true, example: 'Bolt-action .308' },
            price: { type: 'number', format: 'float', example: 799.99 },
            stock: { type: 'integer', example: 10 },
            imageUrl: { type: 'string', nullable: true, example: 'https://example.com/img.jpg' },
            isRestricted: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            name: { type: 'string', example: 'Hunting Rifle' },
            description: { type: 'string', example: 'Bolt-action .308' },
            price: { type: 'number', example: 799.99 },
            stock: { type: 'integer', example: 10 },
            imageUrl: { type: 'string', example: 'https://example.com/img.jpg' },
            isRestricted: { type: 'boolean', example: true },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            age: { type: 'integer', example: 30 },
            hasGunLicense: { type: 'boolean', example: false },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            orderId: { type: 'integer', example: 1 },
            productId: { type: 'integer', example: 3 },
            quantity: { type: 'integer', example: 2 },
            unitPrice: { type: 'number', format: 'float', example: 799.99 },
            Product: { $ref: '#/components/schemas/Product' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            totalPrice: { type: 'number', format: 'float', example: 1599.98 },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
              example: 'pending',
            },
            createdAt: { type: 'string', format: 'date-time' },
            OrderItems: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
