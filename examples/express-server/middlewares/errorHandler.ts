import { Request, Response } from 'express';

/**
 * Centralized error handler middleware
 */
export function errorHandler(err: unknown, req: Request, res: Response) {
  if (err instanceof Error) {
    console.error(err);
    res.status((err as unknown as { status?: number }).status || 500).json({
      error: err.message || 'Internal Server Error',
      code: (err as unknown as { code?: string }).code || undefined,
    });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 