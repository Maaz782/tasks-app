import { Request, Response, NextFunction } from 'express';

export class LoggerMiddleware {
  public log(req: Request, res: Response, next: NextFunction): void {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  }
}
