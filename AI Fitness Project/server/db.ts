import 'dotenv/config';  // Add this as the FIRST line
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../db/schema";

// Remove or update the error check
const url = process.env.DATABASE_URL || "./sqlite.db";

const sqlite = new Database(url);
export const db = drizzle(sqlite, { schema });

console.log('✅ Database connected');