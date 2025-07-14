import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handler middleware
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || undefined,
  });
} 