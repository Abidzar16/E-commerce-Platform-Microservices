export const config = {
 port: process.env.PORT || 3000,
 nodeEnv: process.env.NODE_ENV || 'development',
 logLevel: process.env.LOG_LEVEL || 'info',
 services: {
   auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
   product: process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002',
   cart: process.env.CART_SERVICE_URL || 'http://cart-service:3003',
   order: process.env.ORDER_SERVICE_URL || 'http://order-service:3004',
 },
};