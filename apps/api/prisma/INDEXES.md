# Database Indexes Documentation

This document describes the database indexes implemented in our Prisma schema for optimal query performance.

## User Table Indexes

### Primary Indexes
- **`id`** (Primary Key) - Unique identifier for users
- **`email`** (Unique Index) - Ensures email uniqueness and fast lookups

### Performance Indexes
- **`email`** - Redundant but explicit for clarity (already unique)
- **`emailVerifiedAt`** - For finding verified/unverified users
- **`createdAt`** - For user analytics and pagination

### Query Patterns Supported
```sql
-- Find user by email (login)
SELECT * FROM users WHERE email = 'user@example.com';

-- Find verified users
SELECT * FROM users WHERE emailVerifiedAt IS NOT NULL;

-- Find unverified users
SELECT * FROM users WHERE emailVerifiedAt IS NULL;

-- User analytics (recent registrations)
SELECT * FROM users WHERE createdAt >= '2024-01-01' ORDER BY createdAt DESC;

-- Pagination
SELECT * FROM users ORDER BY createdAt DESC LIMIT 10 OFFSET 20;
```

## EmailVerificationToken Table Indexes

### Primary Indexes
- **`id`** (Primary Key) - Unique identifier for tokens
- **`token`** (Unique Index) - Ensures token uniqueness and fast lookups

### Performance Indexes
- **`userId`** - For finding tokens by user
- **`token`** - Redundant but explicit for clarity (already unique)
- **`expiresAt`** - For cleanup of expired tokens
- **`usedAt`** - For finding used/unused tokens

### Composite Indexes
- **`(userId, expiresAt)`** - For finding user's active (non-expired) tokens
- **`(userId, usedAt)`** - For finding user's token usage history

### Query Patterns Supported
```sql
-- Find token by value (verification)
SELECT * FROM email_verification_tokens WHERE token = 'abc123';

-- Find user's tokens
SELECT * FROM email_verification_tokens WHERE userId = 'user123';

-- Find user's active tokens
SELECT * FROM email_verification_tokens 
WHERE userId = 'user123' AND expiresAt > NOW();

-- Find user's used tokens
SELECT * FROM email_verification_tokens 
WHERE userId = 'user123' AND usedAt IS NOT NULL;

-- Cleanup expired tokens
DELETE FROM email_verification_tokens WHERE expiresAt < NOW();

-- Find unused tokens
SELECT * FROM email_verification_tokens WHERE usedAt IS NULL;
```

## Index Performance Impact

### Benefits
- **Faster lookups** - O(log n) instead of O(n) for indexed columns
- **Efficient sorting** - Indexes support ORDER BY operations
- **Optimized joins** - Foreign key indexes speed up JOIN operations
- **Reduced I/O** - Less disk access for common queries

### Trade-offs
- **Storage overhead** - Each index requires additional disk space
- **Write performance** - Indexes slow down INSERT/UPDATE/DELETE operations
- **Maintenance** - Indexes need to be updated when data changes

## Monitoring and Maintenance

### Query Performance
```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check table statistics
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del, n_live_tup, n_dead_tup
FROM pg_stat_user_tables;
```

### Index Maintenance
```sql
-- Analyze table statistics
ANALYZE users;
ANALYZE email_verification_tokens;

-- Reindex if needed (rarely required)
REINDEX INDEX users_email_key;
```

## Future Considerations

### Potential Additional Indexes
- **`(email, emailVerifiedAt)`** - For finding verified users by email
- **`(createdAt, emailVerifiedAt)`** - For analytics on verification rates
- **Partial indexes** - For specific query patterns (e.g., only unverified users)

### Query Optimization
- Use `EXPLAIN ANALYZE` to verify index usage
- Monitor slow query logs
- Consider query-specific indexes for complex queries

## Migration Strategy

When adding new indexes to production:

1. **Test in development** - Verify indexes work as expected
2. **Create migration** - Use `prisma migrate dev`
3. **Monitor performance** - Check query execution plans
4. **Rollback plan** - Keep migration reversible

## Best Practices

1. **Index only what you query** - Don't create unnecessary indexes
2. **Composite indexes order matters** - Most selective columns first
3. **Monitor index usage** - Remove unused indexes
4. **Consider partial indexes** - For filtered queries
5. **Test with realistic data** - Index performance varies with data size
