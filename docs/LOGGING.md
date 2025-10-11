# Logging Guide

Complete guide for structured logging with Pino in the StudentDeals.uz API.

## Table of Contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Usage](#usage)
- [Request-Scoped Logging](#request-scoped-logging)
- [Sensitive Data Masking](#sensitive-data-masking)
- [Log Levels](#log-levels)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Overview

We use **Pino** for high-performance, structured JSON logging. Pino is:
- ✅ **Fast** - 5-10x faster than Winston
- ✅ **Structured** - JSON logs for easy parsing
- ✅ **Request-scoped** - Automatic requestId tracking
- ✅ **Secure** - Automatic sensitive field masking
- ✅ **Configurable** - Environment-based log levels

### Key Features

| Feature | Description |
|---------|-------------|
| **Request ID** | Unique ID per request for tracing |
| **Auto-masking** | Passwords, tokens automatically redacted |
| **Log Levels** | debug, info, warn, error |
| **Pretty Printing** | Colorized logs in development |
| **JSON Logs** | Structured logs in production |
| **Performance** | < 1ms overhead per log |

---

## Configuration

### Environment Variables

```bash
# Log level (debug, info, warn, error)
LOG_LEVEL=info

# Node environment
NODE_ENV=production
```

**Log Levels by Environment:**

| Environment | Default Level | Description |
|-------------|---------------|-------------|
| Development | `debug` | All logs including debug |
| Production | `info` | Info, warn, error only |
| Test | `warn` | Warnings and errors only |

### Configuration File

Located: `apps/api/src/logger/logger.config.ts`

```typescript
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');
```

---

## Usage

### Basic Logging

```typescript
import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class UserService {
  constructor(
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger
  ) {}

  async createUser(email: string) {
    this.logger.info('Creating user');
    
    // User creation logic
    
    this.logger.info({ email }, 'User created successfully');
  }
}
```

### Log Methods

```typescript
// Info - general information
this.logger.info('User logged in');

// Warn - warning, not an error
this.logger.warn('API rate limit approaching');

// Error - error occurred
this.logger.error('Payment processing failed');

// Debug - detailed debug info (only in development)
this.logger.debug('Debugging user state');
```

### Structured Logging

```typescript
// ✅ Good - structured with context
this.logger.info(
  {
    userId: '123',
    action: 'login',
    ip: '192.168.1.1',
    timestamp: new Date().toISOString(),
  },
  'User logged in'
);

// ❌ Bad - unstructured string
this.logger.info(`User 123 logged in from 192.168.1.1`);
```

**Benefits of Structured Logs:**
- Easy to search/filter in log aggregation tools
- Machine-readable for analysis
- Consistent format across services

---

## Request-Scoped Logging

Every HTTP request automatically gets a unique `requestId` that is included in all logs.

### How It Works

1. **Request arrives** → Pino generates UUID
2. **All logs** include `requestId`
3. **Response sent** → Request logged with duration

### Example Output

```json
{
  "level": 30,
  "time": 1699564800000,
  "req": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "method": "POST",
    "url": "/auth/login"
  },
  "msg": "Request received"
}
```

### Using Request ID in Code

```typescript
import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly logger: PinoLogger) {}

  async login(req: Request, email: string) {
    // requestId automatically included
    this.logger.info({ email }, 'Login attempt');
    
    // Access requestId if needed
    const requestId = req.id;
    this.logger.info({ requestId }, 'Processing login');
  }
}
```

### X-Request-ID Header

If a request includes an `X-Request-ID` header (from load balancer, proxy, etc.), it will be used instead of generating a new one.

```bash
# Client sends request with ID
curl -H "X-Request-ID: my-custom-id-123" \
  https://api.studentdeals.uz/health

# All logs will use: my-custom-id-123
```

---

## Sensitive Data Masking

Pino automatically masks sensitive fields to prevent accidental logging of passwords, tokens, etc.

### Automatically Masked Fields

| Field | Example |
|-------|---------|
| `password` | `[REDACTED]` |
| `passwordHash` | `[REDACTED]` |
| `token` | `[REDACTED]` |
| `accessToken` | `[REDACTED]` |
| `refreshToken` | `[REDACTED]` |
| `secret` | `[REDACTED]` |
| `apiKey` | `[REDACTED]` |
| `apiSecret` | `[REDACTED]` |
| `authorization` header | `[REDACTED]` |
| `cookie` header | `[REDACTED]` |

### Example

```typescript
// Before masking (in code):
this.logger.info({
  email: 'user@example.com',
  password: 'super-secret-password',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}, 'User login');

// After masking (in logs):
{
  "email": "user@example.com",
  "password": "[REDACTED]",
  "token": "[REDACTED]",
  "msg": "User login"
}
```

### Adding Custom Masked Fields

Edit `apps/api/src/logger/logger.config.ts`:

```typescript
const redactPaths = [
  // ... existing fields
  
  // Add custom fields
  'customSecret',
  'req.body.customSecret',
  'privateKey',
];
```

---

## Log Levels

### Level Hierarchy

| Level | Value | Description | When to Use |
|-------|-------|-------------|-------------|
| `fatal` | 60 | Fatal errors | App crashes |
| `error` | 50 | Errors | Exceptions, failures |
| `warn` | 40 | Warnings | Potential issues |
| `info` | 30 | Information | General info |
| `debug` | 20 | Debug info | Development |
| `trace` | 10 | Trace info | Rarely used |

### Setting Log Level

**Environment Variable:**
```bash
# Show only errors and warnings
LOG_LEVEL=warn

# Show everything
LOG_LEVEL=debug
```

**Per Logger:**
```typescript
// Set level for specific logger
this.logger.logger.level = 'debug';
```

### Log Level Guidelines

#### `debug` - Development & Troubleshooting
```typescript
this.logger.debug({ query, params }, 'Executing database query');
this.logger.debug({ state }, 'User state updated');
```

#### `info` - Normal Operations
```typescript
this.logger.info({ userId }, 'User logged in');
this.logger.info({ orderId }, 'Order created');
```

#### `warn` - Potential Issues
```typescript
this.logger.warn({ attempts: 3 }, 'Max login attempts approaching');
this.logger.warn({ quota: 95 }, 'API quota at 95%');
```

#### `error` - Errors & Exceptions
```typescript
this.logger.error({ err, userId }, 'Payment processing failed');
this.logger.error({ err }, 'Database connection lost');
```

---

## Best Practices

### ✅ Do

**1. Use Structured Logging**
```typescript
// ✅ Good
this.logger.info({ userId, action: 'delete' }, 'User deleted account');

// ❌ Bad
this.logger.info(`User ${userId} deleted account`);
```

**2. Include Context**
```typescript
// ✅ Good - includes context
this.logger.error(
  {
    err,
    userId,
    orderId,
    amount,
  },
  'Payment failed'
);

// ❌ Bad - no context
this.logger.error('Payment failed');
```

**3. Log at Appropriate Level**
```typescript
// ✅ Good
this.logger.info('User logged in'); // Normal operation
this.logger.warn('Rate limit approaching'); // Warning
this.logger.error('Payment failed'); // Error

// ❌ Bad
this.logger.error('User logged in'); // Not an error!
```

**4. Use Child Loggers for Context**
```typescript
// ✅ Good - reusable context
const childLogger = this.logger.logger.child({ userId, requestId });
childLogger.info('Fetching user profile');
childLogger.info('Updating user settings');
childLogger.info('User logout');
```

**5. Log Performance Metrics**
```typescript
const startTime = Date.now();
await someOperation();
const duration = Date.now() - startTime;

this.logger.info({ duration, operation: 'fetch-users' }, 'Operation completed');
```

### ❌ Don't

**1. Don't Log Sensitive Data**
```typescript
// ❌ Bad - might log password if masking fails
this.logger.info({ userInput: req.body }, 'User input received');

// ✅ Good - explicitly exclude sensitive fields
const { password, ...safeData } = req.body;
this.logger.info({ safeData }, 'User input received');
```

**2. Don't Log Too Much**
```typescript
// ❌ Bad - excessive logging
this.logger.debug('Starting function');
this.logger.debug('Variable x = 1');
this.logger.debug('Variable y = 2');
this.logger.debug('Calling helper');
this.logger.debug('Helper returned');
this.logger.debug('Ending function');

// ✅ Good - concise logging
this.logger.debug({ x, y }, 'Processing calculation');
```

**3. Don't Use String Concatenation**
```typescript
// ❌ Bad - string concatenation
this.logger.info('User ' + userId + ' logged in at ' + timestamp);

// ✅ Good - structured
this.logger.info({ userId, timestamp }, 'User logged in');
```

**4. Don't Log in Loops (usually)**
```typescript
// ❌ Bad - logs 1000 times
for (const user of users) {
  this.logger.info({ user }, 'Processing user');
}

// ✅ Good - log once with summary
this.logger.info({ count: users.length }, 'Processing users');
// ... process users ...
this.logger.info({ processed: users.length }, 'Users processed');
```

---

## Examples

### Example 1: User Authentication

```typescript
import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger
  ) {}

  async login(email: string, password: string) {
    this.logger.info({ email }, 'Login attempt');

    try {
      const user = await this.validateUser(email, password);
      
      if (!user) {
        this.logger.warn({ email }, 'Invalid credentials');
        throw new UnauthorizedException();
      }

      const token = this.generateToken(user);
      
      this.logger.info(
        { userId: user.id, email },
        'Login successful'
      );

      return { user, token };
    } catch (error) {
      this.logger.error(
        { err: error, email },
        'Login failed'
      );
      throw error;
    }
  }
}
```

### Example 2: Database Operations

```typescript
@Injectable()
export class UserRepository {
  constructor(
    @InjectPinoLogger(UserRepository.name)
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService
  ) {}

  async findById(id: string) {
    const startTime = Date.now();
    
    this.logger.debug({ userId: id }, 'Fetching user from database');

    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      const duration = Date.now() - startTime;
      
      this.logger.debug(
        { userId: id, duration, found: !!user },
        'User fetch completed'
      );

      return user;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.error(
        { err: error, userId: id, duration },
        'User fetch failed'
      );
      
      throw error;
    }
  }
}
```

### Example 3: External API Calls

```typescript
@Injectable()
export class PaymentService {
  constructor(
    @InjectPinoLogger(PaymentService.name)
    private readonly logger: PinoLogger
  ) {}

  async processPayment(orderId: string, amount: number) {
    const startTime = Date.now();
    
    this.logger.info(
      { orderId, amount },
      'Initiating payment processing'
    );

    try {
      const response = await axios.post(
        'https://payment-gateway.com/charge',
        { orderId, amount }
      );

      const duration = Date.now() - startTime;
      
      this.logger.info(
        {
          orderId,
          amount,
          duration,
          statusCode: response.status,
          transactionId: response.data.id,
        },
        'Payment processed successfully'
      );

      return response.data;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.error(
        {
          err: error,
          orderId,
          amount,
          duration,
          statusCode: error.response?.status,
        },
        'Payment processing failed'
      );

      throw error;
    }
  }
}
```

### Example 4: Business Metrics

```typescript
@Injectable()
export class AnalyticsService {
  constructor(
    @InjectPinoLogger(AnalyticsService.name)
    private readonly logger: PinoLogger
  ) {}

  trackUserSignup(userId: string, source: string) {
    this.logger.info(
      {
        type: 'business-metric',
        metric: 'user_signup',
        userId,
        source,
        timestamp: new Date().toISOString(),
      },
      'User signup tracked'
    );
  }

  trackPurchase(userId: string, amount: number, items: number) {
    this.logger.info(
      {
        type: 'business-metric',
        metric: 'purchase',
        userId,
        amount,
        items,
        timestamp: new Date().toISOString(),
      },
      'Purchase tracked'
    );
  }
}
```

---

## Troubleshooting

### Logs not appearing

**Problem:** No logs in console

**Solution:**
1. Check `LOG_LEVEL` environment variable
2. Ensure logger is properly injected
3. Check if logger is configured in `app.module.ts`
4. Verify `bufferLogs: true` and `app.flushLogs()` in `main.ts`

### Sensitive data not masked

**Problem:** Passwords appearing in logs

**Solution:**
1. Check field name matches `redactPaths` in config
2. Add custom field to `redactPaths`
3. Verify masking is enabled in config
4. Check if using nested object paths correctly

### Request ID not showing

**Problem:** No `requestId` in logs

**Solution:**
1. Ensure `LoggerModule.forRoot(pinoConfig)` in `app.module.ts`
2. Check `genReqId` function in config
3. Verify express is properly configured
4. Check if using request-scoped injection

### Logs too verbose

**Problem:** Too many logs in production

**Solution:**
```bash
# Set higher log level
LOG_LEVEL=warn

# Or in code
this.logger.logger.level = 'warn';
```

### Performance issues

**Problem:** Logging slowing down application

**Solution:**
1. Reduce log level in production
2. Don't log in tight loops
3. Use async transports for production
4. Consider log sampling for high-traffic endpoints

---

## Log Formats

### Development (Pretty)

```
[14:32:15.123] INFO (UserService): User logged in
    userId: "123"
    email: "user@example.com"
    requestId: "a1b2c3d4..."
```

### Production (JSON)

```json
{
  "level": 30,
  "time": 1699564800000,
  "pid": 12345,
  "hostname": "api-server-1",
  "service": "studentdeals-api",
  "env": "production",
  "request": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "method": "POST",
    "url": "/auth/login"
  },
  "userId": "123",
  "email": "user@example.com",
  "msg": "User logged in"
}
```

---

## Integration with Sentry

Logs are automatically integrated with Sentry for error tracking. Errors logged with `logger.error()` are sent to Sentry.

```typescript
try {
  await someOperation();
} catch (error) {
  // This error will be sent to Sentry
  this.logger.error({ err: error, context }, 'Operation failed');
}
```

---

## Resources

- [Pino Documentation](https://getpino.io/)
- [nestjs-pino Documentation](https://github.com/iamolegga/nestjs-pino)
- [Pino Best Practices](https://github.com/pinojs/pino/blob/master/docs/best-practices.md)

---

**Last Updated:** 2025-10-11  
**Version:** 1.0  
**Owner:** Engineering Team

