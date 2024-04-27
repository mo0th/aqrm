import 'dotenv/config' // make sure to install dotenv package
import type { Config } from 'drizzle-kit'

export default {
  driver: 'pg',
  out: './src/lib/db',
  schema: './src/lib/db/schema.ts',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config
