import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

interface JwtPayload {
  id: string;
  role: string;
}

export class AuthMiddleware {
  public protect(req: AuthRequest, res: Response, next: NextFunction): void {
    let token = '';

    console.log('Headers:', req.headers);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error: any = new Error('Not authorized, no token');
      error.statusCode = 401;
      throw error;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      throw error;
    }
  }

  public adminOnly(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
      
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        const err: any = new Error('Not authorized as an admin');
        err.statusCode = 403;
        throw err;
      }
    } catch (error) {
      throw error;
    }
  }
}
