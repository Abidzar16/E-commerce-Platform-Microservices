import { NextFunction, Request, Response } from 'express';

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const [type, credentials] = authHeader.split(' ');

  if (type !== 'Basic' || !credentials) {
    return res.status(401).json({ message: 'Invalid authorization header' });
  }

  // In a real-world scenario, you would validate the credentials against a database
  // For now, we'll just check if they're not empty
  if (credentials.length > 0) {
    next();
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};