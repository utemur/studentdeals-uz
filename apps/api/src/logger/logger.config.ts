import { Params } from 'nestjs-pino';
import { Request } from 'express';
import { randomUUID } from 'crypto';

/**
 * Pino Logger Configuration
 * 
 * Features:
 * - Request-scoped logger with requestId
 * - Sensitive field masking (passwords, tokens, etc.)
 * - Environment-based log level
 * - Pretty printing in development
 * - Structured JSON logs in production
 * - Integration with Sentry
 */

const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

/**
 * Fields to redact from logs (sensitive data)
 */
const redactPaths = [
  // Request body
  'req.body.password',
  'req.body.passwordHash',
  'req.body.token',
  'req.body.accessToken',
  'req.body.refreshToken',
  'req.body.secret',
  'req.body.apiKey',
  'req.body.apiSecret',
  
  // Request headers
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-api-key"]',
  'req.headers["x-auth-token"]',
  
  // Response body (less common, but useful)
  'res.body.password',
  'res.body.passwordHash',
  'res.body.token',
  'res.body.accessToken',
  'res.body.refreshToken',
  
  // Custom fields
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  'apiSecret',
  'creditCard',
  'ssn',
];

/**
 * Custom serializers for specific objects
 */
const serializers = {
  req: (req: Request) => ({
    id: req.id,
    method: req.method,
    url: req.url,
    query: req.query,
    params: req.params,
    // Don't log full body, just indicate if it exists
    hasBody: !!req.body && Object.keys(req.body).length > 0,
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
  }),
  res: (res: any) => ({
    statusCode: res.statusCode,
  }),
  err: (err: Error) => ({
    type: err.name,
    message: err.message,
    stack: isDevelopment ? err.stack : undefined,
  }),
};

/**
 * Generate a unique request ID
 */
function genReqId(req: any): string {
  // Use existing request ID from header (from load balancer, proxy, etc.)
  const existingId = req.headers?.['x-request-id'] as string;
  if (existingId) {
    return existingId;
  }
  
  // Generate new UUID
  return randomUUID();
}

/**
 * Pino configuration for NestJS
 */
export const pinoConfig: Params = {
  pinoHttp: {
    level: logLevel,
    
    // Use pretty printing in development
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'HH:MM:ss.l',
            ignore: 'pid,hostname',
            singleLine: false,
            messageFormat: '{req.method} {req.url} {msg}',
          },
        }
      : undefined,
    
    // Redact sensitive fields
    redact: {
      paths: redactPaths,
      censor: '[REDACTED]',
    },
    
    // Custom serializers
    serializers,
    
    // Generate request ID
    genReqId,
    
    // Base configuration
    base: {
      env: process.env.NODE_ENV,
      service: 'studentdeals-api',
      version: process.env.npm_package_version || '1.0.0',
    },
    
    // Custom log message
    customSuccessMessage: (req: Request, res: any) => {
      return `${req.method} ${req.url} - ${res.statusCode}`;
    },
    
    customErrorMessage: (req: Request, res: any, err: Error) => {
      return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
    },
    
    // Log all requests (even successful ones)
    customLogLevel: (req: Request, res: any, err?: Error) => {
      if (err || res.statusCode >= 500) {
        return 'error';
      }
      if (res.statusCode >= 400) {
        return 'warn';
      }
      if (res.statusCode >= 300) {
        return 'info';
      }
      return 'info';
    },
    
    // Custom attributes to add to every log
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
      responseTime: 'duration',
    },
    
    // Auto-logging
    autoLogging: {
      ignore: (req: Request) => {
        // Don't log health checks (too noisy)
        return req.url === '/health' || req.url === '/health/db';
      },
    },
  },
  
  // Exclude certain routes from logging
  exclude: ['/health', '/health/db'],
};

/**
 * Custom logger for application-level logging
 * (not request-scoped)
 */
export const pinoAppConfig = {
  level: logLevel,
  
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  
  base: {
    env: process.env.NODE_ENV,
    service: 'studentdeals-api',
    version: process.env.npm_package_version || '1.0.0',
  },
  
  redact: {
    paths: redactPaths,
    censor: '[REDACTED]',
  },
};

