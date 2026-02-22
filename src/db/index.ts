import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const DB_PATH = process.env.DATABASE_URL ?? "data/sqlite.db";
const client = new Database(DB_PATH, { create: true });

// Enable WAL mode for better concurrent read performance
client.run("PRAGMA journal_mode = WAL;");

export const db = drizzle(client, { schema });
