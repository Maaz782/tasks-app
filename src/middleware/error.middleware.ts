import { Request, Response, NextFunction } from 'express';

export class ErrorHandler {
  public handleError(err: any, req: Request, res: Response, next: NextFunction): void {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
      message: err.message || 'Internal Server Error',
    });
    next();
  }
}
