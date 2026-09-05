import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Query the database over HTTPS/WebSocket instead of raw Postgres TCP —
// needed because networks that firewall outbound DB ports (5432/6543) still
// allow standard web traffic through. See README for why.
neonConfig.webSocketConstructor = ws;

function createClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
}

// Standard Next.js dev-mode singleton so hot-reload doesn't spawn a new
// PrismaClient (and a new connection pool) on every file change.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
