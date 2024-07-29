import { Request, Response } from 'express';
import { basicAuth } from '../../middleware/basicAuth';

describe('Basic Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {}, // Initialize headers as an empty object
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() if valid credentials are provided', () => {
    mockRequest.headers = {
      authorization: 'Basic dXNlcjpwYXNzd29yZA==', // base64 encoded "user:password"
    };

    basicAuth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 401 if no authorization header is present', () => {
    basicAuth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Authorization header is missing' });
  });

  it('should return 401 if authorization header is invalid', () => {
    mockRequest.headers = {
      authorization: 'Invalid Auth',
    };

    basicAuth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid authorization header' });
  });
});