import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/Schema.tsx',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_7uBIKpHDgXo1@ep-plain-sun-a5dn4g7y-pooler.us-east-2.aws.neon.tech/AI-Content-Generator?sslmode=require'
  },
});
