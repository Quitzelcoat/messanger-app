// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

const migrationUrl = env('DATABASE_URL')
  ? `${env('DATABASE_URL')}&sslmode=require&channel_binding=disable`
  : '';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: migrationUrl, // The CLI uses this for 'migrate deploy'
  },
  migrations: {
    path: './prisma/migrations',
  },
});
