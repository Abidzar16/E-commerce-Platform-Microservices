import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import request from 'supertest';
import { basicAuth } from '../../middleware/basicAuth';
import { errorHandler } from '../../middleware/errorHandler';

jest.mock('http-proxy-middleware');

const app = express();

// Mock proxy middleware
const mockProxy = jest.fn((req, res) => {
  res.json({ message: 'Mocked response' });
});

(createProxyMiddleware as jest.Mock).mockImplementation(() => mockProxy);

// Setup routes
app.use('/products', basicAuth, mockProxy);
app.use('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.use(errorHandler);

describe('API Gateway', () => {
  it('should return 200 OK for health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  it('should return 401 for protected route without auth', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(401);
  });

  it('should proxy request for protected route with valid auth', async () => {
    const response = await request(app)
      .get('/products')
      .set('Authorization', 'Basic dXNlcjpwYXNzd29yZA==');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Mocked response' });
    expect(mockProxy).toHaveBeenCalled();
  });
});