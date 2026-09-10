import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  console.error('Unhandled Error:', err);

  if (err instanceof ZodError) {
    return res.status(422).json({
      error: 'Validation failed',
      details: err.errors,
    });
  }

  // Prisma known request errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Unique constraint violation. A record with this value already exists.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Requested record not found.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
