import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { config } from './config';
import { basicAuth } from './middleware/basicAuth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

// Proxy middleware setup
const authServiceProxy = createProxyMiddleware({
  target: config.services.auth,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '',
  },
});

const productServiceProxy = createProxyMiddleware({
  target: config.services.product,
  changeOrigin: true,
  pathRewrite: {
    '^/products': '',
  },
});

const cartServiceProxy = createProxyMiddleware({
  target: config.services.cart,
  changeOrigin: true,
  pathRewrite: {
    '^/cart': '',
  },
});

const orderServiceProxy = createProxyMiddleware({
  target: config.services.order,
  changeOrigin: true,
  pathRewrite: {
    '^/orders': '',
  },
});

// Routes
app.use('/auth', authServiceProxy);
app.use('/products', basicAuth, productServiceProxy);
app.use('/cart', basicAuth, cartServiceProxy);
app.use('/orders', basicAuth, orderServiceProxy);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use(errorHandler);

// Start the server
app.listen(config.port, () => {
  logger.info(`API Gateway is running on port ${config.port}`);
});

export default app;