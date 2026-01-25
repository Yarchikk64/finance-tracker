import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon("postgresql://postgres:YarZcbr2004Safe@vyadmpxbzmirgsfsulnd.supabase.co/postgres");
export const db = drizzle(sql);