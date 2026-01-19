import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),
    // shadowDatabaseUrl: env('DIRECT_URL'),
  },

  migrations: {
    path: './prisma/migrations', // relative to project root
  },
});
