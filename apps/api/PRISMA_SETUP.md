# Prisma Setup Guide

This document outlines the Prisma setup and configuration for the StudentDeals API.

## Prisma Version

We use **Prisma v6** with the latest extensions API. The old `$use` middleware has been removed in Prisma v6.

## Key Changes from Prisma v5 to v6

### ❌ Removed: `$use` Middleware
```typescript
// OLD (Prisma v5) - NO LONGER WORKS
this.$use(async (params, next) => {
  // middleware logic
});
```

### ✅ New: `$extends` Extensions
```typescript
// NEW (Prisma v6) - Use extensions
const logExt = Prisma.defineExtension({
  query: {
    $allModels: {
      $allOperations({ args, query, model, operation }) {
        const start = Date.now();
        return query(args).finally(() => {
          console.log(`[PRISMA] ${model}.${operation} in ${Date.now() - start}ms`);
        });
      }
    }
  }
});

const extended = this.$extends(logExt);
```

## Current Implementation

Our `PrismaService` uses Prisma v6 extensions for:

1. **Sentry Tracing**: Automatic span creation for all database queries
2. **Query Logging**: Development-only query timing and slow query warnings
3. **Error Handling**: Automatic error capture in Sentry with context

### PrismaService Features

- **ConfigService Integration**: Uses `ConfigService` to detect environment
- **Extension Chaining**: Combines multiple extensions using `$extends()`
- **Method Forwarding**: Uses `Object.assign()` to forward all methods to extended client
- **Type Safety**: Maintains full TypeScript support

## Usage

```typescript
// In your service
constructor(private prisma: PrismaService) {}

async getUsers() {
  // All queries are automatically traced and logged
  return this.prisma.user.findMany();
}
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/studentdeals"

# Environment
NODE_ENV="development" # or "production"
```

## Development vs Production

- **Development**: Full query logging, slow query warnings, detailed Sentry spans
- **Production**: Error logging only, optimized Sentry spans

## Troubleshooting

### "this.$use is not a function"
This error occurs when using Prisma v6 with old v5 middleware code. Update to use `$extends` instead.

### Extension Not Working
Ensure you're calling `Object.assign(this, this.extendedClient)` in `onModuleInit()`.

### Type Errors
Make sure to run `pnpm prisma generate` after schema changes.

## Migration Checklist

- [x] Remove all `$use` middleware calls
- [x] Implement equivalent functionality with `$extends`
- [x] Update PrismaService to use ConfigService
- [x] Add proper error handling
- [x] Maintain type safety
- [x] Test in development and production

## Resources

- [Prisma Extensions Documentation](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions)
- [Prisma v6 Migration Guide](https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-6)